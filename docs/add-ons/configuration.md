---
title: "Add-On Configuration"
---

Each add-on is stored in a folder. The file structure looks like this:

```text
addon_name/
  apparmor.txt
  build.json
  CHANGELOG.md
  config.json
  DOCS.md
  Dockerfile
  icon.png
  logo.png
  README.md
  run.sh
```

## Add-on script

As with every Docker container, you will need a script to run when the container is started. A user might run many add-ons, so it is encouraged to try to stick to Bash scripts if you're doing simple things.

All our images have also [bashio][bashio] installed. It contains a set of commonly used operations and can be used to be included in add-ons to reduce code duplication across add-ons and therefore making it easier to develop and maintain add-ons.

When developing your script:

- `/data` is a volume for persistent storage.
- `/data/options.json` contains the user configuration. You can use Bashio to parse this data.

```shell
CONFIG_PATH=/data/options.json

TARGET="$(bashio::config 'target')"
```

So if your `options` contain

```json
{ "target": "beer" }
```

then there will be a variable `TARGET` containing `beer` in the environment of your bash file afterwards.

[bashio]: https://github.com/hassio-addons/bashio

## Add-on Dockerfile

All add-ons are based on latest Alpine Linux image. Home Assistant will automatically substitute the right base image based on the machine architecture. Add `tzdata` if you need run in a different timezone. `tzdata` Is is already added to our base images.

```dockerfile
ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

# Install requirements for add-on
RUN apk add --no-cache example_alpine_package

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
```

If you don't use local build on device or our build script, make sure that the Dockerfile have also a set of labels include:

```dockerfile
LABEL io.hass.version="VERSION" io.hass.type="addon" io.hass.arch="armhf|aarch64|i386|amd64"
```

It is possible to use own base image with `build.json` or if you do not need support for automatic multi-arch building you can also use a simple docker `FROM`.

### Build Args

We support the following build arguments by default:

| ARG | Description |
|-----|-------------|
| BUILD_FROM | Hold image for dynamic builds or buildings over our systems.
| BUILD_VERSION | Add-on version (read from `config.json`).
| BUILD_ARCH | Hold current build arch inside.

## Add-on config

The configuration for an add-on is stored in `config.json`.

```json
{
  "name": "xy",
  "version": "1.2",
  "slug": "folder",
  "description": "long description",
  "arch": ["amd64"],
  "url": "website with more information about add-on (e.g., a forum thread for support)",
  "startup": "application",
  "boot": "auto",
  "ports": {
    "123/tcp": 123
  },
  "map": ["config:rw", "ssl"],
  "options": {},
  "schema": {},
  "image": "repo/{arch}-my-custom-addon"
}
```

| Key | Type | Required | Description |
| --- | ---- | -------- | ----------- |
| name | string | yes | Name of the add-on.
| version | string | yes | Version of the add-on.
| slug | string | yes | Slug of the add-on. This needs to be unique in the scope of the [repository](repository.md) that the add-on is published in and URI friendly.
| description | string | yes | Description of the add-on.
| arch | list | yes | List of supported arch: `armhf`, `armv7`, `aarch64`, `amd64`, `i386`.
| machine | list | no | Default it support any machine type. You can select that this add-on run only on specific machines. You can use `!` before a machine type to negate it.
| url | url | no | Homepage of the add-on. Here you can explain the add-ons and options.
| startup | string | yes | `initialize` will start add-on on setup of Home Assistant. `system` is for things like databases and not dependent on other things. `services` will start before Home Assistant, while `application` is started afterwards. Finally `once` is for applications that don't run as a daemon.
| webui | string | no | An URL for the web interface of this add-on. Like `http://[HOST]:[PORT:2839]/dashboard`, the port needs the internal port, which will be replaced with the effective port. It is also possible to bind the protocol part to a configuration options with: `[PROTO:option_name]://[HOST]:[PORT:2839]/dashboard` and it's looked up if it is `true` and it's going to `https`.
| boot | string | yes | `auto` by system and manual or only `manual`.
| ports | dict | no | Network ports to expose from the container. Format is `"container-port/type": host-port`. If the host port is `null` then the mapping is disabled.
| ports_description | dict | no | Network ports description mapping. Format is `"container-port/type": "description of this port"`.
| host_network | bool | no | If `true`, the add-on runs on host network.
| host_ipc | bool | no | Default `false`. Allow to share the IPC namespace with others.
| host_dbus | bool | no | Default `false`. Map the host D-Bus service into the add-on.
| host_pid | bool | no | Default `false`. Allow to run container on host PID namespace. Works only for not protected add-ons.
| devices | list | no | Device list to map into the add-on. Format is: `<path_on_host>:<path_in_container>:<cgroup_permissions>`. E.g., `/dev/ttyAMA0:/dev/ttyAMA0:rwm`
| udev | bool | no | Default `false`. Set this `true`, if your container runs an udev process of its own.
| auto_uart | bool | no | Default `false`. Auto mapping all UART/serial device from host into add-on.
| homeassistant | string | no | Pin a minimum required Home Assistant Core version for the add-on. Value is a version string like `0.91.2`.
| hassio_role | str | no | Default `default`. Role-based access to Supervisor API. Available: `default`, `homeassistant`, `backup`, `manager` or `admin`
| hassio_api | bool | no | This add-on can access the Supervisor's REST API. Use `http://supervisor`.
| homeassistant_api | bool | no | This add-on can access to the Home Assistant REST API proxy. Use `http://supervisor/core/api`.
| docker_api | bool | no | Allow read-only access to Docker API for add-on. Works only for not protected add-ons.
| privileged | list | no | Privilege for access to hardware/system. Available access: `NET_ADMIN`, `SYS_ADMIN`, `SYS_RAWIO`, `SYS_TIME`, `SYS_NICE`, `SYS_RESOURCE`, `SYS_PTRACE`, `SYS_MODULE` or `DAC_READ_SEARCH`
| full_access | bool | no | Give full access to hardware like the privileged mode in Docker. Works only for not protected add-ons.
| apparmor | bool/string | no | Enable or disable AppArmor support. If it is enable, you can also use custom profiles with the name of the profile.
| map | list | no | List of maps for additional Home Assistant folders. Possible values: `config`, `ssl`, `addons`, `backup`, `share` or `media`. Defaults to `ro`, which you can change by adding `:rw` to the end of the name.
| environment | dict | no | A dictionary of environment variable to run add-on.
| audio | bool | no | Mark this add-on to use internal audio system. We map a working PulseAudio setup into container. If your application does not support PulseAudio, you may need to install: Alpine Linux `alsa-plugins-pulse` or Debian/Ubuntu `libasound2-plugins`.
| video | bool | no | Mark this add-on to use the internal video system. All available devices will be mapped into the add-on.
| gpio | bool | no | If this is set to `true`, `/sys/class/gpio` will map into add-on for access to GPIO interface from kernel. Some libraries also need  `/dev/mem` and `SYS_RAWIO` for read/write access to this device. On systems with AppArmor enabled, you need to disable AppArmor or provide you own profile for the add-on, which is better for security.
| usb | bool | no | If this is set to `true`, it would map the raw USB access `/dev/bus/usb` into add-on with plug&play support.
| devicetree | bool | no | Boolean. If this is set to True, `/device-tree` will map into add-on.
| kernel_modules | bool | no | Map host kernel modules and config into add-on (readonly).
| stdin | bool | no | Boolean. If enabled, you can use the STDIN with Home Assistant API.
| legacy | bool | no | Boolean. If the Docker image has no `hass.io` labels, you can enable the legacy mode to use the config data.
| options | dict | yes | Default options value of the add-on.
| schema | dict | yes | Schema for options value of the add-on. It can be `false` to disable schema validation and use custom options.
| image | string | no | For use with Docker Hub and other container registries.
| timeout | integer | no | Default 10 (seconds). The timeout to wait until the Docker daemon is done or will be killed.
| tmpfs | string | no | Mount a tmpfs filesystem in `/tmpfs`. Valid format for this option is : `size=XXXu,uid=N,rw`. Size is mandatory, valid units (`u`) are `k`, `m`, `g` and `XXX` has to be replaced by a number. `uid=N` (with `N` the uid number) and `rw` are optional.
| discovery | list | no | A list of services that this add-on provides for Home Assistant. Currently supported: `mqtt`
| services | list | no | A list of services that will be provided or consumed with this add-on. Format is `service`:`function` and functions are: `provide` (this add-on can provide this service), `want` (this add-on can use this service) or `need` (this add-on need this service to work correctly).
| auth_api | bool | no | Allow access to Home Assistant user backend.
| ingress | bool | no | Enable the ingress feature for the add-on.
| ingress_port | integer | no | Default `8099`. For add-ons that run on the host network, you can use `0` and read the port later via API.
| ingress_entry | string | no | Modify the URL entry point from `/`.
| panel_icon | string | no | Default: `mdi:puzzle`. MDI icon for the menu panel integration.
| panel_title | string | no | Default is the add-on name, but can be modified with this option.
| panel_admin | bool | no | Default `true`. Make menu entry only available with admin privileged.
| snapshot_exclude | list | no | List of file/path (with glob support) that are excluded from snapshots.
| advanced | bool | no | Default `false`. Make addon visible in simple mode.
| stage | string | no | Default `stable`. Flag add-on with follow attribute: `stable`, `experimental` or `deprecated`
| init | bool | no | Default `true`. Disable the Docker default system init.  Use this if the image has its own init system.
| watchdog | string | no | An URL for monitor an application this add-on. Like `http://[HOST]:[PORT:2839]/dashboard`, the port needs the internal port, which will be replaced with the effective port. It is also possible to bind the protocol part to a configuration options with: `[PROTO:option_name]://[HOST]:[PORT:2839]/dashboard` and it's looked up if it is `true` and it's going to `https`. For simple TCP port monitoring you can use `tcp://[HOST]:[PORT:80]`. It work for add-ons on host or internal network.

### Options / Schema

The `options` dictionary contains all available options and their default value. Set the default value to `null` if the value is required to be given by the user before the add-on can start, and it show it inside default values. Only nested arrays and dictionaries are supported with a deep of two size. If you want make an option optional, put `?` to the end of data type, otherwise it will be a required value.

```json
{
  "message": "custom things",
  "logins": [
    { "username": "beer", "password": "123456" },
    { "username": "cheep", "password": "654321" }
  ],
  "random": ["haha", "hihi", "huhu", "hghg"],
  "link": "http://example.com/",
  "size": 15,
  "count": 1.2
}
```

The `schema` looks like `options` but describes how we should validate the user input. For example:

```json
{
  "message": "str",
  "logins": [
    { "username": "str", "password": "str" }
  ],
  "random": ["match(^\w*$)"],
  "link": "url",
  "size": "int(5,20)",
  "count": "float",
  "not_need": "str?"
}
```

We support:

- `str` / `str(min,)` / `str(,max)` / `str(min,max)`
- `bool`
- `int` / `int(min,)` / `int(,max)` / `int(min,max)`
- `float` / `float(min,)` / `float(,max)` / `float(min,max)`
- `email`
- `url`
- `password`
- `port`
- `match(REGEX)`
- `list(val1|val2|...)`

## Add-on extended build

Additional build options for an add-on is stored in `build.json`. This file will be read from our build systems.
You need this only, if you not use the default images or need additional things.

```json
{
  "build_from": {
    "armhf": "mycustom/base-image:latest"
  },
  "squash": false,
  "args": {
    "my_build_arg": "xy"
  }
}
```

| Key | Required | Description |
| --- | -------- | ----------- |
| build_from | no | A dictionary with the hardware architecture as the key and the base Docker image as value.
| squash | no | Default `False`. Be careful with this option, as you can not use the image for caching stuff after that!
| args | no | Allow to set additional Docker build arguments as a dictionary.

We provide a set of [base images][docker-base] which should cover a lot of needs. If you don't want use the Alpine based version or need a specific image tag, feel free to pin this requirements for you build with `build_from` option.

[docker-base]: https://github.com/home-assistant/docker-base
