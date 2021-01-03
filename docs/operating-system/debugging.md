---
title: "Debugging the Home Assistant Operating System"
sidebar_label: Debugging
---

:::info
This section is not for end users. End users should use the [SSH add-on] to SSH into Home Assistant. This is for **developers** of Home Assistant. Do not ask for support if you are using these options.
:::

[SSH add-on]: https://github.com/home-assistant/hassio-addons/tree/master/ssh

## Enabling SSH access to the host

:::info
SSH access through the [SSH add-on] (which will give you SSH access through port 22) will not provide you with all the necessary privileges, and you will be asked for a username and password when typing the 'login' command. You need to follow the steps below, which will setup a separate SSH access through port 22222 with all necessary privileges.
:::

### USB CONFIG Access Method

Use a USB drive formatted with FAT, ext4, or NTFS and name it CONFIG (case sensitive). Create an `authorized_keys` file (no extension) containing your public key, and place it in the root of the USB drive. File needs to be ANSI encoded (not UTF-8) and must have Unix line ends (LF), not Windows (CR LF). See [Generating SSH Keys](#generating-ssh-keys) section below if you need help generating keys. From the UI, navigate to the Supervisor system page and choose "Import from USB". You can now access your device as root over SSH on port 22222. Alternatively, the file will be imported from the USB when the Home Assistant OS device is rebooted.

:::tip
Make sure when you are copying the public key to the root of the USB drive that you rename the file correctly to `authorized_keys` with no `.pub` file extension.
:::


### SSH Plugin Access Method
:::info
The SSH Plugin Method will authorize all authorized key-based logins for the SSH plugin to access HassOS.  Please ensure this meets your security needs before performing this method. 
:::
This method will tear down all security on your system, set up ssh key-based login with your terminal plugin, then setup ssh key-based login on HassOS. 

  1. Set up root acess to your SSH plugin. See your plugin details for more information.
  2. Set up SSH Keys to your SSH plugin.  See your plugin details for more information. Aternatively you can copy your SSH Keys on to your SSH/Terminal plugin via instructions here [ssh-copy-id]:https://www.ssh.com/ssh/copy-id.  
:::tip
You can verify SSH Key-based login is active and operating properly by logging in with `ssh -vt ip.add.re.ss` and observing the message `Authentication succeeded (publickey).` in the terminal.
::: 
  3. Disable Protection Mode within the SSH Supervisor->Addon->Info screen.
  4. Ensure you are able to SSH into your SSH plugin without using a password.
:::tip
You can verify SSH Key-based login is active by logging in with `ssh -vt ip.add.re.ss` and observing the message `Authentication succeeded (publickey).` in the log
::: 
  5. execute the following 
```shell
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot
mkdir /mnt/boot/CONFIG
cp ~/.ssh/authorized_keys /mnt/boot/CONFIG/authorized_keys
sync
``` 
:::tip
when using an SDCard, the mount may be `/dev/mmcblk0p1` when using a hard drive or USB drive it may be `/dev/sda1`.
:::
  6. Restore any changes you made to your system.
    1. Change the SSH plugin username back to the original username.
    2. Enable Protection Mode.
:::info
SSH key-based access, even without password, is considered more secure than password-based login methods. You may wish to disable password-based authentication and utilize only the authorized_keys. 
:::
  7. Reboot the system


## SSH CLI Access
After performing one of the Access Methods above, you should be able to SSH into your Home Assistant device. On Mac/Linux, use:

```shell
ssh root@homeassistant.local -p 22222
```

If you have an older installation or have changed your hostname, you may need to use a different hostname in the command above. You can check the correct hostname to use in the System page of the Supervisor interface in Home Assistant.

You will initially be logged in to Home Assistant CLI for HassOS where you can perform normal [CLI functions]. If you need access to the host system use the 'login' command. [Home Assistant OS] is a hypervisor for Docker. See the [Supervisor Architecture] documentation for information regarding the supervisor. The supervisor offers an API to manage the host and running the Docker containers. Home Assistant itself and all installed addons run in separate Docker containers.

[CLI functions]: https://www.home-assistant.io/hassio/commandline/
[Home Assistant OS]: https://github.com/home-assistant/hassos
[Supervisor Architecture]: /architecture_index.md


## Checking the logs

```shell
# Logs from the supervisor service on the Host OS
journalctl -f -u hassos-supervisor.service

# Supervisor logs
docker logs hassos_supervisor

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
