---
title: "Presenting your addon"
---

If you decide to share your add-on to the public, paying attention to details is recommended. Of course, your add-on should have a proper name and description, but Home Assistant also gives you some other tools to present your add-on even nicer.

## Adding intro

This shows in add-on store and give the user a short instruction what the addon can.

This file containing the intro is usually referred to as the "README", which is generally published as the `README.md` file.

## Adding documentation

Good documentation helps the consumer of your add-on to understand its usage, explains configuration options, points users in the right direction in the case they have questions or issues, and contains the license under which the add-on was published.

This file containing the documentation is usually referred to as the "DOCS", which is generally published as the `DOCS.md` file.

## Add-on icon & logo

A picture is worth a thousand words. Therefore, your add-on can be improved by adding a proper image icon and logo. Those images are used when showing your add-on in the Home Assistant Supervisor panel and which will significantly improve the visual representation of your add-on.

Requirements for the logo of your add-on:

- The logo must be in the Portable Network Graphics format (`.png`).
- The filename must be `logo.png`.
- It is recommended to keep the logo size around 250x100px. You may choose to use a different size or aspect ratio as you seem fit for your add-on.

Requirements for the icon of your add-on:

- The icon must be in the Portable Network Graphics format (`.png`).
- The filename must be `icon.png`.
- The aspect ratio of the icon must be 1x1 (square).
- It is recommended to use an icon size of 128x128px.

## Keeping a changelog

It is likely you are going to release newer versions of your add-on in the future. In case that happens, the users of your add-on would see an upgrade notice and probably want to know what changes were made in the latest version.

A changelog is a file which contains a curated, chronologically ordered list of notable changes for each version of your add-on and is generally published as the `CHANGELOG.md` file.

If you are in need of a guide on keeping a changelog, we would recommend checking the [keep a changelog](http://keepachangelog.com) website. They have developed a standard that is used by many open source projects around the world.

## AppArmor

In the event, an API call returns something you, as a developer were not expecting, access to too many resources could be a liability for your users. As an add-on developer, it is your responsibility to ensure your add-on will not ruin your user's machine, or perform actions that you would never expect. That's where AppArmor comes in.

While your talents in input validation, handling sensitive data and other defensive programming tactics are not being judged here, AppArmor is your add-on's second line of defense against malicious API calls, malformed settings or other forms of system hijacking.

By default, AppArmor gives you a certain level of security by restricting some general actions that are deemed inappropriate for a Docker container. You can read more about Docker's AppArmor implementation on the [Docker Security page](https://docs.docker.com/engine/security/apparmor/). 

As for Home Assistant's implementation, you can activate your own custom AppArmor profile by putting a `apparmor.txt` file into your add-on folder. Adding your own `apparmor.txt` will load that file as the primary AppArmor profile instead of the default implementation. On top of knowing your add-on will run in a constrained and effective manner, writing your own custom `apparmor.txt` file will earn your add-on a security point after your add-on is installed, thus improving your user's confidence and perception of your add-on.

An `apparmor.txt` goes in the same folder as your `config.json` file. Below is an example `apparmor.txt`. Replace `ADDON_SLUG` with the slug defined in your add-on configuration.

apparmor.txt
```txt
#include <tunables/global>

profile ADDON_SLUG flags=(attach_disconnected,mediate_deleted) {
  #include <abstractions/base>
  
  # Capabilities
  capability,
  file,

  capability setgid,
  capability setuid,

  # S6-Overlay
  /bin/** ix,
  /usr/bin/** ix,
  /usr/lib/bashio/** ix,
  /etc/s6/** rix,
  /run/s6/** rix,
  /etc/services.d/** rwix,
  /etc/cont-init.d/** rwix,
  /etc/cont-finish.d/** rwix,
  /init rix,
  /var/run/** mrwkl,
  /var/run/ mrwkl,

  # Data access
  /data/** rw,


  # suppress ptrace denials when using 'docker ps' or using 'ps' inside a container
  ptrace (trace,read) peer=docker-default,
 
  # docker daemon confinement requires explict allow rule for signal
  signal (receive) set=(kill,term) peer=/usr/bin/docker,

}
```

## Ingress

Ingress allow users to access the add-on web interface via the Home Assistant UI. Authentication is handled by Home Assistant, so neither the user nor the add-on developer will need to care about the security or port forwarding. Users love this feature, however it is not every time simple to implement for the add-on developer.

To add Ingress support, follow the following steps:

- The add-on will need to provide the web interface on port `8099`. Make sure that the add-on accepts only connections from `172.30.32.2` on that port and that the connections are treated as authenticated.
- Update add-on configuration and set `ingress: true`. Here it is also possible to configure the Ingress port by using the option `ingress_port: PORT_NUMBER` (default 8099).
- If you need to configure the application inside your add-on with the right path and port, query the add-on info API endpoint.
- If the application doesn't support relative paths or you can't set a base url, you can use nginx filter to replace the URL with correct path. Ingress adds a request header `X-Ingress-Path` that can be used.

Ingress API gateway supports the following:

- HTTP/1.x
- Streaming content
- Websockets

Ingress grants your Add-on 2 points of security and can be implemented easily from bash as a separate, no-dependencies, background process with the default home-assistant image, as follows. Please note, this is a basic static webserver setup and provides little benefit over the log tab. Additionally, this implementation has less security than any standard HTTP Framework, but it is intended to run within a controlled environment between the shell script and the Ingress server in Home Assistant, and is not exposed directly to the Internet or any network. 

Place this line somewhere near the top of your run.sh.  This will start a `nc` listening server and run the `/opt/server.sh` each time a user connects to your Ingress. The output from stdout will be displayed as a response from the server. 
``` bash
nc -lk -p 8099 -e  exec /opt/server.sh 3>/dev/null &
```
Create a `rootfs/opt` folder within your Add-on folder. Then create a `server.sh` file in that folder. The server.sh will output the HTTP Headers and HTML required to display information.

/opt/server.sh
```bash
#HTTP Server Headers
echo -e 'HTTP/1.1 200 OK\r\nServer: DeskPiPro\r\nDate:$(date)\r\nContent-Type: text/html; charset=UTF8\r\nCache-Control: no-store, no cache, must-revalidate\r\n\r\n'
#HTML Document
echo -e \
"<!DOCTYPE html>\n"\
"<html>\n"\
"<head>\n"\
"<title>Page Title</title>\n"\
"</head>\n"\
"<body>\n"\

# HTML body content
echo "<p>I can haz Ingress?</p>" 
set +e   #The /tmp/status.html file may not be here if you did not create it in your addon. So we set +e to continue execution after errors.  
cat /tmp/status.html 2>/dev/null #throw stderr to /dev/null
set -e #Set -e to continue running in strict mode

# Close up the HTML doc
echo -e \
"</body>\n"\
"</html>\n"\
"\n"
```

# Security

Add-on security should be a matter of pride. You should strive for the highest level of security you can possibly attain. If your add-on has a lower security rating, then users will be less likely to trust it. You can use the following table to adjust your add-on security.

| Action | Change | Notes |
|---|---|---|
| Use `ingress: true` in [config.json](https://developers.home-assistant.io/docs/add-ons/configuration#add-on-config) | +2 | overrides `auth_api` rating |
| Use `auth_api: true` in [config.json](https://developers.home-assistant.io/docs/add-ons/configuration#add-on-config) | +1 | overridden by `ingress` |
| Use custom [apparmor.txt](https://developers.home-assistant.io/docs/add-ons/presentation#apparmor)| +1| Rating applied after installation |
| Set `apparmor: false` in [config.json](https://developers.home-assistant.io/docs/add-ons/configuration#add-on-config) | -1 | |
| Use `privileged: NET_ADMIN`, `SYS_ADMIN`, `SYS_RAWIO`, `SYS_PTRACE`, `SYS_MODULE`, or `DAC_READ_SEARCH` in [config.json](https://developers.home-assistant.io/docs/add-ons/configuration#add-on-config)| -1 | |
| Use `hassio_role: manager` in [config.json](https://developers.home-assistant.io/docs/add-ons/configuration#add-on-config) | -1 | overrides `hassio_role: admin` |
| Use `host_network: true` in [config.json](https://developers.home-assistant.io/docs/add-ons/configuration#add-on-config) | -1 | |
| Use `hassio_role: admin` in [config.json](https://developers.home-assistant.io/docs/add-ons/configuration#add-on-config) | -2 | overridden by `hassio_role: manager` |
| Use `host_pid: true` in [config.json](https://developers.home-assistant.io/docs/add-ons/configuration#add-on-config) | -2 | |
| Use `full_access: true` in [config.json](https://developers.home-assistant.io/docs/add-ons/configuration#add-on-config) | -2 | |
| Use `docker_api: true` in [config.json](https://developers.home-assistant.io/docs/add-ons/configuration#add-on-config) | Security set to 1 | |
