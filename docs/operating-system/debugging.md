---
title: "Debugging the Home Assistant Operating System"
sidebar_label: Debugging
---

:::info
This section is not for end users. End users should use the [SSH add-on] to SSH into Home Assistant. This is for **developers** of Home Assistant. Do not ask for support if you are using these options.
:::

[SSH add-on]: https://github.com/home-assistant/addons/tree/master/ssh

## SSH access to the host

:::info
SSH access through the [SSH add-on] (which will give you SSH access through port 22) will not provide you with all the necessary privileges, and you will be asked for a username and password when typing the 'login' command. You need to follow the steps below, which will setup a separate SSH access through port 22222 with all necessary privileges.
:::

### Home Assistant Operating System

Use a USB drive formatted with FAT, ext4, or NTFS and name it CONFIG (case sensitive). Create an `authorized_keys` file (no extension) containing your public key, and place it in the root of the USB drive. File needs to be ANSI encoded (not UTF-8) and must have Unix line ends (LF), not Windows (CR LF). See [Generating SSH Keys](#generating-ssh-keys) section below if you need help generating keys. Use the CLI (eg. SSH to the [SSH add-on] on port 22) and import the `authorized_keys` file with the `ha os import` command. You can now access your device as root over SSH on port 22222. Alternatively, the file will be imported from the USB when the Home Assistant OS device is rebooted.

:::tip
Make sure when you are copying the public key to the root of the USB drive that you rename the file correctly to `authorized_keys` with no `.pub` file extension.
:::

You should then be able to SSH into your Home Assistant device. On Mac/Linux, use:

```shell
ssh root@homeassistant.local -p 22222
```

If you have an older installation or have changed your hostname, you may need to use a different hostname in the command above. You can check the correct hostname to use in the System page of the Supervisor interface in Home Assistant.

You will be logged in as root in the ```/root``` folder. [Home Assistant OS] is a hypervisor for Docker. See the [Supervisor Architecture] documentation for information regarding the Supervisor. The Supervisor offers an API to manage the host and running the Docker containers. Home Assistant itself and all installed addons run in separate Docker containers.

[CLI tasks]: https://www.home-assistant.io/common-tasks/os#home-assistant-via-the-command-line
[Home Assistant OS]: https://github.com/home-assistant/operating-system
[Supervisor Architecture]: /architecture_index.md

### Turning off SSH access to the host

Use a USB drive formatted with FAT, ext4, or NTFS and name it CONFIG (case sensitive). Remove any existing `authorized_keys` file from the drive and leave the drive empty. When the Home Assistant OS device is rebooted with this drive inserted, any existing keys will be removed and the SSH service will be stopped.

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

Windows instructions for how to generate and use private/public keys with Putty are [here][windows-keys]. Instead of the droplet instructions, add the public key as per above instructions.

Alternative instructions, for Mac, Windows and Linux can be found [here](https://docs.github.com/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#platform-mac).

Follow steps 1-4 under 'Generating a new SSH key' (The other sections are not applicable to Home Assistant and can be ignored.)

Step 3 in the link above, shows the path to the private key file `id_rsa` for your chosen operating system. Your public key, `id_rsa.pub`, is saved in the same folder. Next, select all text from text box "Public key for pasting into the authorized_keys file" and save it to the root of your USB drive as `authorized_keys`.
