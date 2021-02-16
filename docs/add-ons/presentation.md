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
  file,

  # S6-Overlay
  /bin/** ix,
  /usr/bin/** ix,
  /usr/lib/bashio/** ix,
  /etc/s6/** ix,
  /run/s6/** ix,
  /etc/services.d/** rwix,
  /etc/cont-init.d/** rwix,
  /etc/cont-finish.d/** rwix,
  /var/run/** rw,

  # suppress ptrace denials when using 'docker ps' or using 'ps' inside a container
  ptrace (trace,read) peer=docker-default,

  # docker daemon confinement requires explict allow rule for signal
  signal (receive) set=(kill,term) peer=/usr/bin/docker,

  # Access to hardware devices
  # /dev/ttyUSB0 rw,
  
  # Access to Options.json and other files within your addon
  /data/** rw,
}
```

## Ingress

Ingress allows users to access the add-on web interface via the Home Assistant UI. Authentication is handled by Home Assistant, so neither the user nor the add-on developer will need to care about the security or port forwarding. Users love this feature! It connects your user directly to the add-on, can provide a seamless UX within Home Assistant and grants your add-on 2 points of security.

Here are the requirements of Ingress:
- Ingress must be enabled. Set `ingress: true` in [`config.json`](/docs/add-ons/configuration#add-on-config).
- Your server may run on port 8099. If it does not run on 8099, you must set `ingress_port: PORT_NUMBER` in [`config.json`](/docs/add-ons/configuration/#add-on-config) to match your configuration.
- Only connections from `172.30.32.2` must be allowed. You should deny access to all other IP addresses within your add-on server. 
- Users are previously authenticated via Home Assistant. Authentication is not required. 

:::tip
Configuration of path and port information may be queried via [add-ons info API endpoint](/docs/api/supervisor/endpoints/#addons). If the Home Assistant URL is required by your addon, Ingress adds a request header `X-Ingress-Path` which may be filtered to obtain the base URL. 
:::

Ingress API gateway supports the following:

- HTTP/1.x
- Streaming content
- Websockets


## Basic Ingress Example with Nginx

The following is a basic ingress implementation with an Nginx server. This contains an example`Dockerfile`, `config.json`, and `ingress.conf` configuration.

The `ingress.conf` is configured to accept only connections from IP address `172.30.32.2` as we are only expecting connections from this IP address for Ingress purposes. Any other IP address will be rejected. The ingress port 8099 is utilized to reduce configuration work. If you wish to configure a different ingress port you may, but the `config.json` option `ingress_port` must be defined to match.

ingress.conf
```nginx 
server {
    listen 8099;
    allow  172.30.32.2;
    deny   all;
}
```

Our example `Dockerfile` is configured to support only our Nginx server and does not support a `run.sh` like most add-ons. You may replace the `CMD` with your own command to allow more configuration options while launching your add-on. This Dockerfile will `RUN` to install our Nginx dependencies, `COPY` our example `ingress.conf` from above to the add-on container, then `CMD` start Nginx.

Dockerfile
```Dockerfile
ARG BUILD_FROM
FROM $BUILD_FROM
ENV LANG C.UTF-8

#Add nginx and create the run folder for nginx.
RUN apk --no-cache  add nginx;mkdir -p /run/nginx;
#Copy our conf into the nginx http.d folder.
COPY ingress.conf /etc/nginx/http.d/
#Launch nginx with debug options.
CMD [ "nginx","-g","daemon off;error_log /dev/stdout debug;" ]
```

In order to enable Ingress, our `config.json` file _must_ include `ingress: true` and _may_ specify the `ingress_port`, along with other required information.

config.json
```json
{
  "name": "Ingress Example",
  "version": "0.00.0.0.000.0.000",
  "slug": "nginx-ingress-example",
  "description": "ingress testing",
  "arch": ["armhf", "armv7", "aarch64", "amd64", "i386"],
  "ingress": true,
  "ingress_port": 8099
}
```

After the add-on is started, you should be able to view your Ingress server by clicking "OPEN WEB UI" within the add-on info screen.

# Security

Add-on security should be a matter of pride. You should strive for the highest level of security you can possibly attain. If your add-on has a lower security rating, then users will be less likely to trust it.

Each add-on starts with a base rating of 5, on a scale of 1 to 6. Depending on decisions made during development, you will be assigned a score based on certain actions. There are some actions that have additional consequences. These additional consequences appear in the Notes section of the following table.

| Action | Change | Notes |
|---|---|---|
| Use `ingress: true` in [`config.json`](/docs/add-ons/configuration#add-on-config) | +2 | overrides `auth_api` rating |
| Use `auth_api: true` in [`config.json`](/docs/add-ons/configuration#add-on-config) | +1 | overridden by `ingress` |
| Use custom [`apparmor.txt`](/docs/add-ons/presentation#apparmor)| +1| Rating applied after installation |
| Set `apparmor: false` in [`config.json`](/docs/add-ons/configuration#add-on-config) | -1 | |
| Use `privileged: NET_ADMIN`, `SYS_ADMIN`, `SYS_RAWIO`, `SYS_PTRACE`, `SYS_MODULE`, or `DAC_READ_SEARCH` in [`config.json`](/docs/add-ons/configuration#add-on-config)| -1 | Rating applied only once if multiple are used. |
| Use `hassio_role: manager` in [`config.json`](/docs/add-ons/configuration#add-on-config) | -1 | |
| Use `host_network: true` in [`config.json`](/docs/add-ons/configuration#add-on-config) | -1 | |
| Use `hassio_role: admin` in [`config.json`](/docs/add-ons/configuration#add-on-config) | -2 | |
| Use `host_pid: true` in [`config.json`](/docs/add-ons/configuration#add-on-config) | -2 | |
| Use `full_access: true` in [`config.json`](/docs/add-ons/configuration#add-on-config) | -2 | |
| Use `docker_api: true` in [`config.json`](/docs/add-ons/configuration#add-on-config) | Security set to 1 | Overrides all other adjustments |
