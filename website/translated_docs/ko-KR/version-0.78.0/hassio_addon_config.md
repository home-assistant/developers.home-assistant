---
title: Add-On Configuration
id: version-0.78.0-hassio_addon_config
original_id: hassio_addon_config
---

Each add-on is stored in a folder. The file structure looks like this:

```text
addon_name/
  build.json
  CHANGELOG.md
  config.json
  Dockerfile
  icon.png
  logo.png
  README.md
  run.sh
```

## Add-on script

As with every Docker container, you will need a script to run when the container is started. A user might run many add-ons, so it is encouraged to try to stick to Bash scripts if you're doing simple things.

When developing your script:

- `/data` is a volume for persistent storage.
- `/data/options.json` contains the user configuration. You can use `jq` inside your shell script to parse this data. However, you might have to install `jq` as a separate package in your container (see `Dockerfile` below).

```bash
CONFIG_PATH=/data/options.json

TARGET="$(jq --raw-output '.target' $CONFIG_PATH)"
```

So if your `options` contain

```json
{ "target": "beer" }
```

then there will be a variable `TARGET` containing `beer` in the environment of your bash file afterwards.

## Add-on Docker file

All add-ons are based on Alpine Linux 3.6. Hass.io will automatically substitute the right base image based on the machine architecture. Add `tzdata` if you need run in a different timezone. `tzdata` Is is already added to our base images.

    ARG BUILD_FROM
    FROM $BUILD_FROM
    
    ENV LANG C.UTF-8
    
    # Install requirements for add-on
    RUN apk add --no-cache jq
    
    # Copy data for add-on
    COPY run.sh /
    RUN chmod a+x /run.sh
    
    CMD [ "/run.sh" ]
    

If you don't use local build on device or our build script, make sure that the Dockerfile have also a set of labels include:

    LABEL io.hass.version="VERSION" io.hass.type="addon" io.hass.arch="armhf|aarch64|i386|amd64"
    

It is possible to use own base image with `build.json` or if you do not need support for automatic multi-arch building you can also use a simple docker `FROM`.

### Build Args

We support the following build arguments by default:

| ARG           | 설명                                                           |
| ------------- | ------------------------------------------------------------ |
| BUILD_FROM    | Hold image for dynamic builds or buildings over our systems. |
| BUILD_VERSION | Add-on version (read from `config.json`).                    |
| BUILD_ARCH    | Hold current build arch inside.                              |

## Add-on config

The config for an add-on is stored in `config.json`.

```json
{
  "name": "xy",
  "version": "1.2",
  "slug": "folder",
  "description": "long description",
  "arch": ["amd64"],
  "url": "website with more information about add-on (ie a forum thread for support)",
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

| 키                 | 구분          | Required | 설명                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name              | string      | yes      | Name of the add-on                                                                                                                                                                                                                                                                                                                                  |
| version           | string      | yes      | Version of the add-on                                                                                                                                                                                                                                                                                                                               |
| slug              | string      | yes      | Slug of the add-on                                                                                                                                                                                                                                                                                                                                  |
| description       | string      | yes      | Description of the add-on                                                                                                                                                                                                                                                                                                                           |
| arch              | list        | no       | List of supported arch: `armhf`, `aarch64`, `amd64`, `i386`. Default all.                                                                                                                                                                                                                                                                           |
| url               | url         | no       | Homepage of the addon. Here you can explain the add-ons and options.                                                                                                                                                                                                                                                                                |
| startup           | bool        | yes      | `initialize` will start addon on setup of Hass.io. `system` is for things like databases and not dependent on other things. `services` will start before Home Assistant, while `application` is started afterwards. Finally `once` is for applications that don't run as a daemon.                                                                  |
| webui             | string      | no       | A URL for web interface of this add-on. Like `http://[HOST]:[PORT:2839]/dashboard`, the port needs the internal port, which will be replaced with the effective port. It is also possible to bind the proto part to a config options with: `[PROTO:option_name]://[HOST]:[PORT:2839]/dashboard` and he lookup if they is True and going to `https`. |
| boot              | string      | yes      | `auto` by system and manual or only `manual`                                                                                                                                                                                                                                                                                                        |
| ports             | dict        | no       | Network ports to expose from the container. Format is `"container-port/type": host-port`.                                                                                                                                                                                                                                                           |
| host_network      | bool        | no       | If that is True, the add-on run on host network.                                                                                                                                                                                                                                                                                                    |
| host_ipc          | bool        | no       | Default False. Allow to share the IPC namespace with others.                                                                                                                                                                                                                                                                                        |
| host_dbus         | bool        | no       | Default False. Map Host dbus service into add-on.                                                                                                                                                                                                                                                                                                   |
| host_pid          | bool        | no       | Default False. Allow to run container on host PID namespace. Work only for not protected add-ons.                                                                                                                                                                                                                                                   |
| devices           | list        | no       | Device list to map into the add-on. Format is: `<path_on_host>:<path_in_container>:<cgroup_permissions>`. i.e. `/dev/ttyAMA0:/dev/ttyAMA0:rwm`                                                                                                                                                                                    |
| auto_uart         | bool        | no       | Default False. Auto mapping all UART/Serial device from host into add-on.                                                                                                                                                                                                                                                                           |
| hassio_role       | str         | no       | Default `default`. Role based access to Hass.io API. Available: `default`, `homeassistant`, `manager`, `admin`.                                                                                                                                                                                                                                     |
| hassio_api        | bool        | no       | This add-on can access to Hass.io REST API. It set the host alias `hassio`.                                                                                                                                                                                                                                                                         |
| homeassistant_api | bool        | no       | This add-on can access to Hass.io Home-Assistant REST API proxy. Use `http://hassio/homeassistant/api`.                                                                                                                                                                                                                                             |
| docker_api        | bool        | no       | Allow read-oly access to docker API for add-on. Work only for not protected add-ons.                                                                                                                                                                                                                                                                |
| privileged        | list        | no       | Privilege for access to hardware/system. Available access: `NET_ADMIN`, `SYS_ADMIN`, `SYS_RAWIO`, `SYS_TIME`, `SYS_NICE`, `SYS_RESOURCE`, `SYS_PTRACE`.                                                                                                                                                                                             |
| full_access       | bool        | no       | Give full access to hardware like the privileged mode in docker. Work only for not protected add-ons.                                                                                                                                                                                                                                               |
| apparmor          | bool/string | no       | Enable or disable AppArmor support. If it is enable, you can also use custom profiles with the name of the profile.                                                                                                                                                                                                                                 |
| map               | list        | no       | List of maps for additional Hass.io folders. Possible values: `config`, `ssl`, `addons`, `backup`, `share`. Defaults to `ro`, which you can change by adding `:rw` to the end of the name.                                                                                                                                                          |
| environment       | dict        | no       | A dict of environment variable to run add-on.                                                                                                                                                                                                                                                                                                       |
| audio             | bool        | no       | Boolean. Mark this add-on to use internal an audio system. The ALSA configuration for this add-on will be mount automatic.                                                                                                                                                                                                                          |
| gpio              | bool        | no       | Boolean. If this is set to True, `/sys/class/gpio` will map into add-on for access to GPIO interface from kernel. Some library need also `/dev/mem` and `SYS_RAWIO` for read/write access to this device. On system with AppArmor enabled, you need disable AppArmor or better for security, provide you own profile for the add-on.                |
| devicetree        | bool        | no       | Boolean. If this is set to True, `/device-tree` will map into add-on.                                                                                                                                                                                                                                                                               |
| stdin             | bool        | no       | Boolean. If that is enable, you can use the STDIN with Hass.io API.                                                                                                                                                                                                                                                                                 |
| legacy            | bool        | no       | Boolean. If the docker image have no hass.io labels, you can enable the legacy mode to use the config data.                                                                                                                                                                                                                                         |
| options           | dict        | yes      | Default options value of the add-on                                                                                                                                                                                                                                                                                                                 |
| schema            | dict        | yes      | Schema for options value of the add-on. It can be `False` to disable schema validation and use custom options.                                                                                                                                                                                                                                      |
| image             | string      | no       | For use with Docker Hub and other container registries.                                                                                                                                                                                                                                                                                             |
| timeout           | integer     | no       | Default 10 (second). The timeout to wait until the docker is done or will be killed.                                                                                                                                                                                                                                                                |
| tmpfs             | string      | no       | Mount a tmpfs file system in `/tmpfs`. Valide format for this option is : `size=XXXu,uid=N,rw`. Size is mandatory, valid units (`u`) are `k`, `m` and `g` and `XXX` has to be replaced by a number. `uid=N` (with `N` the uid number) and `rw` are optional.                                                                                        |

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

- str
- bool
- int / int(min,) / int(,max) / int(min,max)
- float / float(min,) / float(,max) / float(min,max)
- email
- url
- port
- match(REGEX)

## Add-on extended build

Additional build options for an add-on is stored in `build.json`. This file will be read from our build systems. You need this only, if you not use the default images or need additionals things.

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

| 키          | Required | 설명                                                                                                     |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------ |
| build_from | no       | A dictionary with the hardware architecture as the key and the base Docker image as value.             |
| squash     | no       | Default `False`. Be carfully with this option, you can not use the image for caching stuff after that! |
| args       | no       | Allow to set additional Docker build arguments as a dictionary.                                        |