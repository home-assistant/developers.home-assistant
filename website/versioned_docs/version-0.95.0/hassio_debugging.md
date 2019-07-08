---
title: Debugging Hass.io
id: version-0.95.0-hassio_debugging
original_id: hassio_debugging
---

> This section is not for end users. End users should use the [SSH add-on] to SSH into Hass.io. This is for <b>developers</b> of Hass.io. Do not ask for support if you are using these options.

[SSH add-on]: https://www.home-assistant.io/addons/ssh/

The following debug tips and tricks are for developers who are running the Hass.io image and are working on the base image. If you use the generic Linux installer script, you should be able to access your host and logs as per your host.

## Debug Supervisor

Visual Studio Code config:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Hass.io remote debug",
            "type": "python",
            "request": "attach",
            "port": 33333,
            "host": "IP",
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}",
                    "remoteRoot": "/usr/src/hassio"
                }
            ]
        }
    ]
}
```

You need set the dev mode on supervisor and enable debug with options. You need also install the Remote debug Add-on from Developer Repository to expose the debug port to Host.

## SSH access to the host
> SSH access through the [SSH add-on] (which will give you SSH access through port 22) will not provide you with all the necessary privileges, and you will be asked for a username and password when typing the 'login' command. You need to follow the steps below, which will setup a separate SSH access through port 22222 with all necessary privileges.

### resinOS based Hass.io (deprecated)
Create an `authorized_keys` file containing your public key, and place it in the root of the boot partition of your SD card. See [Generating SSH Keys](#generating-ssh-keys) section below if you need help generating keys. Once the device is booted, you can access your device as root over SSH on port 22222. 

### HassOS based Hass.io
Use a USB drive formatted with FAT, ext4, or NTFS and name it CONFIG (case sensitive). Create an `authorized_keys` file (no extension) containing your public key, and place it in the root of the USB drive. File needs to be ANSI encoded (not UTF-8) and must have Unix line ends (LF), not Windows (CR LF). See [Generating SSH Keys](#generating-ssh-keys) section below if you need help generating keys. From the UI, navigate to the hass.io system page and choose "Import from USB". You can now access your device as root over SSH on port 22222. Alternatively, the file will be imported from the USB when the hass.io device is rebooted.

> Make sure when you are copying the public key to the root of the USB drive that you rename the file correctly to `authorized_keys` with no `.pub` file extension.

You should then be able to SSH into your Hass.io device. On Mac/Linux, use:

```
ssh root@hassio.local -p 22222
```

You will initially be logged in to Hass.io CLI for HassOS where you can perform normal [CLI functions]. If you need access to the host system use the 'login' command. [Hass.io OS] is a hypervisor for Docker. See the [Hass.io Architecture] documentation for information regarding the Hass.io supervisor. The supervisor offers an API to manage the host and running the Docker containers. Home Assistant itself and all installed addon's run in separate Docker containers. 

[CLI functions]: https://www.home-assistant.io/hassio/commandline/
[Hass.io OS]: https://github.com/home-assistant/hassos
[Hass.io Architecture]: https://developers.home-assistant.io/docs/en/architecture_hassio.html

## Checking the logs

```bash
# Logs from the supervisor service on the Host OS
journalctl -f -u hassos-supervisor.service

# Hass.io supervisor logs
docker logs hassos_supervisor

# Home Assistant logs
docker logs homeassistant
```

## Accessing the container bash

```bash
docker exec -it homeassistant /bin/bash
```

[windows-keys]: https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-putty-on-digitalocean-droplets-windows-users

### Generating SSH Keys

Windows instructions for how to generate and use private/public keys with Putty are [here][windows-keys]. Instead of the droplet instructions, add the public key as per above instructions.

Alternative instructions, for Mac, Windows and Linux can be found [here](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#platform-mac).

Follow steps 1-4 under 'Generating a new SSH key' (The other sections are not applicable to Hass.io and can be ignored.)

Step 3 in the link above, shows the path to the private key file `id_rsa` for your chosen operating system. Your public key, `id_rsa.pub`, is saved in the same folder. Next, select all text from text box "Public key for pasting into the authorized_keys file" and save it to the root of your USB drive as `authorized_keys`.
