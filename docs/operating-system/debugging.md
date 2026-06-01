---
title: "Debugging the Home Assistant Operating System"
sidebar_label: Debugging
---

:::info
This section is not for end users.
End users should use the [SSH app (formerly known as an add-on)] to SSH into Home Assistant.
This is for **developers** of Home Assistant.
Do not ask for support if you are using these options.
:::

[SSH app]: https://github.com/home-assistant/addons/tree/master/ssh
[Home Assistant Operating System configuration]: /docs/operating-system/configuration
[hassos-config]: https://github.com/home-assistant/operating-system/blob/dev/buildroot-external/rootfs-overlay/usr/sbin/hassos-config

## Enabling SSH access to the host

SSH access through the [SSH app] (on port 22 by default) only grants limited privileges.
Here, you are asked for a username and password when typing the 'login' command.
Follow the steps below to enable a separate SSH access on port 22222.
It works independently of the app.

The following guide uses the [`/usr/sbin/hassos-config`][hassos-config] script, which enables the SSH server (`dropbear`) on system startup.
Further information is provided at [Home Assistant Operating System configuration].

:::warning
- This guide enables unconfined access to the Home Assistant OS (the "host") with full `root` privileges.
- Unplugging power or SD card without a clean shutdown can damage your SD card!
- Do not use methods 1 and 2 at the same time.
- Do not mix method 1 and 2 for enabling and disabling SSH access.
:::

Follow these rules:
- Check the respective partition layout for [USB-Drive](#partition-layout-usb-drive) or [hassos-boot](#partition-layout-hassos-boot).
- `authorized_keys` must use POSIX-standard newline control characters, i.e. `LF`, ASCII `\n` (not Windows (CR LF, `\r\n`), not macOS (CR, `\r`))
- `authorized_keys` must only contain ASCII characters
- `authorized_keys` must be ASCII-encoded (not `UTF-8`, not Windows `ISO_8859-1`).

### Method 1: USB Drive

1. Use a USB drive with a partition named `CONFIG` (case sensitive) formatted as FAT, ext4, or NTFS.
2. See [Generating SSH Keys](#generating-ssh-keys) section below if you need help generating keys.
3. Create an `authorized_keys` text file (without a file extension) containing your public key(s), one per line, and place it in the root of the USB drive's `CONFIG` partition.
4. Connect the USB drive to your Home Assistant OS device
   - Option 1: while up and running, explicitly import the drive's contents using the `ha os import` command (e.g. via SSH to the [SSH app] on port 22)
   - Option 2: reboot the device leaving the drive attached, which automatically triggers the import.

#### Partition layout USB-Drive 

Only `/authorized_keys` should be present.

```shell
/ # Partition: CONFIG
└── authorized_keys
```

### Method 2: hassos-boot
This method requires writing to the boot partition, e.g. by mounting the SD card.

See [Example Workflow](#example-workflow) section below for a complete guide.

1. Place the `authorized_keys` file at `/CONFIG/authorized_keys` in the mounted partition `hassos-boot`.
   - The partition is auto-mounted at different locations depending on your system (e.g. `/run/media/USER/hassos-boot` or `/mnt/hassos-boot`). 
   - The file will ultimately be mounted at `/boot/CONFIG/authorized_keys`
2. Eject the SD card, to prevent write faults.
3. Insert and reboot the Home Assistant device.

Note that this method requires you to remove the file on the physical partition `hassos-boot`, if you want to disable the SSH server!

#### Partition layout hassos-boot

:::warning
Changing, adding or removing anything other than `CONFIG` can result in physical damage to your device.
Be aware, that _open & close_ can modify a file, e.g. when Auto-Save is on, which can mess with the encoding
To be absolutely certain to not change anything else, follow the [Example Workflow](#example-workflow).
:::

```shell
/ # Partition: hassos-boot
├── ...
├── cmdline.txt
├── CONFIG
│   └── authorized_keys
├── config.txt
└── ...
```

### SSH access
You should now be able to connect to your device as root over SSH on port 22222. On Mac/Linux, use:

```shell
ssh root@homeassistant.local -p 22222
```

If you have an older installation or have changed your hostname, you may need to adjust the command above accordingly.
You can alternatively use the device's IP address instead of the hostname.

You will be logged in as `root` with the `/root` folder set as the working directory.
[Home Assistant OS] is a hypervisor for Docker.
See the [Supervisor Architecture] documentation for information regarding the Supervisor.
The Supervisor offers an API to manage the host and running the Docker containers.
Home Assistant itself and all installed addons run in separate Docker containers.

[Home Assistant OS]: https://github.com/home-assistant/operating-system
[Supervisor Architecture]: /architecture_index.md

## Disabling SSH access to the host

1. Use a USB drive with a partition named `CONFIG` (case sensitive) formatted as FAT, ext4, or NTFS.
Remove any existing `authorized_keys` file from the root of that partition.
Using method 2, delete the file `/CONFIG/authorized_keys` on the partition `hassos-boot`, while keeping `CONFIG`.

2. When the Home Assistant OS device reboots with a present `CONFIG` without `authorized_keys`, any existing SSH public keys will be removed and SSH access on port 22222 will be disabled.

### Disabling SSH access partition layout USB-Drive
Remove `authorized_keys` from the partition `CONFIG`.
```shell
/ # Partition: CONFIG
└──
```
### Disabling SSH access Partition layout hassos-boot
Only remove `authorized_keys` from the partition `hassos-boot`.
Keep `CONFIG`.
Do not touch any other files.
```shell
/ # Partition: hassos-boot
├── CONFIG
│   └──
└── ...
```

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

[github-instructions]: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent
[windows-keys]: https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/create-with-putty/

## Generating SSH Keys

Create a separate key named `id_hassos` for Home Assistant.
Creating SSH keys is as simple as running `ssh-keygen` or `PuTTYgen` on your local machine and following prompts.
Generating an asymmetric key creates 2 files:

1. `id_XYZ`: This is your private decryption key, which you should _never_ export or upload.
2. `id_XYZ.pub`: This is your public encryption key, which others use.

This means `authorized_keys` are only _public_ keys `id_XYZ.pub`, _never_ private keys.
Key filenames are inconsequential and only identify the correct key.

Generate keys on your local machine and add them to your `authorized_keys` file.
- [`ssh-keygen`][github-instructions] (Linux, WSL, Git for Windows)
- [`PuTTYgen`][windows-keys]
- [inbrowser.app](https://inbrowser.app/tools/ssh-key-generator/) (Discouraged, only use if you cannot generate keys on your local machine)

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