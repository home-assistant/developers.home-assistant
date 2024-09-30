---
title: "Debugging the Home Assistant Operating System"
sidebar_label: Debugging
---

:::info
This section is not for end users. End users should use the [SSH add-on] to SSH into Home Assistant. This is for **developers** of Home Assistant. Do not ask for support if you are using these options.
:::

[SSH add-on]: https://github.com/home-assistant/addons/tree/master/ssh

## Enabling SSH access to the host

:::info
SSH access through the [SSH add-on] (on port 22 by default) only grants limited privileges, and you will be asked for a username and password when typing the 'login' command. Follow the steps below to enable a separate SSH access on port 22222 that works independently of the add-on and gives you direct access to the Home Assistant OS (the "host") with full privileges.
:::

1. Use a USB drive with a filesystem (sometime called partition) named `CONFIG` (case sensitive) formatted as FAT, ext4, or NTFS. Create an `authorized_keys` text file (without a file extension) containing your public key(s), one per line, and place it in the root of the USB drive's `CONFIG` filesystem. The file must use POSIX-standard newline control characters (LF), not Windows ones (CR LF), and needs to be ASCII character encoded (i.e. mustn't contain any special characters in the comments).

   See [Generating SSH Keys](#generating-ssh-keys) section below if you need help generating keys.

1. Connect the USB drive to your Home Assistant OS device and either explicitly import the drive's contents using the `ha os import` command (e.g. via SSH to the [SSH add-on] on port 22) or reboot the device leaving the drive attached, which automatically triggers the import.

:::tip
Make sure when you are copying the public key(s) to the root of the USB drive that you correctly name the file `authorized_keys` without a `.pub` file extension.
:::

You should now be able to connect to your device as root over SSH on port 22222. On Mac/Linux, use:

```shell
ssh root@homeassistant.local -p 22222
```

If you have an older installation or have changed your hostname, you may need to adjust the command above accordingly. You can alternatively use the device's IP address instead of the hostname.

You will be logged in as root with the `/root` folder set as the working directory. [Home Assistant OS] is a hypervisor for Docker. See the [Supervisor Architecture] documentation for information regarding the Supervisor. The Supervisor offers an API to manage the host and running the Docker containers. Home Assistant itself and all installed addons run in separate Docker containers.

[Home Assistant OS]: https://github.com/home-assistant/operating-system
[Supervisor Architecture]: /architecture_index.md

## Disabling SSH access to the host

1. Use a USB drive with a filesystem named `CONFIG` (case sensitive) formatted as FAT, ext4, or NTFS. Remove any existing `authorized_keys` file from the root of that filesystem.

1. When the Home Assistant OS device is rebooted with this drive inserted, any existing SSH public keys will be removed and SSH access on port 22222 will be disabled.

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

### Generating SSH Keys

Windows instructions on how to generate and use private/public keys with Putty are found [here][windows-keys]. Instead of the droplet instructions, add the public key as per above instructions.

Alternative instructions for Mac, Windows and Linux can be found [here](https://docs.github.com/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent). Follow the steps under *Generating a new SSH key* (the other sections are not applicable to Home Assistant and can be ignored).

Make sure to copy the ***public*** key of the SSH key pair you just created. By default, the public key file is named `id_ed25519.pub` (in case of the Ed25519 elliptic curve algorithm) or `id_rsa.pub` (in case of the older RSA algorithm), i.e. it should have a `.pub` filename suffix. It is saved to the same folder as the private key (which is named `id_ed25519` or `id_rsa` by default).
