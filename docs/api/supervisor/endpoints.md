---
title: "Endpoints"
---
import ApiEndpoint from '@site/static/js/api_endpoint.jsx'

For API endpoints marked with :lock: you need use an authorization header with a `Bearer` token.

The token is available for add-ons and Home Assistant using the
`SUPERVISOR_TOKEN` environment variable.

To see more details about each endpoint, click on it to expand it.

### Addons

<ApiEndpoint path="/addons" method="get">
Return overview information about add-ons and add-on repositories.

**Payload:**

| key          | type | description                                        |
| ------------ | ---- | -------------------------------------------------- |
| addons       | list | A list of [Addon models](api/supervisor/models.md#addon)           |
| repositories | list | A list of [Repository models](api/supervisor/models.md#repository) |

**Example response:**

```json
{
  "addons": [
    {
      "name": "Awesome add-on",
      "slug": "awesome_addon",
      "description": "My awesome add-on",
      "advanced": false,
      "stage": "stable",
      "repository": "core",
      "version": null,
      "version_latest": "1.0.1",
      "update_available": false,
      "installed": false,
      "detached": true,
      "available": true,
      "build": false,
      "url": null,
      "icon": false,
      "logo": false
    }
  ],
  "repositories": [
    {
      "slug": "12345678",
      "name": "Awesome repository",
      "source": "https://github.com/awesome/repository",
      "url": null,
      "maintainer": "Awesome maintainer <awesome@example.com>"
    }
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/addons/reload" method="post">
Reloads the information stored about add-ons.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/changelog" method="get">
Get the changelog for a add.on.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/documentation" method="get">
Get the documentation for a add.on.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/logs" method="get">
Returns the raw container logs from docker.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/icon" method="get">
Get the add-on icon
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/info" method="get">
Get details about a add-on

**Returned data:**

| key                 | type               | description                                                                            |
| ------------------- | ------------------ | -------------------------------------------------------------------------------------- |
| advanced            | boolean            | `true` if advanced mode is enabled                                                     |
| apparmor            | string             | disabled, default or the name of the profile                                           |
| arch                | list               | A list of supported architectures for the add-on                                       |
| audio               | boolean            | `true` if audio is enabled                                                             |
| audio_input         | float or null      | The device index                                                                       |
| audio_output        | float or null      | The device index                                                                       |
| auth_api            | boolean            | `true` if auth api access is granted is enabled                                        |
| auto_uart           | boolean            | `true` if auto_uart access is granted is enabled                                       |
| auto_update         | boolean            | `true` if auto update is enabled                                                       |
| available           | boolean            | `true` if the add-on is available                                                      |
| boot                | string             | "boot" or "manual"                                                                     |
| build               | boolean            | `true` if local add-on                                                                 |
| changelog           | boolean            | `true` if changelog is available                                                       |
| description         | string             | The add-on description                                                                 |
| detached            | boolean            | `true` if the add-on is running detached                                               |
| devices             | list               | A list of attached devices                                                             |
| devicetree          | boolean            | `true` if devicetree access is granted is enabled                                      |
| discovery           | list               | A list of discovery services                                                           |
| dns                 | list               | A list of DNS servers used by the add-on                                               |
| docker_api          | boolean            | `true` if docker_api access is granted is enabled                                      |
| documentation       | boolean            | `true` if documentation is available                                                   |
| full_access         | boolean            | `true` if full access access is granted is enabled                                     |
| gpio                | boolean            | `true` if gpio access is granted is enabled                                            |
| hassio_api          | boolean            | `true` if hassio api access is granted is enabled                                      |
| hassio_role         | string             | The hassio role (default, homeassistant, manager, admin)                               |
| homeassistant       | string or null     | The minimum Home Assistant Core version                                                |
| homeassistant_api   | boolean            | `true` if homeassistant api access is granted is enabled                               |
| host_dbus           | boolean            | `true` if host dbus access is granted is enabled                                       |
| host_ipc            | boolean            | `true` if host ipc access is granted is enabled                                        |
| host_network        | boolean            | `true` if host network access is granted is enabled                                    |
| host_pid            | boolean            | `true` if host pid access is granted is enabled                                        |
| hostname            | string             | The host name of the add-on                                                            |
| icon                | boolean            | `true` if icon is available                                                            |
| ingress             | boolean            | `true` if ingress is enabled                                                           |
| ingress_entry       | string or null     | The ingress entrypoint                                                                 |
| ingress_panel       | boolean or null    | `true` if ingress_panel is enabled                                                     |
| ingress_port        | int or null        | The ingress port                                                                       |
| ingress_url         | string or null     | The ingress URL                                                                        |
| ip_address          | string             | The IP address of the add-on                                                           |
| kernel_modules      | boolean            | `true` if kernel module access is granted is enabled                                   |
| logo                | boolean            | `true` if logo is available                                                            |
| long_description    | string             | The long add-on description                                                            |
| machine             | list               | A list of supported machine types for the add-on                                       |
| name                | string             | The name of the add-on                                                                 |
| network             | dictionary or null | The network configuration for the add-on                                               |
| network_description | dictionary or null | The description for the network configuration                                          |
| options             | dictionary         | The add-on configuration                                                               |
| privileged          | list               | A list of hardwars/system attributes the add-onn has access to                         |
| protected           | boolean            | `true` if protection mode is enabled                                                   |
| rating              | int                | The addon rating                                                                       |
| repository          | string             | The URL to the add-on repository                                                       |
| schema              | dictionary or null | The schema for the add-on configuration                                                |
| services_role       | list               | A list of services and the add-ons role for that service                               |
| slug                | string             | The add-on slug                                                                        |
| stage               | string             | The add-on stage (stable, experimental, deprecated)                                    |
| startup             | string             | The stage when the add-on is started (initialize, system, services, application, once) |
| state               | string or null     | The state of the add-on (started, stopped)                                             |
| stdin               | boolean            | `true` if the add-on accepts stdin commands                                            |
| udev                | boolean            | `true` if udev access is granted is enabled                                            |
| update_available    | boolean            | `true` if an update is available                                                       |
| url                 | string or null     | URL to more information about the add-on                                               |
| usb                 | list               | A list of attached USB devices                                                         |
| version             | string             | The installed version of the add-on                                                    |
| version_latest      | string             | The latest version of the add-on                                                       |
| video               | boolean            | `true` if video is enabled                                                             |
| watchdog            | boolean            | `true` if watchdog is enabled                                                          |
| webui               | string or null     | The URL to the web UI for the add-on                                                   |

**Example response:**

```json
{
  "advanced": false,
  "apparmor": "default",
  "arch": ["armhf", "aarch64", "i386", "amd64"],
  "audio_input": null,
  "audio_output": null,
  "audio": false,
  "auth_api": false,
  "auto_uart": false,
  "auto_update": false,
  "available": false,
  "boot": "auto",
  "build": false,
  "changelog": false,
  "description": "description",
  "detached": false,
  "devices": ["/dev/xy"],
  "devicetree": false,
  "discovery": ["service"],
  "dns": [],
  "docker_api": false,
  "documentation": false,
  "full_access": false,
  "gpio": false,
  "hassio_api": false,
  "hassio_role": "default",
  "homeassistant_api": false,
  "homeassistant": null,
  "host_dbus": false,
  "host_ipc": false,
  "host_network": false,
  "host_pid": false,
  "hostname": "awesome-addon",
  "icon": false,
  "ingress_entry": null,
  "ingress_panel": true,
  "ingress_port": 1337,
  "ingress_url": null,
  "ingress": false,
  "ip_address": "172.0.0.21",
  "kernel_modules": false,
  "logo": false,
  "long_description": "Long description",
  "machine": ["raspberrypi2", "tinker"],
  "name": "Awesome add-on",
  "network_description": "{}|null",
  "network": {},
  "options": {},
  "privileged": ["NET_ADMIN", "SYS_ADMIN"],
  "protected": false,
  "rating": "1-6",
  "repository": "12345678",
  "schema": {},
  "services_role": ["service:access"],
  "slug": "awesome_addon",
  "stage": "stable",
  "startup": "application",
  "state": "started",
  "stdin": false,
  "udev": false,
  "update_available": false,
  "url": null,
  "usb": ["/dev/usb1"],
  "version_latest": "1.0.2",
  "version": "1.0.0",
  "video": false,
  "watchdog": true,
  "webui": "http://[HOST]:1337/xy/zx"
}
```

</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/install" method="post">
Install a add-on
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/logo" method="get">
Get the add-on logo
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/options" method="post">
Set the protection mode on a add-on.

This function is not callable by itself and you can not use `self` as the slug here.

:::tip
To reset customized network/audio/options, set it `null`.
:::

**Payload:**

| key           | type          | description                             |
| ------------- | ------------- | --------------------------------------- |
| boot          | string        | (auto, manual)                          |
| auto_update   | boolean       | `true` if the add-on should auto update |
| network       | dictionary    | A map of network configuration.         |
| options       | dictionary    | The add-on configuration                |
| audio_output  | float or null | The index of the audio output device    |
| audio_input   | float or null | The index of the audio input device     |
| ingress_panel | string        | The path for the ingress panel          |
| watchdog      | boolean       | `true` if watchdog is enabled           |

**You need to supply at least one key in the payload.**

**Example payload:**

```json
{
  "boot": "manual",
  "auto_update": false,
  "network": {
    "CONTAINER": "1337"
  },
  "options": {
    "awesome": true
  },
  "watchdog": true
}
```

</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/options/validate" method="post">
Run a configuration validation against the current stored add-on configuration.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/rebuild" method="post">
Rebuild the add-on, only supported for local build add-ons.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/restart" method="post">
Restart a add-on
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/security" method="post">
Set the protection mode on a add-on.

This function is not callable by itself and you can not use `self` as the slug here.

**Payload:**

| key       | type    | description                     |
| --------- | ------- | ------------------------------- |
| protected | boolean | `true` if protection mode is on |

</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/start" method="post">
Start a add-on
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/stats" method="get">

Returns a [Stats model](api/supervisor/models.md#stats) for the add-on.

**Example response:**

```json
{
  "cpu_percent": 14.0,
  "memory_usage": 288888,
  "memory_limit": 322222,
  "memory_percent": 32.4,
  "network_tx": 110,
  "network_rx": 902,
  "blk_read": 12,
  "blk_write": 27
}
```

</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/stdin" method="post">
Write data to add-on stdin.

The payload you want to pass into the addon you give the endpoint as the body of the request.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/stop" method="post">
Stop a add-on
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/uninstall" method="post">
Uninstall a add-on
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/update" method="post">
Update a add-on
</ApiEndpoint>

### Audio

<ApiEndpoint path="/audio/default/input" method="post">
Set a profile as the default input profile

**Payload:**

| key  | type   | optional | description             |
| ---- | ------ | -------- | ----------------------- |
| name | string | False    | The name of the profile |

</ApiEndpoint>

<ApiEndpoint path="/audio/default/output" method="post">
Set a profile as the default output profile

**Payload:**

| key  | type   | optional | description             |
| ---- | ------ | -------- | ----------------------- |
| name | string | False    | The name of the profile |

</ApiEndpoint>

<ApiEndpoint path="/audio/info" method="get">
Return information about the audio plugin.

**Returned data:**

| key              | type       | description                      |
| ---------------- | ---------- | -------------------------------- |
| host             | string     | The IP address of the plugin     |
| version          | string     | The installed observer version   |
| version_latest   | string     | The latest published version     |
| update_available | boolean    | `true` if an update is available |
| audio            | dictionary | A [Audio model](api/supervisor/models.md#audio) |

**Example response:**

```json
{
  "host": "172.0.0.19",
  "version": "1",
  "latest_version": "2",
  "update_available": true,
  "audio": {
    "card": [
      {
        "name": "Awesome card",
        "index": 1,
        "driver": "Awesome driver",
        "profiles": [
          {
            "name": "Awesome profile",
            "description": "My awesome profile",
            "active": false
          }
        ]
      }
    ],
    "input": [
      {
        "name": "Awesome device",
        "index": 0,
        "description": "My awesome device",
        "volume": 0.3,
        "mute": false,
        "default": false,
        "card": null,
        "applications": [
          {
            "name": "Awesome application",
            "index": 0,
            "stream_index": 0,
            "stream_type": "INPUT",
            "volume": 0.3,
            "mute": false,
            "addon": "awesome_addon"
          }
        ]
      }
    ],
    "output": [
      {
        "name": "Awesome device",
        "index": 0,
        "description": "My awesome device",
        "volume": 0.3,
        "mute": false,
        "default": false,
        "card": 1,
        "applications": [
          {
            "name": "Awesome application",
            "index": 0,
            "stream_index": 0,
            "stream_type": "INPUT",
            "volume": 0.3,
            "mute": false,
            "addon": "awesome_addon"
          }
        ]
      }
    ],
    "application": [
      {
        "name": "Awesome application",
        "index": 0,
        "stream_index": 0,
        "stream_type": "OUTPUT",
        "volume": 0.3,
        "mute": false,
        "addon": "awesome_addon"
      }
    ]
  }
}
```

</ApiEndpoint>

<ApiEndpoint path="/audio/logs" method="get">
Returns the raw container logs from docker.
</ApiEndpoint>

<ApiEndpoint path="/audio/mute/input" method="post">
Mute input devices

**Payload:**

| key    | type    | optional | description             |
| ------ | ------- | -------- | ----------------------- |
| index  | string  | False    | The index of the device |
| active | boolean | False    | `true` if muted         |

</ApiEndpoint>

<ApiEndpoint path="/audio/mute/input/<application>" method="post">
Mute input for a specific application

**Payload:**

| key    | type    | optional | description             |
| ------ | ------- | -------- | ----------------------- |
| index  | string  | False    | The index of the device |
| active | boolean | False    | `true` if muted         |

</ApiEndpoint>

<ApiEndpoint path="/audio/mute/output" method="post">
Mute output devices

**Payload:**

| key    | type    | optional | description             |
| ------ | ------- | -------- | ----------------------- |
| index  | string  | False    | The index of the device |
| active | boolean | False    | `true` if muted         |

</ApiEndpoint>

<ApiEndpoint path="/audio/mute/output/<application>" method="post">
Mute output for a specific application

**Payload:**

| key    | type    | optional | description             |
| ------ | ------- | -------- | ----------------------- |
| index  | string  | False    | The index of the device |
| active | boolean | False    | `true` if muted         |

</ApiEndpoint>

<ApiEndpoint path="/audio/profile" method="post">
Create a audio profile

**Payload:**

| key  | type   | optional | description                  |
| ---- | ------ | -------- | ---------------------------- |
| card | string | False    | The name of the audio device |
| name | string | False    | The name of the profile      |

</ApiEndpoint>

<ApiEndpoint path="/audio/reload" method="post">
Reload audio information
</ApiEndpoint>

<ApiEndpoint path="/audio/restart" method="post">
Restart the audio plugin
</ApiEndpoint>

<ApiEndpoint path="/audio/stats" method="get">

Returns a [Stats model](api/supervisor/models.md#stats) for the audio plugin.

**Example response:**

```json
{
  "cpu_percent": 14.0,
  "memory_usage": 288888,
  "memory_limit": 322222,
  "memory_percent": 32.4,
  "network_tx": 110,
  "network_rx": 902,
  "blk_read": 12,
  "blk_write": 27
}
```

</ApiEndpoint>

<ApiEndpoint path="/audio/update" method="post">
Update the audio plugin

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</ApiEndpoint>

<ApiEndpoint path="/audio/volume/input" method="post">
Set the input volume

**Payload:**

| key    | type   | optional | description                         |
| ------ | ------ | -------- | ----------------------------------- |
| index  | string | False    | The index of the device             |
| volume | float  | False    | The volume (between `0.0`and `1.0`) |

</ApiEndpoint>

<ApiEndpoint path="/audio/volume/input/<application>" method="post">
Set the input volume for a specific application

**Payload:**

| key    | type   | optional | description                         |
| ------ | ------ | -------- | ----------------------------------- |
| index  | string | False    | The index of the device             |
| volume | float  | False    | The volume (between `0.0`and `1.0`) |

</ApiEndpoint>

<ApiEndpoint path="/audio/volume/output" method="post">
Set the output volume

**Payload:**

| key    | type   | optional | description                         |
| ------ | ------ | -------- | ----------------------------------- |
| index  | string | False    | The index of the device             |
| volume | float  | False    | The volume (between `0.0`and `1.0`) |

</ApiEndpoint>

<ApiEndpoint path="/audio/volume/output/<application>" method="post">
Set the output volume for a specific application

**Payload:**

| key    | type   | optional | description                         |
| ------ | ------ | -------- | ----------------------------------- |
| index  | string | False    | The index of the device             |
| volume | float  | False    | The volume (between `0.0`and `1.0`) |

</ApiEndpoint>

### Auth

<ApiEndpoint path="/auth" method="post">
You can do authentication against Home Assistant Core.
You can POST the data as JSON, as urlencoded (with `application/x-www-form-urlencoded` header) or by using use basic authentication.

**Payload:**

| key      | type   | description               |
| -------- | ------ | ------------------------- |
| username | string | The username for the user |
| password | string | The password for the user |

</ApiEndpoint>

<ApiEndpoint path="/auth/reset" method="post">
Set a new password for a Home Assistant Core user.

**Payload:**

| key      | type   | description                   |
| -------- | ------ | ----------------------------- |
| username | string | The username for the user     |
| password | string | The new password for the user |

</ApiEndpoint>

<ApiEndpoint path="/auth/cache" method="delete">

Reset internal authentication cache, this is useful if you have changed the password for a user and need to clear the internal cache.

</ApiEndpoint>


### CLI

<ApiEndpoint path="/cli/info" method="get">
Returns information about the CLI plugin

**Returned data:**

| key              | type       | description                      |
| ---------------- | ---------- | -------------------------------- |
| version          | string     | The installed cli version        |
| version_latest   | string     | The latest published version     |
| update_available | boolean    | `true` if an update is available |

**Example response:**

```json
{
  "version": "1",
  "version_latest": "2",
  "update_available": true
}
```

</ApiEndpoint>

<ApiEndpoint path="/cli/stats" method="get">

Returns a [Stats model](api/supervisor/models.md#stats) for the CLI plugin.

**Example response:**

```json
{
  "cpu_percent": 14.0,
  "memory_usage": 288888,
  "memory_limit": 322222,
  "memory_percent": 32.4,
  "network_tx": 110,
  "network_rx": 902,
  "blk_read": 12,
  "blk_write": 27
}
```

</ApiEndpoint>

<ApiEndpoint path="/cli/update" method="post">
Update the CLI plugin

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</ApiEndpoint>

### Core

<ApiEndpoint path="/core/api" method="get">
Proxy GET API calls to the Home Assistant API
</ApiEndpoint>

<ApiEndpoint path="/core/api" method="post">
Proxy POST API calls to the Home Assistant API
</ApiEndpoint>

<ApiEndpoint path="/core/check" method="post">
Run a configuration check
</ApiEndpoint>

<ApiEndpoint path="/core/info" method="get">
Returns information about the Home Assistant core

**Returned data:**

| key              | type           | description                                                |
| ---------------- | -------------- | ---------------------------------------------------------- |
| version          | string         | The installed core version                                 |
| version_latest   | string         | The latest published version in the active channel         |
| update_available | boolean        | `true` if an update is available                           |
| arch             | string         | The architecture of the host (armhf, aarch64, i386, amd64) |
| machine          | string         | The machine type that is running the host                  |
| ip_address       | string         | The internal docker IP address to the supervisor           |
| image            | string         | The container image that is running the core               |
| boot             | boolean        | `true` if it should start on boot                          |
| port             | int            | The port Home Assistant is running on                      |
| ssl              | boolean        | `true` if Home Assistant is using SSL                      |
| watchdog         | boolean        | `true` if watchdog is enabled                              |
| wait_boot        | int            | Max time to wait during boot                               |
| audio_input      | string or null | The description of the audio input device                  |
| audio_output     | string or null | The description of the audio output device                 |

**Example response:**

```json
{
  "version": "0.117.0",
  "version_latest": "0.117.0",
  "update_available": true,
  "arch": "arch",
  "machine": "amd64",
  "ip_address": "172.0.0.15",
  "image": "homeassistant/home-assistant",
  "boot": true,
  "port": 8123,
  "ssl": false,
  "watchdog": true,
  "wait_boot": 800,
  "audio_input": "AMCP32",
  "audio_output": "AMCP32"
}
```

</ApiEndpoint>

<ApiEndpoint path="/core/logs" method="get">
Returns the raw container logs from docker.
</ApiEndpoint>

<ApiEndpoint path="/core/options" method="post">
Update options for Home Assistant, you need to supply at least one of the payload keys to the API call.
You need to call `/core/restart` after updating the options.

:::tip
Passing `image` with `null` and `version_latest` with `null` resets these options.
:::

**Payload:**

| key            | type           | description                         |
| -------------- | -------------- | ----------------------------------- |
| image          | string         | Name of custom image or null        |
| version_latest | string or null | Optional for custom image or null   |
| port           | string         | The port that Home Assistant run on |
| ssl            | boolean        | `true` if SSL is enabled            |
| watchdog       | boolean        | `true` if watchdog is enabled       |
| audio_input    | string or null | Profile name for audio input        |
| audio_output   | string or null | Profile name for audio output       |

**You need to supply at least one key in the payload.**

</ApiEndpoint>

<ApiEndpoint path="/core/rebuild" method="post">
Rebuild the Home Assistant core container
</ApiEndpoint>

<ApiEndpoint path="/core/restart" method="post">
Restart the Home Assistant core container
</ApiEndpoint>

<ApiEndpoint path="/core/start" method="post">
Start the Home Assistant core container
</ApiEndpoint>

<ApiEndpoint path="/core/stats" method="get">

Returns a [Stats model](api/supervisor/models.md#stats) for the Home Assistant core.

**Example response:**

```json
{
  "cpu_percent": 14.0,
  "memory_usage": 288888,
  "memory_limit": 322222,
  "memory_percent": 32.4,
  "network_tx": 110,
  "network_rx": 902,
  "blk_read": 12,
  "blk_write": 27
}
```

</ApiEndpoint>

<ApiEndpoint path="/core/stop" method="post">
Stop the Home Assistant core container
</ApiEndpoint>

<ApiEndpoint path="/core/update" method="post">
Update Home Assistant core

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</ApiEndpoint>

<ApiEndpoint path="/core/websocket" method="get">
Proxy to Home Assistant Core websocket.
</ApiEndpoint>

### Discovery

<ApiEndpoint path="/discovery" method="get">
Return information about enabled discoveries.

**Returned data:**

| key       | type       | description                                                                     |
| --------- | ---------- | ------------------------------------------------------------------------------- |
| discovery | list       | A list of [Discovery models](api/supervisor/models.md#discovery)                                |
| services  | dictionary | A dictionary of services that contains a list of add-ons that have that service. |

**Example response:**

```json
{
  "discovery": [
    {
      "addon": "awesome_addon",
      "service": "awesome.service",
      "uuid": "fh874r-fj9o37yr3-fehsf7o3-fd798",
      "config": {}
    }
  ],
  "services": {
    "awesome": ["awesome_addon"]
  }
}
```

</ApiEndpoint>

<ApiEndpoint path="/discovery" method="post">
Create a discovery service

**Payload:**

| key     | type       | optional | description                      |
| ------- | ---------- | -------- | -------------------------------- |
| service | string     | False    | The name of the service          |
| config  | dictionary | False    | The configuration of the service |

**Example response:**

```json
{
  "uuid": "uuid"
}
```

</ApiEndpoint>

<ApiEndpoint path="/discovery/<uuid>" method="get">

Get a [discovery model](api/supervisor/models.md#discovery) for a UUID.

</ApiEndpoint>

<ApiEndpoint path="/discovery/<uuid>" method="delete">
Delete a specific service.
</ApiEndpoint>

### DNS

<ApiEndpoint path="/dns/info" method="get">
Return information about the DNS plugin.

**Returned data:**

| key              | type    | description                      |
| ---------------- | ------- | -------------------------------- |
| host             | string  | The IP address of the plugin     |
| version          | string  | The installed observer version   |
| version_latest   | string  | The latest published version     |
| update_available | boolean | `true` if an update is available |
| servers          | list    | A list of DNS servers            |
| locals           | list    | A list of DNS servers            |

**Example response:**

```json
{
  "host": "127.0.0.18",
  "version": "1",
  "version_latest": "2",
  "update_available": true,
  "servers": ["dns://8.8.8.8"],
  "locals": ["dns://127.0.0.18"]
}
```

</ApiEndpoint>

<ApiEndpoint path="/dns/logs" method="get">
Returns the raw container logs from docker.
</ApiEndpoint>

<ApiEndpoint path="/dns/options" method="post">
Set DNS options

**Payload:**

| key     | type | optional | description           |
| ------- | ---- | -------- | --------------------- |
| servers | list | True     | A list of DNS servers |

**You need to supply at least one key in the payload.**

</ApiEndpoint>

<ApiEndpoint path="/dns/reset" method="post">
Reset the DNS configuration.
</ApiEndpoint>

<ApiEndpoint path="/dns/restart" method="post">
Restart the DNS plugin
</ApiEndpoint>

<ApiEndpoint path="/dns/stats" method="get">

Returns a [Stats model](api/supervisor/models.md#stats) for the dns plugin.

**Example response:**

```json
{
  "cpu_percent": 14.0,
  "memory_usage": 288888,
  "memory_limit": 322222,
  "memory_percent": 32.4,
  "network_tx": 110,
  "network_rx": 902,
  "blk_read": 12,
  "blk_write": 27
}
```

</ApiEndpoint>

<ApiEndpoint path="/dns/update" method="post">
Update the DNS plugin

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</ApiEndpoint>

### Docker

<ApiEndpoint path="/docker/info" method="get">
Returns information about the docker instance.

**Returned data:**

key | type | description
-- | -- | --
version | string | The version of the docker engine
storage | string | The storage type
logging | string | The logging type
registries | dictionary | A dictionary of dictionaries containing `username` and `password` keys for registries.

**Example response:**

```json
{
  "version": "1.0.1",
  "storage": "overlay2",
  "logging": "journald",
  "registries": {}
}
```

</ApiEndpoint>

<ApiEndpoint path="/docker/registries" method="get">
Get all configured container registries, this returns a dict with the registry hostname as the key, and a dictionary containing the username configured for that registry.

**Example response:**

```json
{
  "registry.example.com": {
    "username": "AwesomeUser"
  }
}
```

</ApiEndpoint>

<ApiEndpoint path="/docker/registries" method="post">
Add a new container registry.

**Payload:**

| key      | type       | description                                                              |
| -------- | ---------- | ------------------------------------------------------------------------ |
| hostname | dictionary | A dictionary containing `username` and `password` keys for the registry. |

**Example payload:**

```json
{
  "registry.example.com": {
    "username": "AwesomeUser",
    "password": "MySuperStrongPassword!"
  }
}
```

:::note

To login to the default container registry (Docker Hub), use `hub.docker.com` as the registry.

:::

</ApiEndpoint>

<ApiEndpoint path="/docker/registries/<registry>" method="delete">
Delete a registry from the configured container registries.
</ApiEndpoint>

### Hardware

<ApiEndpoint path="/hardware/info" method="get">
Get hardware information.

**Example response:**

```json
{
    "serial": ["/dev/xy"],
    "input": ["Input device name"],
    "disk": ["/dev/sdax"],
    "gpio": ["gpiochip0", "gpiochip100"],
    "audio": {
        "CARD_ID": {
            "name": "xy",
            "type": "microphone",
            "devices": [
                "chan_id": "channel ID",
                "chan_type": "type of device"
            ]
        }
    }
}
```

</ApiEndpoint>

<ApiEndpoint path="/hardware/audio" method="get">
Get audio devices

**Example response:**

```json
{
  "audio": {
    "input": {
      "0,0": "Mic"
    },
    "output": {
      "1,0": "Jack",
      "1,1": "HDMI"
    }
  }
}
```

</ApiEndpoint>

<ApiEndpoint path="/hardware/trigger" method="post">
Trigger UDEV reload.
</ApiEndpoint>

### Host

<ApiEndpoint path="/host/info" method="get">
Return information about the host.

**Returned data**

| key              | type           | description                               |
| ---------------- | -------------- | ----------------------------------------- |
| chassis          | string or null | The chassis type                          |
| cpe              | string or null | The local CPE                             |
| deployment       | string or null | The deployment stage of the OS if any     |
| disk_total       | float          | Total space of the disk in MB             |
| disk_used        | float          | Used space of the disk in MB              |
| disk_free        | float          | Free space of the disk in MB              |
| features         | list           | A list of features available for the host |
| hostname         | string or null | The hostname of the host                  |
| kernel           | string or null | The kernel version on the host            |
| operating_system | string         | The operating system on the host          |

**Example response:**

```json
{
  "chassis": "specific",
  "cpe": "xy",
  "deployment": "stable",
  "disk_total": 32.0,
  "disk_used": 30.0,
  "disk_free": 2.0,
  "features": ["shutdown", "reboot", "hostname", "services", "hassos"],
  "hostname": "Awesome host",
  "kernel": "4.15.7",
  "operating_system": "Home Assistant OS"
}
```

</ApiEndpoint>

<ApiEndpoint path="/host/logs" method="get">
Get the dmesg logs from the host.
</ApiEndpoint>

<ApiEndpoint path="/host/options" method="post">
Set host options

**Payload:**

| key      | type   | optional | description                                    |
| -------- | ------ | -------- | ---------------------------------------------- |
| hostname | string | True     | A string that will be used as the new hostname |

**You need to supply at least one key in the payload.**

</ApiEndpoint>

<ApiEndpoint path="/host/reboot" method="post">
Reboot the host
</ApiEndpoint>

<ApiEndpoint path="/host/reload" method="post">
Reload host information
</ApiEndpoint>

<ApiEndpoint path="/host/service/<service>/start" method="post">
Start a service on the host.
</ApiEndpoint>

<ApiEndpoint path="/host/service/<service>/stop" method="post">
Stop a service on the host.
</ApiEndpoint>

<ApiEndpoint path="/host/service/<service>/reload" method="post">
Reload a service on the host.
</ApiEndpoint>

<ApiEndpoint path="/host/services" method="get">
Get information about host services.

**Returned data:**

| key      | description                                                  |
| -------- | ------------------------------------------------------------ |
| services | A dictionary of [Host service models](api/supervisor/models.md#host-service) |

**Example response:**

```json
{
  "services": [
    {
      "name": "awesome.service",
      "description": "Just an awesome service",
      "state": "active"
    }
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/host/shutdown" method="post">
Shutdown the host
</ApiEndpoint>

### ingress

<ApiEndpoint path="/ingress/panels" method="get">

**Returned data:**

| key    | type       | description                                  |
| ------ | ---------- | -------------------------------------------- |
| panels | dictionary | dictionary of [Panel models](api/supervisor/models.md#panel) |

**Example response:**

```json
{
  "panels": {
    "addon_slug": {
      "enable": true,
      "icon": "mdi:awesome-icon",
      "title": "Awesome add-on",
      "admin": true
    }
  }
}
```

</ApiEndpoint>

<ApiEndpoint path="/ingress/session" method="post">
Create a new session for access to the ingress service.

**Payload:**

| key     | type   | optional | description                       |
| ------- | ------ | -------- | --------------------------------- |
| session | string | False    | The token for the ingress session |

</ApiEndpoint>

### Misc

<ApiEndpoint path="/info" method="get">
Returns a dict with selected keys from other `/*/info` endpoints.

**Returned data:**

| key              | type           | description                                                  |
| ---------------- | -------------- | ------------------------------------------------------------ |
| supervisor       | string         | The installed version of the supervisor                      |
| homeassistant    | string         | The installed version of Home Assistant                      |
| hassos           | string or null | The version of Home Assistant OS or null                     |
| docker           | string         | The docker version on the host                               |
| hostname         | string         | The hostname on the host                                     |
| operating_system | string         | The operating system on the host                             |
| features         | list           | A list ov available features on the host                     |
| machine          | string         | The machine type                                             |
| arch             | string         | The architecture on the host                                 |
| supported_arch   | list           | A list of supported host architectures                       |
| supported        | boolean        | `true` if the environment is supported                       |
| channel          | string         | The active channel (stable, beta, dev)                       |
| logging          | string         | The active log level (debug, info, warning, error, critical) |
| timezone         | string         | The current timezone                                         |

**Example response:**

```json
{
  "supervisor": "300",
  "homeassistant": "0.117.0",
  "hassos": "5.0",
  "docker": "24.17.2",
  "hostname": "Awesome Hostname",
  "operating_system": "Home Assistant OS",
  "features": ["shutdown", "reboot", "hostname", "services", "hassos"],
  "machine": "ova",
  "arch": "amd64",
  "supported_arch": ["amd64"],
  "supported": true,
  "channel": "stable",
  "logging": "info",
  "timezone": "Europe/Tomorrowland"
}
```

</ApiEndpoint>

### Multicast

<ApiEndpoint path="/multicast/info" method="get">
Returns information about the multicast plugin

**Returned data:**

| key              | type       | description                       |
| ---------------- | ---------- | --------------------------------- |
| version          | string     | The installed multicast version   |
| version_latest   | string     | The latest published version      |
| update_available | boolean    | `true` if an update is available  |

**Example response:**

```json
{
  "version": "1",
  "version_latest": "2",
  "update_available": true
}
```

</ApiEndpoint>

<ApiEndpoint path="/multicast/logs" method="get">
Returns the raw container logs from docker.
</ApiEndpoint>

<ApiEndpoint path="/multicast/restart" method="post">
Restart the multicast plugin.
</ApiEndpoint>

<ApiEndpoint path="/multicast/stats" method="get">

Returns a [Stats model](api/supervisor/models.md#stats) for the multicast plugin.

**Example response:**

```json
{
  "cpu_percent": 14.0,
  "memory_usage": 288888,
  "memory_limit": 322222,
  "memory_percent": 32.4,
  "network_tx": 110,
  "network_rx": 902,
  "blk_read": 12,
  "blk_write": 27
}
```

</ApiEndpoint>

<ApiEndpoint path="/multicast/update" method="post">
Update the multicast plugin

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</ApiEndpoint>

### Network

<ApiEndpoint path="/network/info" method="get">
Get network information.

**Returned data:**

| key        | description                                                            |
| ---------- | ---------------------------------------------------------------------- |
| interfaces | A dictionary of [Network interface models](api/supervisor/models.md#network-interface) |
| docker     | Information about the internal docker network |

**Example response:**

```json
{
  "interfaces": {
    "eth0": {
      "interface": "eth0",
      "ip_address": "192.168.1.100/24",
      "gateway": "192.168.1.1",
      "id": "Wired connection 1",
      "type": "802-3-ethernet",
      "nameservers": ["192.168.1.1"],
      "method": "static",
      "primary": true
    }
  },
  "docker": {
    "interface": "hassio",
    "address": "172.30.32.0/23",
    "gateway": "172.30.32.1",
    "dns": "172.30.32.3"
  }
}
```

</ApiEndpoint>

<ApiEndpoint path="/network/<interface>/info" method="get">

Returns a [Network interface model](api/supervisor/models.md#network-interface) for a specific network interface.

</ApiEndpoint>

<ApiEndpoint path="/network/<interface>/update" method="post">

Update the settings for a network interface.

**Payload:**

| key     | type   | optional | description                                                            |
| ------- | ------ | -------- | ---------------------------------------------------------------------- |
| address | string | True     | The new IP address for the interface in the X.X.X.X/XX format          |
| dns     | list   | True     | List of DNS servers to use                                             |
| gateway | string | True     | The gateway the interface should use                                   |
| method  | string | True     | Set if the interface should use DHCP or not, can be `dhcp` or `static` |

**You need to supply at least one key in the payload.**

:::warning
If you change the `address` or `gateway` you may need to reconnect to the new address
:::

When the call is complete it returns the changed [Network interface model](api/supervisor/models.md#network-interface).

**Example response:**

```json
{
  "ip_address": "192.168.1.100/24",
  "gateway": "192.168.1.1",
  "id": "Wired connection 1",
  "type": "802-3-ethernet",
  "nameservers": ["192.168.1.1"],
  "method": "static",
  "primary": true
}
```

</ApiEndpoint>

### Observer

<ApiEndpoint path="/observer/info" method="get">

Returns information about the observer plugin

**Returned data:**

| key              | type       | description                      |
| ---------------- | ---------- | -------------------------------- |
| host             | string     | The IP address of the plugin     |
| version          | string     | The installed observer version   |
| version_latest   | string     | The latest published version     |
| update_available | boolean    | `true` if an update is available |

**Example response:**

```json
{
  "host": "172.0.0.17",
  "version": "1",
  "version_latest": "2",
  "update_available": true
}
```

</ApiEndpoint>

<ApiEndpoint path="/observer/stats" method="get">

Returns a [Stats model](api/supervisor/models.md#stats) for the observer plugin.

**Example response:**

```json
{
  "cpu_percent": 14.0,
  "memory_usage": 288888,
  "memory_limit": 322222,
  "memory_percent": 32.4,
  "network_tx": 110,
  "network_rx": 902,
  "blk_read": 12,
  "blk_write": 27
}
```

</ApiEndpoint>

<ApiEndpoint path="/observer/update" method="post">

Update the observer plugin

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</ApiEndpoint>

### OS

<ApiEndpoint path="/os/config/sync" method="post">

Load host configurations from an USB stick.

</ApiEndpoint>

<ApiEndpoint path="/os/info" method="get">

Returns information about the OS.

**Returned data:**

| key              | type    | description                                                  |
| ---------------- | ------- | ------------------------------------------------------------ |
| version          | string  | The current version of the OS                                |
| version_latest   | string  | The latest published version of the OS in the active channel |
| update_available | boolean | `true` if an update is available                             |
| board            | string  | The name of the board                                        |
| boot             | string  | Which slot that are in use                                   |

**Example response:**

```json
{
  "version": "4.3",
  "version_latest": "5.0",
  "board": "ova",
  "boot": "slot1"
}
```

</ApiEndpoint>

<ApiEndpoint path="/os/update" method="post">

Update Home Assistant OS

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</ApiEndpoint>

### Resolution

<ApiEndpoint path="/resolution/info" method="get">

**Returned data:**

| key      | type       | description                                      |
| -------- | ---------- | ------------------------------------------------ |
| unsupported | list | A list of reasons why a installation is marked as unsupported (container, dbus, docker_configuration, docker_version, lxc, network_manager, os, privileged, systemd) |
| issues | list | A list of [Issue models](api/supervisor/models.md#issues) |
| suggestions | list | A list of [Suggestion models](api/supervisor/models.md#suggestion) actions |

**Example response:**

```json
{
  "unsupported": ["os"],
  "issues": [
    {
      "uuid": "A89924620F9A11EBBDC3C403FC2CA371",
      "type": "free_space",
      "context": "system",
      "reference": null
     }
  ],
  "suggestions": [
    {
      "uuid": "B9923620C9A11EBBDC3C403FC2CA371",
      "type": "clear_snapshots",
      "context": "system",
      "reference": null
    }
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/resolution/suggestion/<uuid>" method="post">

Apply a suggested action

</ApiEndpoint>

<ApiEndpoint path="/resolution/suggestion/<uuid>" method="delete">

Dismiss a suggested action

</ApiEndpoint>

<ApiEndpoint path="/resolution/issue/<uuid>" method="delete">

Dismiss a issue

</ApiEndpoint>

### Service

<ApiEndpoint path="/services" method="get">

**Returned data:**

| key      | type       | description                                      |
| -------- | ---------- | ------------------------------------------------ |
| services | dictionary | dictionary of [Service models](api/supervisor/models.md#service) |

**Example response:**

```json
{
  "services": [
    {
      "slug": "name",
      "available": true,
      "providers": ["awesome_addon"]
    }
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/services/mqtt" method="get">

**Returned data:**

| key      | type    | description                             |
| -------- | ------- | --------------------------------------- |
| addon    | string  | The add-on slug                         |
| host     | string  | The IP of the addon running the service |
| port     | string  | The port the service is running on      |
| ssl      | boolean | `true` if SSL is in use                 |
| username | string  | The username for the service            |
| password | string  | The password for the service            |
| protocol | string  | The MQTT protocol                       |

**Example response:**

```json
{
  "addon": "awesome_mqtt",
  "host": "172.0.0.17",
  "port": "8883",
  "ssl": true,
  "username": "awesome_user",
  "password": "strong_password",
  "protocol": "3.1.1"
}
```

</ApiEndpoint>

<ApiEndpoint path="/services/mqtt" method="post">

Create a service definition

**Payload:**

| key      | type    | description                             |
| -------- | ------- | --------------------------------------- |
| host     | string  | The IP of the addon running the service |
| port     | string  | The port the service is running on      |
| ssl      | boolean | `true` if SSL is in use                 |
| username | string  | The username for the service            |
| password | string  | The password for the service            |
| protocol | string  | The MQTT protocol                       |

</ApiEndpoint>

<ApiEndpoint path="/services/mqtt" method="delete">

Deletes the service definitions

</ApiEndpoint>

<ApiEndpoint path="/services/mysql" method="get">

**Returned data:**

| key      | type    | description                             |
| -------- | ------- | --------------------------------------- |
| addon    | string  | The add-on slug                         |
| host     | string  | The IP of the addon running the service |
| port     | string  | The port the service is running on      |
| ssl      | boolean | `true` if SSL is in use                 |
| username | string  | The username for the service            |
| password | string  | The password for the service            |
| protocol | string  | The MQTT protocol                       |

**Example response:**

```json
{
  "addon": "awesome_mysql",
  "host": "172.0.0.17",
  "port": "8883",
  "username": "awesome_user",
  "password": "strong_password"
}
```

</ApiEndpoint>

<ApiEndpoint path="/services/mysql" method="post">

Create a service definition

**Payload:**

| key      | type   | description                             |
| -------- | ------ | --------------------------------------- |
| host     | string | The IP of the addon running the service |
| port     | string | The port the service is running on      |
| username | string | The username for the service            |
| password | string | The password for the service            |

</ApiEndpoint>

<ApiEndpoint path="/services/mysql" method="delete">

Deletes the service definitions

</ApiEndpoint>

### Snapshot

<ApiEndpoint path="/snapshots" method="get">

Return a list of [Snapshot models](api/supervisor/models.md#snapshot)

**Example response:**

```json
{
  "snapshots": [
    {
      "slug": "skuwe823",
      "date": "2020-09-30T20:25:34.273Z",
      "name": "Awesome snapshot",
      "type": "full",
      "protected": true
    }
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/snapshots/new/full" method="post">

Create a full snapshot.

**Payload:**

| key      | type   | optional | description                                |
| -------- | ------ | -------- | ------------------------------------------ |
| name     | string | True     | The name you want to give the snapshot     |
| password | string | True     | The password you want to give the snapshot |

**Example response:**

```json
{
  "slug": "skuwe823"
}
```

</ApiEndpoint>

<ApiEndpoint path="/snapshots/new/upload" method="post">

Upload a snapshot.

**Example response:**

```json
{
  "slug": "skuwe823"
}
```

</ApiEndpoint>

<ApiEndpoint path="/snapshots/new/partial" method="post">

Create a partial snapshot.

**Payload:**

| key      | type   | optional | description                                 |
| -------- | ------ | -------- | ------------------------------------------- |
| name     | string | True     | The name you want to give the snapshot      |
| password | string | True     | The password you want to give the snapshot  |
| addons   | list   | True     | A list of strings representing add-on slugs |
| folders  | list   | True     | A list of strings representing directories  |

**You need to supply at least one key in the payload.**

**Example response:**

```json
{
  "slug": "skuwe823"
}
```

</ApiEndpoint>

<ApiEndpoint path="/snapshots/reload" method="post">

Reload snapshots from storage.

</ApiEndpoint>

<ApiEndpoint path="/snapshots/<snapshot>/download" method="get">

Download the snapshot file with the given slug.

</ApiEndpoint>

<ApiEndpoint path="/snapshots/<snapshot>/info" method="get">

Returns a [Snapshot details model](api/supervisor/models.md#snapshot-details) for the add-on.

</ApiEndpoint>

<ApiEndpoint path="/snapshots/<snapshot>" method="delete">

Removes the snapshot file with the given slug.

</ApiEndpoint>

<ApiEndpoint path="/snapshots/<snapshot>/restore/full" method="post">

Does a full restore of the snapshot with the given slug.

**Payload:**

| key      | type   | optional | description                          |
| -------- | ------ | -------- | ------------------------------------ |
| password | string | True     | The password for the snapshot if any |

</ApiEndpoint>

<ApiEndpoint path="/snapshots/<snapshot>/restore/partial" method="post">

Does a partial restore of the snapshot with the given slug.

**Payload:**

| key           | type    | optional | description                                    |
| ------------- | ------- | -------- | ---------------------------------------------- |
| homeassistant | boolean | True     | `true` if Home Assistant should be restored    |
| addons        | list    | True     | A list of add-on slugs that should be restored |
| folders       | list    | True     | A list of directories that should be restored  |
| password      | string  | True     | The password for the snapshot if any           |

**You need to supply at least one key in the payload.**

</ApiEndpoint>

### Supervisor

<ApiEndpoint path="/supervisor/info" method="get">

Returns information about the supervisor

**Returned data:**

| key                 | type         | description                                                   |
| ------------------- | ------------ | ------------------------------------------------------------- |
| version             | string       | The installed supervisor version                              |
| version_latest      | string       | The latest published version in the active channel            |
| update_available    | boolean      | `true` if an update is available                              |
| arch                | string       | The architecture of the host (armhf, aarch64, i386, amd64)    |
| channel             | string       | The active channel (stable, beta, dev)                        |
| timezone            | string       | The current timezone                                          |
| healthy             | bool         | The supervisor is in a healthy state                          |
| supported           | bool         | The environment is supported                                  |
| logging             | string       | The current log level (debug, info, warning, error, critical) |
| ip_address          | string       | The internal docker IP address to the supervisor              |
| wait_boot           | int          | Max time to wait during boot                                  |
| debug               | bool         | Debug is active                                               |
| debug_block         | bool         | `true` if debug block is enabled                              |
| diagnostics         | bool or null | Sending diagnostics is enabled                                |
| addons              | list         | A list of installed [Addon models](api/supervisor/models.md#addon)            |
| addons_repositories | list         | A list of add-on repository URL's as strings                  |

**Example response:**

```json
{
  "version": "246",
  "version_latest": "version_latest",
  "update_available": true,
  "arch": "amd64",
  "channel": "dev",
  "timezone": "TIMEZONE",
  "healthy": true,
  "supported": false,
  "logging": "debug",
  "ip_address": "172.0.0.2",
  "wait_boot": 800,
  "debug": false,
  "debug_block": false,
  "diagnostics": null,
  "addons": [
    {
      "name": "Awesome add-on",
      "slug": "7kshd7_awesome",
      "description": "Awesome description",
      "repository": "https://example.com/addons",
      "version": "1.0.0",
      "installed": "1.0.0",
      "icon": false,
      "logo": true,
      "state": "started"
    }
  ],
  "addons_repositories": ["https://example.com/addons"]
}
```

</ApiEndpoint>

<ApiEndpoint path="/supervisor/logs" method="get">

Returns the raw container logs from docker.

</ApiEndpoint>

<ApiEndpoint path="/supervisor/options" method="post">

Update options for the supervisor, you need to supply at least one of the payload keys to the API call.
You need to call `/supervisor/reload` after updating the options.

**Payload:**

| key                 | type   | description                                            |
| ------------------- | ------ | ------------------------------------------------------ |
| channel             | string | Set the active channel (stable, beta, dev)             |
| timezone            | string | Set the timezone                                       |
| wait_boot           | int    | Set the time to wait for boot                          |
| debug               | bool   | Enable debug                                           |
| debug_block         | bool   | Enable debug block                                     |
| logging             | string | Set logging level                                      |
| addons_repositories | list   | Set a list of URL's as strings for add-on repositories |

</ApiEndpoint>

<ApiEndpoint path="/supervisor/ping" method="get" unprotected>

Ping the supervisor to check if it can return a response.

</ApiEndpoint>

<ApiEndpoint path="/supervisor/reload" method="post">

Reload parts of the supervisor, this enable new options, and check for updates.

</ApiEndpoint>

<ApiEndpoint path="/supervisor/repair" method="post">

Repair docker overlay issues, and lost images.

</ApiEndpoint>

<ApiEndpoint path="/supervisor/stats" method="get">

Returns a [Stats model](api/supervisor/models.md#stats) for the supervisor.

**Example response:**

```json
{
  "cpu_percent": 14.0,
  "memory_usage": 288888,
  "memory_limit": 322222,
  "memory_percent": 32.4,
  "network_tx": 110,
  "network_rx": 902,
  "blk_read": 12,
  "blk_write": 27
}
```

</ApiEndpoint>

<ApiEndpoint path="/supervisor/update" method="post">

Update the supervisor

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</ApiEndpoint>

### Placeholders

Some of the endpoints uses placeholders indicated with `<...>` in the endpoint URL.

| placeholder | description                                                                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| addon       | The slug for the addon, to get the slug you can call `/addons`, to call endpoints for the add-on calling the endpoints you can use `self`as the slug. |
| application | The name of a application, call `/audio/info` to get the correct name                                                                                 |
| interface   | A valid interface name, example `eth0`, to get the interface name you can call `/network/info`. You can use `default` to get the primary interface |
| registry    | A registry hostname defined in the container registry configuration, to get the hostname you can call `/docker/registries`                            |
| service     | The service name for a service on the host.                                                                                                           |
| snapshot    | A valid snapshot slug, example `skuwe823`, to get the slug you can call `/snapshots`                                                                  |
| suggestion  | A valid suggestion, example `clear_full_snapshot`, to get the suggestion you can call `/resolution`                                         |
| uuid        | The UUID of a discovery service, to get the UUID you can call `/discovery`                                                                            |
