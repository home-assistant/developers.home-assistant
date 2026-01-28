---
title: "App configuration"
---

Each app (formerly known as an add-on) is stored in a folder. The file structure looks like this:

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

## App script

As with every Docker container, you will need a script to run when the container is started. A user might run many apps, so it is encouraged to try to stick to Bash scripts if you're doing simple things.

All our images also have [bashio][bashio] installed. It contains a set of commonly used operations and can be used to be included in apps to reduce code duplication across apps, therefore making it easier to develop and maintain apps.

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

## App Dockerfile

All apps (formerly known as an add-on) are based on the latest Alpine Linux image. Home Assistant will automatically substitute the right base image based on the machine architecture. Add `tzdata` if you need to run in a different timezone. `tzdata` Is is already added to our base images.

```dockerfile
ARG BUILD_FROM
FROM $BUILD_FROM

# Install requirements for app
RUN \
  apk add --no-cache \
    example_alpine_package

# Copy data for app
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

### Build args

We support the following build arguments by default:

| ARG | Description |
|-----|-------------|
| `BUILD_FROM` | Holds the image for dynamic builds or buildings over our systems.
| `BUILD_VERSION` | App version (read from `config.yaml`).
| `BUILD_ARCH` | Holds the current build arch inside.

## App configuration

The configuration for an app (formerly known as an add-on) is stored in `config.yaml`.

```yaml
name: "Hello world"
version: "1.1.0"
slug: folder
description: >-
  "Long description"
arch:
  - amd64
url: "website with more information about the app (e.g., a forum thread for support)"
ports:
  123/tcp: 123
map:
  - type: share
    read_only: False
  - type: ssl
  - type: homeassistant_config
    read_only: False
    path: /custom/config/path
image: repo/{arch}-my-custom-addon
```

:::note
Avoid using `config.yaml` as filename in your app for anything other than the app configuration. The Supervisor does a recursively search for `config.yaml` in the app repository.
:::

### Required configuration options

| Key | Type | Description |
| --- | ---- | ----------- |
| `name` | string | The name of the app.
| `version` | string | Version of the app. If you are using a docker image with the `image` option, this needs to match the tag of the image that will be used.
| `slug` | string | Slug of the app. This needs to be unique in the scope of the [repository](/docs/apps/repository) that the app is published in and URI friendly. |
| `description` | string | Description of the app.
| `arch` | list | A list of supported architectures: `armhf`, `armv7`, `aarch64`, `amd64`, `i386`.

### Optional configuration options

| Key | Type | Default | Description |
| --- | ---- | -------- | ----------- |
| `machine` | list | | Default is support of all machine types. You can configure the app to only run on specific machines. You can use `!` before a machine type to negate it.
| `url` | url | | Homepage of the app. Here you can explain the app and options.
| `startup` | string | `application` | `initialize` will start the app on setup of Home Assistant. `system` is for things like databases and not dependent on other things. `services` will start before Home Assistant, while `application` is started afterwards. Finally `once` is for applications that don't run as a daemon.
| `webui` | string | | A URL for the web interface of this app. Like `http://[HOST]:[PORT:2839]/dashboard`, the port needs the internal port, which will be replaced with the effective port. It is also possible to bind the protocol part to a configuration option with: `[PROTO:option_name]://[HOST]:[PORT:2839]/dashboard` and it's looked up if it is `true` and it's going to `https`.
| `boot` | string | `auto` | `auto` start at boot is controlled by the system and `manual` configures the app to only be started manually. If addon should never be started at boot automatically, use `manual_only` to prevent users from changing it.
| `ports` | dict | | Network ports to expose from the container. Format is `"container-port/type": host-port`. If the host port is `null` then the mapping is disabled.
| `ports_description` | dict | | Network ports description mapping. Format is `"container-port/type": "description of this port"`. Alternatively use [Port description translations](#port-description-translations).
| `host_network` | bool | `false` | If `true`, the app runs on the host network.
| `host_ipc` | bool | `false` | Allow the IPC namespace to be shared with others.
| `host_dbus` | bool | `false` | Map the host D-Bus service into the app.
| `host_pid` | bool | `false` | Allow the container to run on the host PID namespace. Works only for not protected apps. **Warning:** Does not work with S6 Overlay. If need this to be `true` and you use the normal app base image you disable S6 by overriding `/init`. Or use an alternate base image.
| `host_uts` | bool | `false` | Use the hosts UTS namespace.
| `devices` | list | | Device list to map into the app. Format is: `<path_on_host>`. E.g., `/dev/ttyAMA0`
| `homeassistant` | string | | Pin a minimum required Home Assistant Core version for the app. Value is a version string like `2022.10.5`.
| `hassio_role` | str | `default` |Role-based access to Supervisor API. Available: `default`, `homeassistant`, `backup`, `manager` or `admin`
| `hassio_api` | bool | `false` | This app can access the Supervisor's REST API. Use `http://supervisor`.
| `homeassistant_api` | bool | `false` | This app can access the Home Assistant REST API proxy. Use `http://supervisor/core/api`.
| `docker_api` | bool | `false` | Allow read-only access to the Docker API for the app. Works only for not protected apps.
| `privileged` | list | | Privilege for access to hardware/system. Available access: `BPF`, `CHECKPOINT_RESTORE`, `DAC_READ_SEARCH`, `IPC_LOCK`, `NET_ADMIN`, `NET_RAW`, `PERFMON`, `SYS_ADMIN`, `SYS_MODULE`, `SYS_NICE`, `SYS_PTRACE`, `SYS_RAWIO`, `SYS_RESOURCE` or `SYS_TIME`.
| `full_access` | bool | `false` | Give full access to hardware like the privileged mode in Docker. Works only for not protected apps. Consider using other app options instead of this, like `devices`. If you enable this option, don't add `devices`, `uart`, `usb` or `gpio` as this is not needed.
| `apparmor` | bool/string | `true` | Enable or disable AppArmor support. If it is enabled, you can also use custom profiles with the name of the profile.
| `map` | list | | List of Home Assistant directory types to bind mount into your container. Possible values: `homeassistant_config`, `addon_config`, `ssl`, `addons`, `backup`, `share`, `media`, `all_addon_configs`, and `data`. Defaults to read-only, which you can change by adding the property `read_only: false`. By default, all paths map to `/<type-name>` inside the addon container, but an optional `path` property can also be supplied to configure the path (Example: `path: /custom/config/path`). If used, the path must not be empty, unique from any other path defined for the addon, and not the root path. Note that the `data` directory is always mapped and writable, but the `path` property can be set using the same conventions.
| `environment` | dict | | A dictionary of environment variables to run the app with.
| `audio` | bool | `false` | Mark this app to use the internal audio system. We map a working PulseAudio setup into the container. If your application does not support PulseAudio, you may need to install: Alpine Linux `alsa-plugins-pulse` or Debian/Ubuntu `libasound2-plugins`.
| `video` | bool | `false` | Mark this app to use the internal video system. All available devices will be mapped into the app.
| `gpio` | bool | `false` | If this is set to `true`, `/sys/class/gpio` will map into the app for access to the GPIO interface from the kernel. Some libraries also need  `/dev/mem` and `SYS_RAWIO` for read/write access to this device. On systems with AppArmor enabled, you need to disable AppArmor or provide your own profile for the app, which is better for security.
| `usb` | bool | `false` | If this is set to `true`, it would map the raw USB access `/dev/bus/usb` into the app with plug&play support.
| `uart` | bool | `false` | Default `false`. Auto mapping all UART/serial devices from the host into the app.
| `udev` | bool | `false` | Default `false`. Setting this to `true` gets the host udev database read-only mounted into the app.
| `devicetree` | bool | `false` | If this is set to `true`, `/device-tree` will map into the app.
| `kernel_modules` | bool | `false` | Map host kernel modules and config into the app (readonly) and give you `SYS_MODULE` permission.
| `stdin` | bool | `false` | If enabled, you can use the STDIN with Home Assistant API.
| `legacy` | bool | `false` | If the Docker image has no `hass.io` labels, you can enable the legacy mode to use the config data.
| `options` | dict | | Default options value of the app.
| `schema` | dict | | Schema for options value of the app. It can be `false` to disable schema validation and options.
| `image` | string | | For use with Docker Hub and other container registries. This should be set to the name of the image only (E.g, `ghcr.io/home-assistant/{arch}-addon-example`). If you use this option, set the active docker tag using the `version` option.
| `codenotary` | string | | For use with Codenotary CAS. This is the E-Mail address used to verify your image with Codenotary (E.g, `example@home-assistant.io`). This should match the E-Mail address used as the signer in the [app's extended build options](#app-extended-build)
| `timeout` | integer | 10 | Default 10 (seconds). The timeout to wait until the Docker daemon is done or will be killed.
| `tmpfs` | bool | `false` | If this is set to `true`, the containers `/tmp` uses tmpfs, a memory file system.
| `discovery` | list | | A list of services that this app provides for Home Assistant.
| `services` | list | | A list of services that will be provided or consumed with this app. Format is `service`:`function` and functions are: `provide` (this app can provide this service), `want` (this app can use this service) or `need` (this app needs this service to work correctly).
| `auth_api` | bool | `false` | Allow access to Home Assistant user backend.
| `ingress` | bool | `false` | Enable the ingress feature for the app.
| `ingress_port` | integer | `8099` | For apps that run on the host network, you can use `0` and read the port later via the API.
| `ingress_entry` | string | `/` | Modify the URL entry point.
| `ingress_stream` | bool | `false` | When enabled, requests to the app are streamed
| `panel_icon` | string | `mdi:puzzle` | [MDI icon](https://materialdesignicons.com/) for the menu panel integration.
| `panel_title` | string | | Defaults to the app name, but can be modified with this option.
| `panel_admin` | bool | `true` | Make the menu entry only available to users in the admin group.
| `backup` | string | `hot` | `hot` or `cold`. If `cold`, the supervisor turns the app off before taking a backup (the `pre/post` options are ignored when `cold` is used).
| `backup_pre` | string | | Command to execute in the context of the app before the backup is taken.
| `backup_post` | string | | Command to execute in the context of the app after the backup was taken.
| `backup_exclude` | list | | List of files/paths (with glob support) that are excluded from backups.
| `advanced` | bool | `false` | Set this to `true` to require the user to have enabled "Advanced" mode for it to show.
| `stage` | string | `stable` | Flag app with follow attribute: `stable`, `experimental` or `deprecated`. Apps set to `experimental` or `deprecated` will not show up in the store unless the user enables advanced mode.
| `init` | bool | `true` | Set this to `false` to disable the Docker default system init. Use this if the image has its own init system (Like [s6-overlay](https://github.com/just-containers/s6-overlay)). *Note: Starting in V3 of S6 setting this to `false` is required or the addon won't start, see [here](https://developers.home-assistant.io/blog/2022/05/12/s6-overlay-base-images) for more information.*
| `watchdog` | string | | A URL for monitoring the app health. Like `http://[HOST]:[PORT:2839]/dashboard`, the port needs the internal port, which will be replaced with the effective port. It is also possible to bind the protocol part to a configuration option with: `[PROTO:option_name]://[HOST]:[PORT:2839]/dashboard` and it's looked up if it is `true` and it's going to `https`. For simple TCP port monitoring you can use `tcp://[HOST]:[PORT:80]`. It works for apps on the host or internal network.
| `realtime` | bool | `false` | Give app access to host schedule including `SYS_NICE` for change execution time/priority.
| `journald` | bool | `false` | If set to `true`, the host's system journal will be mapped read-only into the app. Most of the time the journal will be in `/var/log/journal` however on some hosts you will find it in `/run/log/journal`. Apps relying on this capability should check if the directory `/var/log/journal` is populated and fallback on `/run/log/journal` if not.
| `breaking_versions` | list | | List of breaking versions of the addon. A manual update will always be required if the update is to a breaking version or would cross a breaking version, even if users have auto-update enabled for the addon.
| `ulimits` | dict | | Dictionary of resource limit (ulimit) settings for the app container. Each limit can be either a plain integer value or a dictionary with the keys `soft` and `hard`, each taking a plain integer for fine-grained control. Individual values must not be larger than the host's hard limit (inspectable by `ulimit -Ha`; e.g. 524288 in case of the `nofile` limit in the Home Assistant Operating System). |

### Options / Schema

The `options` dictionary contains all available options and their default value. Set the default value to `null` or define the data type in the `schema` dictionary to make an option mandatory. This way, the option needs to be given by the user before the app (formerly known as an add-on) can start. Nested arrays and dictionaries are supported with a maximum depth of two.

To make an option truly optional (without default value), the `schema` dictionary needs to be used. Put a `?` at the end of the data type and *do not* define any default value in the `options` dictionary. If any default value is given, the option becomes a required value.

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

:::note
If you remove a configuration option from an app already deployed to users, it is recommended to delete the option to avoid a warning like `Option '<options_key>' does not exist in the schema for <App Name> (<app slug>)`.

To remove an option the Supervisor addons API can be used. Using bashio this boils down to `bashio::addon.option '<options_key>'` (without additional argument to delete this option key). To check if the option is still set, check the content of the options dictionary like so:

```sh
options=$(bashio::addon.options)
old_key='test'
if bashio::jq.exists "${options}" ".${old_key}"; then
    bashio::log.info "Removing ${old_key}"
    bashio::addon.option "${old_key}"
fi
```

:::


The `schema` looks like `options` but describes how we should validate the user input. For example:

```yaml
message: str
logins:
  - username: str
    password: str
random:
  - "match(^\\w*$)"
ssh:
  private_key: str
  public_key: str
link: url
size: "int(5,20)"
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

## App extended build

Additional build options for an app are stored in `build.yaml`. This file will be read from our build systems.
This is only needed if you are not using the default images or need additional things.

```yaml
build_from:
  armhf: mycustom/base-image:latest
args:
  my_build_arg: xy
```

| Key | Required | Description |
| --- | -------- | ----------- |
| build_from | no | A dictionary with the hardware architecture as the key and the base Docker image as the value.
| args | no | Allow additional Docker build arguments as a dictionary.
| labels | no | Allow additional Docker labels as a dictionary.
| codenotary | no | Enable container signature with codenotary CAS.
| codenotary.signer | no | Owner signer E-Mail address for this image.
| codenotary.base_image | no | Verify the base container image. If you use our official images, use `notary@home-assistant.io`

We provide a set of [base images][docker-base] which should cover a lot of needs. If you don't want to use the Alpine based version or need a specific image tag, feel free to pin this requirement for your build with the `build_from` option.

[docker-base]: https://github.com/home-assistant/docker-base

## App translations

Apps (formerly known as add-ons) can provide translation files for configuration options that are used in the UI.

Example path to translation file: `addon/translations/{language_code}.yaml`

For `{language_code}` use a valid language code, like `en`, for a [full list have a look here](https://github.com/home-assistant/frontend/blob/dev/src/translations/translationMetadata.json), `en.yaml` would be a valid filename.

This file supports 2 main keys `configuration` and `network`.

### Configuration translations

```yaml
configuration:
  ssl:
    name: Enable SSL
    description: Enable usage of SSL on the webserver inside the app
  ssh:
    name: SSH Options
    description: Configure SSH authentication options
    fields:
      public_key:
        name: Public Key
        description: Client Public Key
      private_key:
        name: Private Key
        description: Client Private Key
```

_The key under `configuration` (`ssl`) in this case, needs to match a key in your `schema` configuration (in [`config.yaml`](#app-configuration))._

### Port description translations

```yaml
network:
  80/TCP: The webserver port (Not used for Ingress)
```

_The key under `network` (`80/TCP`) in this case, needs to match a key in your `ports` configuration (in [`config.yaml`](#app-configuration))._

## App advanced options

Sometimes app developers may want to allow users to configure to provide their own files which are then provided directly to an internal service as part of its configuration. Some examples include:

1. Internal service wants a list of configured items and the schema of each item is complex but the service provides no UI for doing so, easier to point users to their documentation and ask for a file in that schema.
2. Internal service requires a binary file or some file configured externally as part of its config.
3. Internal service supports live reloading on config change and you want to support that for some or all of its configuration by asking users for a file in its schema to live reload from.

In cases like these you should add `addon_config` to `map` in your addon's configuration file. And then you should direct your users to put this file in the folder `/addon_configs/{REPO}_<your addon's slug>`. If an app is installed locally, `{REPO}` will be `local`. If the app is installed from a GitHub repository, `{REPO}` is a hashed identifier generated from the GitHub repository's URL (ex: `https://github.com/xy/my_hassio_addons`).
This folder will be mounted at `/config` inside your addon's docker container at runtime. You should either provide an option in your addon's schema that collects a relative path to the file(s) starting from this folder or rely on a fixed filename and include that in your documentation.

Another use case of `addon_config` could be if your addon wants to provide file-based output or give users access to internal files for debugging. Some examples include:

1. Internal service logs to a file and you wish to allow users access to that log file
2. Internal service uses a database and you wish to allow users access to that database for debugging
3. Internal service generates files which are intended to be used in its own config and you wish to allow users to access them as well

In cases like these you should add `addon_config:rw` to `map` so your addon can write to this folder as well as read from it. And then you should write these files out to `/config` during your addon's runtime so users can see and access them.
