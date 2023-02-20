---
title: "Debugging the Home Assistant Operating System"
sidebar_label: Debugging
---

:::info
This section is not for end users. End users should use the [SSH add-on] to SSH into Home Assistant. This is for **developers** of Home Assistant. Do not ask for support if you are using these options.
:::

[SSH add-on]: https://github.com/home-assistant/hassio-addons/tree/master/ssh

## SSH access to the host

:::info
SSH access through the [SSH add-on] (which will give you SSH access through port 22) will not provide you with all the necessary privileges, and you will be asked for a username and password when typing the 'login' command. You need to follow the steps below, which will setup a separate SSH access through port 22222 with all necessary privileges.
:::

### Home Assistant Operating System

Using a USB drive formatted with FAT32 or ext4 and named CONFIG (case sensitive), follow the following steps:

1. Create an ANSI-encoded (not UTF-8) file named `authorized_keys` (no extension) containing your public key. Ensure that the file has Unix line endings (LF) and not Windows line endings (CR LF). See section [Generating SSH Keys](#generating-ssh-keys) below for instructions on generating keys.
1. Place the `authorized_keys` file in the root of the USB drive.
1. Use the CLI (e.g., SSH to the [SSH add-on] on port 22) to import the `authorized_keys` file by issuing command `ha os import`. Alternatively, the file will be imported from the USB when the Home Assistant OS device is rebooted.
1. SSH root access to your host should now be available on port 22222.

:::tip
The `ha os import` command may respond `Command completed successfully` even if the import from USB did not occur. This has been seen in the case that the USB drive didn't mount successfully and the import command proceeded to import from the boot drive. If access fails even after an apparently successful import then execute command `ha host logs` and look for `Starting HassOS Configuration Manager...` and subsequent output to determine whether the USB mount succeeded and whether the import came from USB.
:::

To SSH into your Home Assistant device. On Mac/Linux, use:

```shell
ssh root@homeassistant.local -p 22222
```

If you have an older installation or have changed your hostname, you may need to use a different hostname in the command above. You can check the correct hostname to use in the System page of the Supervisor interface in Home Assistant.

You will be logged in as root in the ```/root``` folder. [Home Assistant OS] is a hypervisor for Docker. See the [Supervisor Architecture] documentation for information regarding the Supervisor. The Supervisor offers an API to manage the host and running the Docker containers. Home Assistant itself and all installed addons run in separate Docker containers.

[CLI tasks]: https://www.home-assistant.io/hassio/commandline/
[Home Assistant OS]: https://github.com/home-assistant/operating-system
[Supervisor Architecture]: /architecture_index.md

### Turning off SSH access to the host

Use a USB drive formatted with FAT32 or ext4 and name it CONFIG (case sensitive). Remove any existing `authorized_keys` file from the drive and leave the drive empty. When the Home Assistant OS device is rebooted with this drive inserted, any existing keys will be removed and the SSH service will be stopped.

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

### Generating SSH Keys

Windows instructions for how to generate and use private/public keys with Putty are [here][windows-keys]. Instead of the droplet instructions, add the public key as per above instructions.

Alternative instructions, for Mac, Windows and Linux can be found [here](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#platform-mac).

Follow steps 1-4 under 'Generating a new SSH key' (The other sections are not applicable to Home Assistant and can be ignored.)

Step 3 in the link above, shows the path to the private key file `id_rsa` for your chosen operating system. Your public key, `id_rsa.pub`, is saved in the same folder. Next, select all text from text box "Public key for pasting into the authorized_keys file" and save it to the root of your USB drive as `authorized_keys`.
