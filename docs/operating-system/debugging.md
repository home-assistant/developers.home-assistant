---
title: "Debugging the Home Assistant Operating System"
sidebar_label: Debugging
---

:::info
This section is not for end users. End users should use the [SSH add-on] to SSH into Home Assistant. This is for **developers** of Home Assistant. Do not ask for support if you are using these options.
:::

[SSH add-on]: https://github.com/home-assistant/hassio-addons/tree/master/ssh

## SSH access

Home Assistant has two different types of SSH access.
- End user SSH on port 22, provided by the [SSH add-on]. Easy to setup and use, but the accessible scope is limited.
- Host access SSH on port 22222. This method provides full access to the host with all privileges (e.g. access to docker).

### Enable SSH host access

:::info
A public/private key pair is required when setting up SSH host access, see [Generating SSH Keys](#generating-ssh-keys) for help.
:::

Format a USB drive with FAT, ext4 or NTFS and name it `CONFIG` (case-sensitive). Create a file called `authorized_keys` (no extension) in the root of the USB drive, containing your public key. The file needs to be ANSI encoded and with Unix line ends (LF).

Next connect the USB drive to your Home Assistant OS device and import the public key. This can be either done via the CLI command `ha os import` when connected to ssh on port 22 (using the [SSH add-on]) or via a reboot of the system (the file will be imported on reboot automatically).

:::info
The SSH host access remains active even after the USB drive is disconnected from the system.
:::

You should then be able to SSH into your Home Assistant OS device as `root` on port 22222:

```shell
ssh root@homeassistant.local -p 22222
```

If you have an older installation or have changed your hostname, you may need to use a different hostname in the command above. You can check the correct hostname to use in the System page of the Supervisor interface in Home Assistant.

You will be logged in as root in the ```/root``` folder. [Home Assistant OS] is a hypervisor for Docker. See the [Supervisor Architecture] documentation for information regarding the Supervisor. The Supervisor offers an API to manage the host and running the Docker containers. Home Assistant itself and all installed addons run in separate Docker containers.

[CLI tasks]: https://www.home-assistant.io/hassio/commandline/
[Home Assistant OS]: https://github.com/home-assistant/operating-system
[Supervisor Architecture]: /architecture_index.md

### Turning off SSH host access

Use a USB drive formatted with FAT, ext4 or NTFS and name it `CONFIG` (case-sensitive). Remove any existing `authorized_keys` file from the drive and leave the drive **empty**. When the Home Assistant OS device is rebooted with this drive inserted, any existing keys will be removed and the host SSH service on port 22222 will be stopped.

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

[windows-keys]: https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-putty-on-digitalocean-droplets-windows-users
[linux-keys]: https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#platform-mac

### Generating SSH Keys

A ssh key pair consists of a public and private key. The private key is used by a SSH client to authenticate on a server. The public key on the other hand needs be added to the `authorized_keys` file on the server where Home Assistant runs, so that the server can validate a incoming request.

On Windows new key pairs can be created and managed with [PuTTYgen](https://www.putty.org), follow [this][windows-keys] tutorial to get started. The content for the `authorized_keys` file is the content as-it in the box below _"Public key for pasting into the authorized_keys file"_.

On Linux and Mac a new key pair can be generated via the follow command or [this][linux-keys] tutorial.
```shell
ssh-keygen -t ed25519 -C "your_email@example.com"
# ...
Your identification has been saved in /root/.ssh/id_ed25519 (private key)
Your public key has been saved in /root/.ssh/id_ed25519.pub (public key)
```

Similar to Windows the content for the `authorized_keys` file is inside the `.pub` file, which contains the public key.
