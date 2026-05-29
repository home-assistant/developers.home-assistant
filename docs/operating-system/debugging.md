---
title: "Debugging the Home Assistant Operating System"
sidebar_label: Debugging
---

:::info
This section is not for end users. End users should use the [SSH app (formerly known as an add-on)] to SSH into Home Assistant. This is for **developers** of Home Assistant. Do not ask for support if you are using these options.
:::

[SSH app]: https://github.com/home-assistant/addons/tree/master/ssh
[Home Assistant Operating System configuration]: /docs/operating-system/configuration
[hassos-config]: https://github.com/home-assistant/operating-system/blob/dev/buildroot-external/rootfs-overlay/usr/sbin/hassos-config

## Enabling SSH access to the host

:::info
SSH access through the [SSH app] (on port 22 by default) only grants limited privileges, and you will be asked for a username and password when typing the 'login' command. Follow the steps below to enable a separate SSH access on port 22222 that works independently of the app and gives you direct access to the Home Assistant OS (the "host") with full privileges.
:::

The following guide uses the [`hassos-config`][hassos-config] script, which enables the SSH server (`dropbear`) on system startup.
Further information is provided at [Home Assistant Operating System configuration].

:::warning
Do not use methods 1 and 2 at the same time.
Do not mix method 1 and 2 for setup and disable. 
:::

:::tip
Make sure when you are copying the public key(s) to the root of the USB drive that you correctly name the file `authorized_keys` without a `.pub` file extension.
:::

### Method 1: USB Drive

1. Use a USB drive with a partition named `CONFIG` (case sensitive) formatted as FAT, ext4, or NTFS. Create an `authorized_keys` text file (without a file extension) containing your public key(s), one per line, and place it in the root of the USB drive's `CONFIG` partition. The file must use POSIX-standard newline control characters (LF), not Windows ones (CR LF), and needs to be ASCII character encoded (i.e. mustn't contain any special characters in the comments).

   See [Generating SSH Keys](#generating-ssh-keys) section below if you need help generating keys.

2. Connect the USB drive to your Home Assistant OS device and either explicitly import the drive's contents using the `ha os import` command (e.g. via SSH to the [SSH app] on port 22) or reboot the device leaving the drive attached, which automatically triggers the import.

### Method 2: hassos-boot
This method requires writing to the boot partition, e.g. by mounting the SD card.

See [Example Workflow](#example-workflow) section below for a complete guide.

1. Place the `authorized_keys` file at `/CONFIG/authorized_keys` in the mounted partition `hassos-boot`.
   - The partition is auto-mounted at different locations dependending on your system (e.g. `/run/media/USER/hassos-boot` or `/mnt/hassos-boot`). 
   - The file will ultimately be mounted at `/boot/CONFIG/authorized_keys`
2. Eject the SD card, to prevent write faults.
3. Insert and reboot the Home Assistant device.

Note that this method requires you to remove the file on the physical partition `hassos-boot`, if you want to disable the SSH server!

### SSH access
You should now be able to connect to your device as root over SSH on port 22222. On Mac/Linux, use:

```shell
ssh root@homeassistant.local -p 22222
```

If you have an older installation or have changed your hostname, you may need to adjust the command above accordingly. You can alternatively use the device's IP address instead of the hostname.

You will be logged in as root with the `/root` folder set as the working directory. [Home Assistant OS] is a hypervisor for Docker. See the [Supervisor Architecture] documentation for information regarding the Supervisor. The Supervisor offers an API to manage the host and running the Docker containers. Home Assistant itself and all installed addons run in separate Docker containers.

[Home Assistant OS]: https://github.com/home-assistant/operating-system
[Supervisor Architecture]: /architecture_index.md

## Disabling SSH access to the host

1. Use a USB drive with a partition named `CONFIG` (case sensitive) formatted as FAT, ext4, or NTFS. Remove any existing `authorized_keys` file from the root of that partition. Using method 2, delete the file `/CONFIG/authorized_keys` on the partition `hassos-boot`, while keeping `CONFIG`.

2. When the Home Assistant OS device is rebooted with a present `CONFIG` without `authorized_keys`, any existing SSH public keys will be removed and SSH access on port 22222 will be disabled.

## Checking the logs

```shell
# Logs from the supervisor service on the Host OS
journalctl -f -u hassos-supervisor.service

# Supervisor logs
docker logs hassio_supervisor

# Home Assistant logs
docker logs homeassistant
```

## Accessing the container bash

```shell
docker exec -it homeassistant /bin/bash
```

[windows-keys]: https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/create-with-putty/

## Generating SSH Keys

Windows instructions on how to generate and use private/public keys with Putty are found [here][windows-keys]. Instead of the droplet instructions, add the public key as per above instructions.

Alternative instructions for Mac, Windows and Linux can be found [here](https://docs.github.com/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent). Follow the steps under *Generating a new SSH key* (the other sections are not applicable to Home Assistant and can be ignored).

Make sure to copy the ***public*** key of the SSH key pair you just created. By default, the public key file is named `id_ed25519.pub` (in case of the Ed25519 elliptic curve algorithm) or `id_rsa.pub` (in case of the older RSA algorithm), i.e. it should have a `.pub` filename suffix. It is saved to the same folder as the private key (which is named `id_ed25519` or `id_rsa` by default).

## Example Workflow

The following commands show a complete example workflow to get the desired setup (Linux, WSL, etc.):

```console
/run/media/USER/hassos-boot
├── CONFIG
│   └── authorized_keys
└── ...

/home/USER/.ssh/
├── config
├── id_hassos
├── id_hassos.pub
└── ...
```

1. Example SSH Key Creation

```shell
# Prepare hassos-boot
MOUNT_PATH="/run/media/${USER}/hassos-boot"
sudo mount --label hassos-boot --mkdir "${MOUNT_PATH}"
mkdir -p "${MOUNT_PATH}/CONFIG"

# Prepare SSH-Key
SSH_FILE="/home/${USER}/.ssh/id_hassos"
ssh-keygen -t ed25519 -f ${SSH_FILE} -C "Home Assistant root@homeassistant.local"
cat ${SSH_FILE}.pub | tee -a authorized_keys
sudo cp authorized_keys ${MOUNT_PATH}/CONFIG

# Unmount
sudo umount ${MOUNT_PATH} # if target is busy, close all accessing processes, and cd out of the path.
```

2. Example SSH Config setup
Optional: set `/home/${USER}/.ssh/config` to use an alias like `ssh homeassistant`.

```ssh-config
Host homeassistant
   HostName 192.168.x.x
   Port 22222
   User root
   IdentityFile ~/.ssh/id_hassos
```

Use `ssh homeassistant -D 1080` to instruct `DynamicForward 1080`, which also starts a SOCKS-proxy on `127.0.0.1:1080` during the connection.
This can tunnel traffic directly onto the host (given the proxy is used).
