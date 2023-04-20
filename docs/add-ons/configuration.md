---
title: "Add-On Configuration"
---

Each add-on is stored in a folder. The file structure looks like this:

```text
addon_name/
  translations/
    en.yaml
  apparmor.txt
  build.yaml
  CHANGELOG.md
  config.yaml
  DOCS.md
  Dockerfile
  icon.png
  logo.png
  README.md
  run.sh
```

:::note
Translation files, `config` and `build` all support `.json`, `.yml` and `.yaml` as the file type.

To keep it simple all examples use `.yaml`
:::

## Add-on script

As with every Docker container, you will need a script to run when the container is started. A user might run many add-ons, so it is encouraged to try to stick to Bash scripts if you're doing simple things.

All our images also have [bashio][bashio] installed. It contains a set of commonly used operations and can be used to be included in add-ons to reduce code duplication across add-ons, therefore making it easier to develop and maintain add-ons.

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

All add-ons are based on the latest Alpine Linux image. Home Assistant will automatically substitute the right base image based on the machine architecture. Add `tzdata` if you need to run in a different timezone. `tzdata` Is is already added to our base images.

```dockerfile
ARG BUILD_FROM
FROM $BUILD_FROM

# Install requirements for add-on
RUN \
  apk add --no-cache \
    example_alpine_package

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
```

If you don't use local build on the device or our build script, make sure that the Dockerfile also has a set of labels that include:

```dockerfile
LABEL \
  io.hass.version="VERSION" \
  io.hass.type="addon" \
  io.hass.arch="armhf|aarch64|i386|amd64"
```

It is possible to use your own base image with `build.yaml` or if you do not need support for automatic multi-arch building you can also use a simple docker `FROM`. You can also suffix the Dockerfile with the specific architecture to use a specific Dockerfile for a particular architecture, i.e. `Dockerfile.amd64`.

### Build Args

We support the following build arguments by default:

| ARG | Description |
|-----|-------------|
| `BUILD_FROM` | Holds the image for dynamic builds or buildings over our systems.
| `BUILD_VERSION` | Add-on version (read from `config.yaml`).
| `BUILD_ARCH` | Holds the current build arch inside.

## Add-on configuration

The configuration for an add-on is stored in `config.yaml`.

```yaml
name: "Hello world"
version: "1.1.0"
slug: folder
description: >-
  "Long description"
arch:
  - amd64
url: "website with more information about the add-on (e.g., a forum thread for support)"
ports:
  123/tcp: 123
map:
  - config:rw
  - ssl
image: repo/{arch}-my-custom-addon
```

Note:  Avoid the use of this filename for anything other than add-on configuration, as the Supervisor does a recursive lookup.

### Required configuration options

| Key | Type | Description |
| --- | ---- | ----------- |
| `name` | string | The name of the add-on.
| `version` | string | Version of the add-on. If you are using a docker image with the `image` option, this needs to match the tag of the image that will be used.
| `slug` | string | Slug of the add-on. This needs to be unique in the scope of the [repository](/docs/add-ons/repository) that the add-on is published in and URI friendly.
| `description` | string | Description of the add-on.
| `arch` | list | A list of supported architectures: `armhf`, `armv7`, `aarch64`, `amd64`, `i386`.

### Optional configuration options

| Key | Type | Default | Description |
| --- | ---- | -------- | ----------- |
| `machine` | list | | Default is support of all machine types. You can configure the add-on to only run on specific machines. You can use `!` before a machine type to negate it.
| `url` | url | | Homepage of the add-on. Here you can explain the add-on and options.
| `startup` | string | `application` | `initialize` will start the add-on on setup of Home Assistant. `system` is for things like databases and not dependent on other things. `services` will start before Home Assistant, while `application` is started afterwards. Finally `once` is for applications that don't run as a daemon.
| `webui` | string | | A URL for the web interface of this add-on. Like `http://[HOST]:[PORT:2839]/dashboard`, the port needs the internal port, which will be replaced with the effective port. It is also possible to bind the protocol part to a configuration option with: `[PROTO:option_name]://[HOST]:[PORT:2839]/dashboard` and it's looked up if it is `true` and it's going to `https`.
| `boot` | string | `auto` | `auto` start at boot is controlled by the system. `manual` configures the add-on to only be started manually.
| `ports` | dict | | Network ports to expose from the container. Format is `"container-port/type": host-port`. If the host port is `null` then the mapping is disabled.
| `ports_description` | dict | | Network ports description mapping. Format is `"container-port/type": "description of this port"`. Alternatively use [Port description translations](#port-description-translations).
| `host_network` | bool | `false` | If `true`, the add-on runs on the host network.
| `host_ipc` | bool | `false` | Allow the IPC namespace to be shared with others.
| `host_dbus` | bool | `false` | Map the host D-Bus service into the add-on.
| `host_pid` | bool | `false` | Allow the container to run on the host PID namespace. Works only for not protected add-ons. **Warning:** Does not work with S6 Overlay. If need this to be `true` and you use the normal add-on base image you disable S6 by overriding `/init`. Or use an alternate base image.
| `host_uts` | bool | `false` | Use the hosts UTS namespace.
| `devices` | list | | Device list to map into the add-on. Format is: `<path_on_host>`. E.g., `/dev/ttyAMA0`
| `homeassistant` | string | | Pin a minimum required Home Assistant Core version for the add-on. Value is a version string like `2022.10.5`.
| `hassio_role` | str | `default` |Role-based access to Supervisor API. Available: `default`, `homeassistant`, `backup`, `manager` or `admin`
| `hassio_api` | bool | `false` | This add-on can access the Supervisor's REST API. Use `http://supervisor`.
| `homeassistant_api` | bool | `false` | This add-on can access the Home Assistant REST API proxy. Use `http://supervisor/core/api`.
| `docker_api` | bool | `false` | Allow read-only access to the Docker API for the add-on. Works only for not protected add-ons.
| `privileged` | list | | Privilege for access to hardware/system. Available access: `NET_ADMIN`, `NET_RAW`, `SYS_ADMIN`, `SYS_RAWIO`, `SYS_TIME`, `SYS_NICE`, `SYS_RESOURCE`, `SYS_PTRACE`, `SYS_MODULE` or `DAC_READ_SEARCH`
| `full_access` | bool | `false` | Give full access to hardware like the privileged mode in Docker. Works only for not protected add-ons. Consider using other add-on options instead of this, like `devices`. If you enable this option, don't add `devices`, `uart`, `usb` or `gpio` as this is not needed.
| `apparmor` | bool/string | `false` | Enable or disable AppArmor support. If it is enabled, you can also use custom profiles with the name of the profile.
| `map` | list | | List of Home Assistant directories to bind mount into your container. Possible values: `config`, `ssl`, `addons`, `backup`, `share` or `media`. Defaults to `ro`, which you can change by adding `:rw` to the end of the name.
| `environment` | dict | | A dictionary of environment variables to run the add-on with.
| `audio` | bool | `false` | Mark this add-on to use the internal audio system. We map a working PulseAudio setup into the container. If your application does not support PulseAudio, you may need to install: Alpine Linux `alsa-plugins-pulse` or Debian/Ubuntu `libasound2-plugins`.
| `video` | bool | `false` | Mark this add-on to use the internal video system. All available devices will be mapped into the add-on.
| `gpio` | bool | `false` | If this is set to `true`, `/sys/class/gpio` will map into the add-on for access to the GPIO interface from the kernel. Some libraries also need  `/dev/mem` and `SYS_RAWIO` for read/write access to this device. On systems with AppArmor enabled, you need to disable AppArmor or provide your own profile for the add-on, which is better for security.
| `usb` | bool | `false` | If this is set to `true`, it would map the raw USB access `/dev/bus/usb` into the add-on with plug&play support.
| `uart` | bool | `false` | Default `false`. Auto mapping all UART/serial devices from the host into the add-on.
| `udev` | bool | `false` | Default `false`. Setting this to `true` gets the host udev database read-only mounted into the add-on.
| `devicetree` | bool | `false` | If this is set to `true`, `/device-tree` will map into the add-on.
| `kernel_modules` | bool | `false` | Map host kernel modules and config into the add-on (readonly) and give you `SYS_MODULE` permission.
| `stdin` | bool | `false` | If enabled, you can use the STDIN with Home Assistant API.
| `legacy` | bool | `false` | If the Docker image has no `hass.io` labels, you can enable the legacy mode to use the config data.
| `options` | dict | | Default options value of the add-on.
| `schema` | dict | | Schema for options value of the add-on. It can be `false` to disable schema validation and options.
| `image` | string | | For use with Docker Hub and other container registries. This should be set to the name of the image only (E.g, `ghcr.io/home-assistant/{arch}-addon-example`). If you use this option, set the active docker tag using the `version` option.
| `codenotary` | string | | For use with Codenotary CAS. This is the E-Mail address used to verify your image with Codenotary (E.g, `example@home-assistant.io`). This should match the E-Mail address used as the signer in the [add-on's extended build options](#add-on-extended-build)
| `timeout` | integer | 10 | Default 10 (seconds). The timeout to wait until the Docker daemon is done or will be killed.
| `tmpfs` | bool | `false` | If this is set to `true`, the containers `/tmp` uses tmpfs, a memory file system.
| `discovery` | list | | A list of services that this add-on provides for Home Assistant. Currently supported: `mqtt`, `matter` and `otbr`
| `services` | list | | A list of services that will be provided or consumed with this add-on. Format is `service`:`function` and functions are: `provide` (this add-on can provide this service), `want` (this add-on can use this service) or `need` (this add-on needs this service to work correctly).
| `auth_api` | bool | `false` | Allow access to Home Assistant user backend.
| `ingress` | bool | `false` | Enable the ingress feature for the add-on.
| `ingress_port` | integer | `8099` | For add-ons that run on the host network, you can use `0` and read the port later via the API.
| `ingress_entry` | string | `/` | Modify the URL entry point.
| `ingress_stream` | bool | `false` | When enabled, requests to the add-on are streamed
| `panel_icon` | string | `mdi:puzzle` | [MDI icon](https://materialdesignicons.com/) for the menu panel integration.
| `panel_title` | string | | Defaults to the add-on name, but can be modified with this option.
| `panel_admin` | bool | `true` | Make the menu entry only available to users in the admin group.
| `backup` | string | `hot` | `hot` or `cold`. If `cold`, the supervisor turns the add-on off before taking a backup (the `pre/post` options are ignored when `cold` is used).
| `backup_pre` | string | | Command to execute in the context of the add-on before the backup is taken.
| `backup_post` | string | | Command to execute in the context of the add-on after the backup was taken.
| `backup_exclude` | list | | List of files/paths (with glob support) that are excluded from backups.
| `advanced` | bool | `false` | Set this to `true` to require the user to have enabled "Advanced" mode for it to show.
| `stage` | string | `stable` | Flag add-on with follow attribute: `stable`, `experimental` or `deprecated`. Add-ons set to `experimental` or `deprecated` will not show up in the store unless the user enables advanced mode.
| `init` | bool | `true` | Set this to `false` to disable the Docker default system init. Use this if the image has its own init system (Like [s6-overlay](https://github.com/just-containers/s6-overlay)). *Note: Starting in V3 of S6 setting this to `false` is required or the addon won't start, see [here](https://developers.home-assistant.io/blog/2022/05/12/s6-overlay-base-images) for more information.*
| `watchdog` | string | | A URL for monitoring the add-on health. Like `http://[HOST]:[PORT:2839]/dashboard`, the port needs the internal port, which will be replaced with the effective port. It is also possible to bind the protocol part to a configuration option with: `[PROTO:option_name]://[HOST]:[PORT:2839]/dashboard` and it's looked up if it is `true` and it's going to `https`. For simple TCP port monitoring you can use `tcp://[HOST]:[PORT:80]`. It works for add-ons on the host or internal network.
| `realtime` | bool | `false` | Give add-on access to host schedule including `SYS_NICE` for change execution time/priority.
| `journald` | bool | `false` | If set to `true`, the host's system journal will be mapped read-only into the add-on. Most of the time the journal will be in `/var/log/journal` however on some hosts you will find it in `/run/log/journal`. Add-ons relying on this capability should check if the directory `/var/log/journal` is populated and fallback on `/run/log/journal` if not.

### Options / Schema

The `options` dictionary contains all available options and their default value. Set the default value to `null` if the value is required to be given by the user before the add-on can start. Nested arrays and dictionaries are supported with a maximum depth of two.  To make an option optional, put `?` at the end of the data type, otherwise it will be a required value.

```yaml
message: "custom things"
logins:
  - username: beer
    password: "123456"
  - username: cheep
    password: "654321"
random:
  - haha
  - hihi
link: "http://example.com/"
size: 15
count: 1.2
```

The `schema` looks like `options` but describes how we should validate the user input. For example:

```yaml
message: str
logins:
  - username: str
    password: str
random:
  - "match(^\\w*$)"
link: url
size: "int(5, 20)"
count: float
not_need: "str?"
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
- `device` / `device(filter)`: Device filter can be in the following format: `subsystem=TYPE` i.e. `subsystem=tty` for serial devices.

## Add-on extended build

Additional build options for an add-on are stored in `build.yaml`. This file will be read from our build systems.
This is only needed if you are not using the default images or need additional things.

```yaml
build_from:
  armhf: mycustom/base-image:latest
squash: false
args:
  my_build_arg: xy
```

| Key | Required | Description |
| --- | -------- | ----------- |
| build_from | no | A dictionary with the hardware architecture as the key and the base Docker image as the value.
| squash | no | Default `False`. Be careful with this option, as you can not use the image for caching stuff after that!
| args | no | Allow additional Docker build arguments as a dictionary.
| labels | no | Allow additional Docker labels as a dictionary.
| codenotary | no | Enable container signature with codenotary CAS.
| codenotary.signer | no | Owner signer E-Mail address for this image.
| codenotary.base_image | no | Verify the base container image. If you use our official images, use `notary@home-assistant.io`

We provide a set of [base images][docker-base] which should cover a lot of needs. If you don't want to use the Alpine based version or need a specific image tag, feel free to pin this requirement for your build with the `build_from` option.

[docker-base]: https://github.com/home-assistant/docker-base

## Add-on translations

Add-ons can provide translation files for configuration options that are used in the UI.

Example path to translation file: `addon/translations/{language_code}.yaml`

For `{language_code}` use a valid language code, like `en`, for a [full list have a look here](https://github.com/home-assistant/frontend/blob/dev/src/translations/translationMetadata.json), `en.yaml` would be a valid filename.

This file supports 2 main keys `configuration` and `network`.

### Configuration translations

```yaml
configuration:
  ssl:
    name: Enable SSL
    description: Enable usage of SSL on the webserver inside the add-on
```

_The key under `configuration` (`ssl`) in this case, needs to match a key in your `schema` configuration (in [`config.yaml`](#add-on-configuration))._

### Port description translations

```yaml
network:
  80/TCP: The webserver port (Not used for Ingress)
```

_The key under `network` (`80/TCP`) in this case, needs to match a key in your `ports` configuration (in [`config.yaml`](#add-on-configuration))._
