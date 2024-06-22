---
title: "Presenting your addon"
---

If you choose to make your add-on available to the public, providing clear information, graphics and security reassurances will help attract users.  The recommendations below are a guideline for presenting your add-on.

## Adding intro

This shows in the add-on store and gives the user a short description of what the add-on can do.

This file containing the intro is usually referred to as the "README", which is generally published as the `README.md` file.

## Adding documentation

Good documentation helps the consumer of your add-on to understand its usage, explains configuration options, points users in the right direction in the case they have questions or issues, and contains the license under which the add-on was published.

This file containing the documentation is usually referred to as the "DOCS", which is generally published as the `DOCS.md` file.

## Add-on icon & logo

A picture is worth a thousand words. Therefore, your add-on can be improved by adding a proper image icon and logo. These images are used when showing your add-on in the Home Assistant Supervisor panel and will significantly improve the visual representation of your add-on.

Requirements for the logo of your add-on:

- The logo must be in the Portable Network Graphics format (`.png`).
- The filename must be `logo.png`.
- It is recommended to keep the logo size around 250x100px. You may choose to use a different size or aspect ratio as you see fit for your add-on.

Requirements for the icon of your add-on:

- The icon must be in the Portable Network Graphics format (`.png`).
- The filename must be `icon.png`.
- The aspect ratio of the icon must be 1x1 (square).
- It is recommended to use an icon size of 128x128px.

## Keeping a changelog

It is likely you are going to release newer versions of your add-on in the future. In case that happens, the users of your add-on will see an upgrade notice and probably want to know what changes were made in the latest version.

A changelog is a file which contains a curated, chronologically ordered list of notable changes for each version of your add-on and is generally published as the `CHANGELOG.md` file.

For guidance on keeping a changelog, we recommend the [keep a changelog](http://keepachangelog.com) website. They have developed a standard used by many open source projects around the world.

## Offering stable and canary version

You may consider to offer a stable and a "next" or "canary" branch. These can be provided using different branches. When adding the add-on in Home Assistant, the user can select the wanted branch from a given repository by appending its name following a hashtag.

```text
https://github.com/home-assistant/hassio-addons-example#next
```

You should add this information to your documentation. Also, you should consider having different [names for the repositories](/docs/add-ons/repository#repository-configuration) in every branch, for example, "Super add-on (stable)" and "Super add-on (beta)".

## AppArmor

In the event that an API call returns something you, as a developer were not expecting, access to too many resources could be a liability for your users. As an add-on developer, it is your responsibility to ensure your add-on will not ruin your user's machine, or perform actions that you would never expect. That's where AppArmor comes in.

While your talents in input validation, handling sensitive data and other defensive programming tactics are not being judged here, AppArmor is your add-on's second line of defense against malicious API calls, malformed settings or other forms of system hijacking.

By default, AppArmor gives you a certain level of security by restricting some general actions that are deemed inappropriate for a Docker container. You can read more about Docker's AppArmor implementation on the [Docker Security page](https://docs.docker.com/engine/security/apparmor/).

As for Home Assistant's implementation, you can activate your own custom AppArmor profile by putting an `apparmor.txt` file into your add-on folder. Adding your own `apparmor.txt` will load that file as the primary AppArmor profile instead of the default implementation. On top of knowing your add-on will run in a constrained and effective manner, writing your own custom `apparmor.txt` file will earn your add-on a security point after your add-on is installed, thus improving your user's confidence and perception of your add-on.

An `apparmor.txt` goes in the same folder as your `config.yaml` file. Below is an example `apparmor.txt`. Replace `ADDON_SLUG` with the slug defined in your add-on configuration.

apparmor.txt

```txt
#include <tunables/global>

profile ADDON_SLUG flags=(attach_disconnected,mediate_deleted) {
  #include <abstractions/base>

  # Capabilities
  file,
  signal (send) set=(kill,term,int,hup,cont),

  # S6-Overlay
  /init ix,
  /bin/** ix,
  /usr/bin/** ix,
  /run/{s6,s6-rc*,service}/** ix,
  /package/** ix,
  /command/** ix,
  /etc/services.d/** rwix,
  /etc/cont-init.d/** rwix,
  /etc/cont-finish.d/** rwix,
  /run/{,**} rwk,
  /dev/tty rw,

  # Bashio
  /usr/lib/bashio/** ix,
  /tmp/** rwk,

  # Access to options.json and other files within your addon
  /data/** rw,

  # Start new profile for service
  /usr/bin/myprogram cx -> myprogram,

  profile myprogram flags=(attach_disconnected,mediate_deleted) {
    #include <abstractions/base>

    # Receive signals from S6-Overlay
    signal (receive) peer=*_ADDON_SLUG,

    # Access to options.json and other files within your addon
    /data/** rw,

    # Access to mapped volumes specified in config.json
    /share/** rw,

    # Access required for service functionality
    /usr/bin/myprogram r,
    /bin/bash rix,
    /bin/echo ix,
    /etc/passwd r,
    /dev/tty rw,
  }
}
```

When working on this for your own add-ons, the following tips should help you get started:

1. The S6 part of this is fairly standard. You may need to add things to accommodate your setup scripts but generally don't remove anything.
2. If a service being run provides an AppArmor profile, apply that to the service. Always prefer one written by the developers.
3. If there isn't one for a service and you want to make one then do the following:
  a. Add minimum required access you're aware of. Things you definitely know the service needs
  b. Add `complain` as a flag to the profile
  c. Run the add-on and review the audit log with `journalctl _TRANSPORT="audit" -g 'apparmor="ALLOWED"'`
  d. Add access as necessary until using the add-on does not generate any audit warnings
  e. Remove the `complain` flag so ungranted access is DENIED not ALLOWED
4. Repeat #3 when updating the service as new access may be required

## Ingress

Ingress allows users to access the add-on web interface via the Home Assistant UI. Authentication is handled by Home Assistant, so neither the user nor the add-on developer will need to care about the security or port forwarding. Users love this feature! It connects your user directly to the add-on, can provide a seamless UX within Home Assistant and grants your add-on 2 points of security.

Here are the requirements of Ingress:
- Ingress must be enabled. Set `ingress: true` in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options).
- Your server may run on port 8099. If it does not run on 8099, you must set `ingress_port: PORT_NUMBER` in [`config.yaml`](/docs/add-ons/configuration/#add-on-config) to match your configuration.
- Only connections from `172.30.32.2` must be allowed. You should deny access to all other IP addresses within your add-on server. 
- Users are previously authenticated via Home Assistant. Authentication is not required. 

:::tip
Configuration of path and port information may be queried via [add-ons info API endpoint](/docs/api/supervisor/endpoints/#addons). If the Home Assistant URL is required by your addon, Ingress adds a request header `X-Ingress-Path` which may be filtered to obtain the base URL. 
:::

Ingress API gateway supports the following:

- HTTP/1.x
- Streaming content
- Websockets

## Basic ingress example with Nginx

The following is a basic ingress implementation with an Nginx server. This contains an example`Dockerfile`, `config.yaml`, and `ingress.conf` configuration.

The `ingress.conf` is configured to accept only connections from IP address `172.30.32.2` as we are only expecting connections from this IP address for Ingress purposes. Any other IP address will be rejected. The ingress port 8099 is utilized to reduce configuration work. If you wish to configure a different ingress port you may, but the `config.yaml` option `ingress_port` must be defined to match.

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

```dockerfile
ARG BUILD_FROM
FROM $BUILD_FROM

#Add nginx and create the run folder for nginx.
RUN \
  apk --no-cache add \
    nginx \
  \
  && mkdir -p /run/nginx

#Copy our conf into the nginx http.d folder.
COPY ingress.conf /etc/nginx/http.d/

#Launch nginx with debug options.
CMD [ "nginx","-g","daemon off;error_log /dev/stdout debug;" ]
```

In order to enable Ingress, our `config.yaml` file _must_ include `ingress: true` and _may_ specify the `ingress_port`, along with other required information.

config.yaml

```yaml
name: "Ingress Example"
version: "1.0.0"
slug: "nginx-ingress-example"
description: "Ingress testing"
arch:
  - amd64
  - armhf
  - armv7
  - i386
ingress: true
```

After the add-on is started, you should be able to view your Ingress server by clicking "OPEN WEB UI" within the add-on info screen.

## Security

Add-on security should be a matter of pride. You should strive for the highest level of security you can possibly attain. If your add-on has a lower security rating, then users will be less likely to trust it.

Each add-on starts with a base rating of 5, on a scale of 1 to 6. Depending on decisions made during development, you will be assigned a score based on certain actions. There are some actions that have additional consequences. These additional consequences appear in the Notes section of the following table.

| Action | Change | Notes |
|---|---|---|
| Use `ingress: true` in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) | +2 | overrides `auth_api` rating |
| Use `auth_api: true` in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) | +1 | overridden by `ingress` |
| Add-on is signed with [CodeNotary](https://cas.codenotary.com/)| +1||
| Use custom [`apparmor.txt`](/docs/add-ons/presentation#apparmor)| +1| Rating applied after installation |
| Set `apparmor: false` in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) | -1 | |
| Use `privileged: NET_ADMIN`, `SYS_ADMIN`, `SYS_RAWIO`, `SYS_PTRACE`, `SYS_MODULE`, or `DAC_READ_SEARCH`, or `kernel_modules: ` used in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options)| -1 | Rating applied only once if multiple are used. |
| Use `hassio_role: manager` in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) | -1 | |
| Use `host_network: true` in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) | -1 | |
| Use `hassio_role: admin` in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) | -2 | |
| Use `host_pid: true` in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) | -2 | |
| Use `host_uts: true` and `privileged: SYS_ADMIN` in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) | -1 | |
| Use `full_access: true` in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) | Security set to 1 | Overrides all other adjustments |
| Use `docker_api: true` in [`config.yaml`](/docs/add-ons/configuration#optional-configuration-options) | Security set to 1 | Overrides all other adjustments |
