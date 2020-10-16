---
title: "Endpoints"
---

For API endpoints marked with :lock: you need use an authorization header with a `Bearer` token.

The token is available for add-ons and Home Assistant using the
`SUPERVISOR_TOKEN` environment variable.

To see more details about each endpoint, click on it to expand it.

### Addons

<details>
<summary className="endpoint get protected">/addons</summary>

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
      "version": "1.0.1",
      "installed": null,
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

</details>

<details>
<summary className="endpoint post protected">/addons/reload</summary>

Reloads the information stored about add-ons.

</details>

<details>
<summary className="endpoint get protected">/addons/[addon]/changelog</summary>

Get the changelog for a add.on.

</details>

<details>
<summary className="endpoint get protected">/addons/[addon]/documentation</summary>

Get the documentation for a add.on.

</details>

<details>
<summary className="endpoint get protected">/addons/[addon]/logs</summary>

Returns the raw container logs from docker.

</details>

<details>
<summary className="endpoint get protected">/addons/[addon]/icon</summary>

Get the add-on icon

</details>

<details>
<summary className="endpoint get protected">/addons/[addon]/info</summary>

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
  "url": null,
  "usb": ["/dev/usb1"],
  "version_latest": "1.0.2",
  "version": "1.0.0",
  "video": false,
  "watchdog": true,
  "webui": "http://[HOST]:1337/xy/zx"
}
```

</details>

<details>
<summary className="endpoint post protected">/addons/[addon]/install</summary>

Install a add-on

</details>

<details>
<summary className="endpoint get protected">/addons/[addon]/logo</summary>

Get the add-on logo

</details>

<details>
<summary className="endpoint post protected">/addons/[addon]/options</summary>

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

</details>

<details>
<summary className="endpoint post protected">/addons/[addon]/options/validate</summary>

Run a configuration validation against the current stored add-on configuration.

</details>

<details>
<summary className="endpoint post protected">/addons/[addon]/rebuild</summary>

Rebuild the add-on, only supported for local build add-ons.

</details>

<details>
<summary className="endpoint post protected">/addons/[addon]/restart</summary>

Restart a add-on

</details>

<details>
<summary className="endpoint post protected">/addons/[addon]/security</summary>

Set the protection mode on a add-on.

This function is not callable by itself and you can not use `self` as the slug here.

**Payload:**

| key       | type    | description                     |
| --------- | ------- | ------------------------------- |
| protected | boolean | `true` if protection mode is on |

</details>

<details>
<summary className="endpoint post protected">/addons/[addon]/start</summary>

Start a add-on

</details>

<details>
<summary className="endpoint get protected">/addons/[addon]/stats</summary>

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

</details>

<details>
<summary className="endpoint post protected">/addons/[addon]/stdin</summary>

Write data to add-on stdin.

The payload you want to pass into the addon you give the endpoint as the body of the request.

</details>

<details>
<summary className="endpoint post protected">/addons/[addon]/stop</summary>

Stop a add-on

</details>

<details>
<summary className="endpoint post protected">/addons/[addon]/uninstall</summary>

Uninstall a add-on

</details>

<details>
<summary className="endpoint post protected">/addons/[addon]/update</summary>

Update a add-on

</details>

### Audio

<details>
<summary className="endpoint post protected">/audio/default/input</summary>

Set a profile as the default input profile

**Payload:**

| key  | type   | optional | description             |
| ---- | ------ | -------- | ----------------------- |
| name | string | False    | The name of the profile |

</details>

<details>
<summary className="endpoint post protected">/audio/default/output</summary>

Set a profile as the default output profile

**Payload:**

| key  | type   | optional | description             |
| ---- | ------ | -------- | ----------------------- |
| name | string | False    | The name of the profile |

</details>

<details>
<summary className="endpoint get protected">/audio/info</summary>

Return information about the audio plugin.

**Returned data:**

| key            | type       | description                     |
| -------------- | ---------- | ------------------------------- |
| host           | string     | The IP address of the plugin    |
| version        | string     | The installed observer version  |
| version_latest | string     | The latest published version    |
| audio          | dictionary | A [Audio model](api/supervisor/models.md#audio) |

**Example response:**

```json
{
  "host": "172.0.0.19",
  "version": "1",
  "latest_version": "2",
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

</details>

<details>
<summary className="endpoint get protected">/audio/logs</summary>

Returns the raw container logs from docker.

</details>

<details>
<summary className="endpoint post protected">/audio/mute/input</summary>

Mute input devices

**Payload:**

| key    | type    | optional | description             |
| ------ | ------- | -------- | ----------------------- |
| index  | string  | False    | The index of the device |
| active | boolean | False    | `true` if muted         |

</details>

<details>
<summary className="endpoint post protected">/audio/mute/input/[application]</summary>

Mute input for a specific application

**Payload:**

| key    | type    | optional | description             |
| ------ | ------- | -------- | ----------------------- |
| index  | string  | False    | The index of the device |
| active | boolean | False    | `true` if muted         |

</details>

<details>
<summary className="endpoint post protected">/audio/mute/output</summary>

Mute output devices

**Payload:**

| key    | type    | optional | description             |
| ------ | ------- | -------- | ----------------------- |
| index  | string  | False    | The index of the device |
| active | boolean | False    | `true` if muted         |

</details>

<details>
<summary className="endpoint post protected">/audio/mute/output/[application]</summary>

Mute output for a specific application

**Payload:**

| key    | type    | optional | description             |
| ------ | ------- | -------- | ----------------------- |
| index  | string  | False    | The index of the device |
| active | boolean | False    | `true` if muted         |

</details>

<details>
<summary className="endpoint post protected">/audio/profile</summary>

Create a audio profile

**Payload:**

| key  | type   | optional | description                  |
| ---- | ------ | -------- | ---------------------------- |
| card | string | False    | The name of the audio device |
| name | string | False    | The name of the profile      |

</details>

<details>
<summary className="endpoint post protected">/audio/reload</summary>

Reload audio information

</details>

<details>
<summary className="endpoint post protected">/audio/restart</summary>

Restart the audio plugin

</details>

<details>
<summary className="endpoint get protected">/audio/stats</summary>

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

</details>

<details>
<summary className="endpoint post protected">/audio/update</summary>

Update the audio plugin

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</details>

<details>
<summary className="endpoint post protected">/audio/volume/input</summary>

Set the input volume

**Payload:**

| key    | type   | optional | description                         |
| ------ | ------ | -------- | ----------------------------------- |
| index  | string | False    | The index of the device             |
| volume | float  | False    | The volume (between `0.0`and `1.0`) |

</details>

<details>
<summary className="endpoint post protected">/audio/volume/input/[application]</summary>

Set the input volume for a specific application

**Payload:**

| key    | type   | optional | description                         |
| ------ | ------ | -------- | ----------------------------------- |
| index  | string | False    | The index of the device             |
| volume | float  | False    | The volume (between `0.0`and `1.0`) |

</details>

<details>
<summary className="endpoint post protected">/audio/volume/output</summary>

Set the output volume

**Payload:**

| key    | type   | optional | description                         |
| ------ | ------ | -------- | ----------------------------------- |
| index  | string | False    | The index of the device             |
| volume | float  | False    | The volume (between `0.0`and `1.0`) |

</details>

<details>
<summary className="endpoint post protected">/audio/volume/output/[application]</summary>

Set the output volume for a specific application

**Payload:**

| key    | type   | optional | description                         |
| ------ | ------ | -------- | ----------------------------------- |
| index  | string | False    | The index of the device             |
| volume | float  | False    | The volume (between `0.0`and `1.0`) |

</details>

### Auth

<details>
<summary className="endpoint post protected">/auth</summary>

You can do authentication against Home Assistant Core.
You can POST the data as JSON, as urlencoded (with `application/x-www-form-urlencoded` header) or by using use basic authentication.

**Payload:**

| key      | type   | description               |
| -------- | ------ | ------------------------- |
| username | string | The username for the user |
| password | string | The password for the user |

</details>

<details>
<summary className="endpoint post protected">/auth/reset</summary>

Set a new password for a Home Assistant Core user.

**Payload:**

| key      | type   | description                   |
| -------- | ------ | ----------------------------- |
| username | string | The username for the user     |
| password | string | The new password for the user |

</details>

### CLI

<details>
<summary className="endpoint get protected">/cli/info</summary>

Returns information about the CLI plugin

**Returned data:**

| key            | type   | description                  |
| -------------- | ------ | ---------------------------- |
| version        | string | The installed CLI version    |
| version_latest | string | The latest published version |

**Example response:**

```json
{
  "version": "1",
  "version_latest": "2"
}
```

</details>

<details>
<summary className="endpoint get protected">/cli/stats</summary>

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

</details>

<details>
<summary className="endpoint post protected">/cli/update</summary>

Update the CLI plugin

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</details>

### Core

<details>
<summary className="endpoint get protected">/core/api</summary>

Proxy GET API calls to the Home Assistant API

</details>

<details>
<summary className="endpoint post protected">/core/api</summary>

Proxy POST API calls to the Home Assistant API

</details>

<details>
<summary className="endpoint post protected">/core/check</summary>

Run a configuration check

</details>

<details>
<summary className="endpoint get protected">/core/info</summary>

Returns information about the Home Assistant core

**Returned data:**

| key            | type           | description                                                |
| -------------- | -------------- | ---------------------------------------------------------- |
| version        | string         | The installed core version                                 |
| version_latest | string         | The latest published version in the active channel         |
| arch           | string         | The architecture of the host (armhf, aarch64, i386, amd64) |
| machine        | string         | The machine type that is running the host                  |
| ip_address     | string         | The internal docker IP address to the supervisor           |
| image          | string         | The container image that is running the core               |
| boot           | boolean        | `true` if it should start on boot                          |
| port           | int            | The port Home Assistant is running on                      |
| ssl            | boolean        | `true` if Home Assistant is using SSL                      |
| watchdog       | boolean        | `true` if watchdog is enabled                              |
| wait_boot      | int            | Max time to wait during boot                               |
| audio_input    | string or null | The description of the audio input device                  |
| audio_output   | string or null | The description of the audio output device                 |

**Example response:**

```json
{
  "version": "0.117.0",
  "version_latest": "0.117.0",
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

</details>

<details>
<summary className="endpoint get protected">/core/logs</summary>

Returns the raw container logs from docker.

</details>

<details>
<summary className="endpoint post protected">/core/options</summary>

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

</details>

<details>
<summary className="endpoint post protected">/core/rebuild</summary>

Rebuild the Home Assistant core container

</details>

<details>
<summary className="endpoint post protected">/core/restart</summary>

Restart the Home Assistant core container

</details>

<details>
<summary className="endpoint post protected">/core/start</summary>

Start the Home Assistant core container

</details>

<details>
<summary className="endpoint get protected">/core/stats</summary>

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

</details>

<details>
<summary className="endpoint post protected">/core/stop</summary>

Stop the Home Assistant core container

</details>

<details>
<summary className="endpoint post protected">/core/update</summary>

Update Home Assistant core

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</details>

<details>
<summary className="endpoint get protected">/core/websocket</summary>

Proxy to Home Assistant Core websocket.

</details>

### Discovery

<details>
<summary className="endpoint get protected">/discovery</summary>

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

</details>

<details>
<summary className="endpoint post protected">/discovery</summary>

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

</details>

<details>
<summary className="endpoint get protected">/discovery/[uuid]</summary>

Get a [discovery model](api/supervisor/models.md#discovery) for a UUID.

</details>

<details>
<summary className="endpoint delete protected">/discovery/[uuid]</summary>

Delete a specific service.

</details>

### DNS

<details>
<summary className="endpoint get protected">/dns/info</summary>

Return information about the DNS plugin.

**Returned data:**

| key            | type   | description                    |
| -------------- | ------ | ------------------------------ |
| host           | string | The IP address of the plugin   |
| version        | string | The installed observer version |
| version_latest | string | The latest published version   |
| servers        | list   | A list of DNS servers          |
| locals         | list   | A list of DNS servers          |

**Example response:**

```json
{
  "host": "127.0.0.18",
  "version": "1",
  "version_latest": "2",
  "servers": ["dns://8.8.8.8"],
  "locals": ["dns://127.0.0.18"]
}
```

</details>

<details>
<summary className="endpoint get protected">/dns/logs</summary>

Returns the raw container logs from docker.

</details>

<details>
<summary className="endpoint post protected">/dns/options</summary>

Set DNS options

**Payload:**

| key     | type | optional | description           |
| ------- | ---- | -------- | --------------------- |
| servers | list | True     | A list of DNS servers |

**You need to supply at least one key in the payload.**

</details>

<details>
<summary className="endpoint post protected">/dns/reset</summary>

Reset the DNS configuration.

</details>

<details>
<summary className="endpoint post protected">/dns/restart</summary>

Restart the DNS plugin

</details>

<details>
<summary className="endpoint get protected">/dns/stats</summary>

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

</details>

<details>
<summary className="endpoint post protected">/dns/update</summary>

Update the DNS plugin

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</details>

### Docker

<details>
<summary className="endpoint get protected">/docker/info</summary>

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

</details>

<details>
<summary className="endpoint get protected">/docker/registries</summary>

Get all configured container registries, this returns a dict with the registry hostname as the key, and a dictionary containing the username configured for that registry.

**Example response:**

```json
{
  "registry.example.com": {
    "username": "AwesomeUser"
  }
}
```

</details>

<details>
<summary className="endpoint post protected">/docker/registries</summary>

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

</details>

<details>
<summary className="endpoint delete protected">/docker/registries/[registry]</summary>

Delete a registry from the configured container registries.

</details>

### Hardware

<details>
<summary className="endpoint get protected">/hardware/info</summary>

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

</details>

<details>
<summary className="endpoint get protected">/hardware/audio</summary>

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

</details>

<details>
<summary className="endpoint post protected">/hardware/trigger</summary>

Trigger UDEV reload.

</details>

### Host

<details>
<summary className="endpoint get protected">/host/info</summary>

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

</details>

<details>
<summary className="endpoint get protected">/host/logs</summary>

Get the dmesg logs from the host.

</details>

<details>
<summary className="endpoint post protected">/host/options</summary>

Set host options

**Payload:**

| key      | type   | optional | description                                    |
| -------- | ------ | -------- | ---------------------------------------------- |
| hostname | string | True     | A string that will be used as the new hostname |

**You need to supply at least one key in the payload.**

</details>

<details>
<summary className="endpoint post protected">/host/reboot</summary>

Reboot the host

</details>

<details>
<summary className="endpoint post protected">/host/reload</summary>

Reload host information

</details>

<details>
<summary className="endpoint post protected">/host/service/[service]/start</summary>

Start a service on the host.

</details>

<details>
<summary className="endpoint post protected">/host/service/[service]/stop</summary>

Stop a service on the host.

</details>

<details>
<summary className="endpoint post protected">/host/service/[service]/reload</summary>

Reload a service on the host.

</details>

<details>
<summary className="endpoint get protected">/host/services</summary>

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

</details>

<details>
<summary className="endpoint post protected">/host/shutdown</summary>

Shutdown the host

</details>

### ingress

<details>
<summary className="endpoint get protected">/ingress/panels</summary>

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

</details>

<details>
<summary className="endpoint post protected">/ingress/session</summary>

Create a new session for access to the ingress service.

**Payload:**

| key     | type   | optional | description                       |
| ------- | ------ | -------- | --------------------------------- |
| session | string | False    | The token for the ingress session |

</details>

### Misc

<details>
<summary className="endpoint get protected">/info</summary>

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

</details>

### Multicast

<details>
<summary className="endpoint get protected">/multicast/info</summary>

Returns information about the multicast plugin

**Returned data:**

| key            | type   | description                    |
| -------------- | ------ | ------------------------------ |
| version        | string | The installed observer version |
| version_latest | string | The latest published version   |

**Example response:**

```json
{
  "version": "1",
  "version_latest": "2"
}
```

</details>

<details>
<summary className="endpoint get protected">/multicast/logs</summary>

Returns the raw container logs from docker.

</details>

<details>
<summary className="endpoint post protected">/multicast/restart</summary>

Restart the multicast plugin.

</details>

<details>
<summary className="endpoint get protected">/multicast/stats</summary>

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

</details>

<details>
<summary className="endpoint post protected">/multicast/update</summary>

Update the multicast plugin

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</details>

### Network

<details>
<summary className="endpoint get protected">/network/info</summary>

Get network information.

**Returned data:**

| key        | description                                                            |
| ---------- | ---------------------------------------------------------------------- |
| interfaces | A dictionary of [Network interface models](api/supervisor/models.md#network-interface) |

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
  }
}
```

</details>

<details>
<summary className="endpoint get protected">/network/[interface]/info</summary>

Returns a [Network interface model](api/supervisor/models.md#network-interface) for a specific network interface.

</details>

<details>
<summary className="endpoint post protected">/network/[interface]/update</summary>

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

</details>

### Observer

<details>
<summary className="endpoint get protected">/observer/info</summary>

Returns information about the observer plugin

**Returned data:**

| key            | type   | description                               |
| -------------- | ------ | ----------------------------------------- |
| host           | string | The IP address the observer is running on |
| version        | string | The installed observer version            |
| version_latest | string | The latest published version              |

**Example response:**

```json
{
  "host": "172.0.0.17",
  "version": "1",
  "version_latest": "2"
}
```

</details>

<details>
<summary className="endpoint get protected">/observer/stats</summary>

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

</details>

<details>
<summary className="endpoint post protected">/observer/update</summary>

Update the observer plugin

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</details>

### OS

<details>
<summary className="endpoint post protected">/os/config/sync</summary>

Load host configurations from an USB stick.

</details>

<details>
<summary className="endpoint get protected">/os/info</summary>

Returns information about the OS.

**Returned data:**

| key            | type   | description                                                  |
| -------------- | ------ | ------------------------------------------------------------ |
| version        | string | The current version of the OS                                |
| version_latest | string | The latest published version of the OS in the active channel |
| board          | string | The name of the board                                        |
| boot           | string | Which slot that are in use                                   |

**Example response:**

```json
{
  "version": "4.3",
  "version_latest": "5.0",
  "board": "ova",
  "boot": "slot1"
}
```

</details>

<details>
<summary className="endpoint post protected">/os/update</summary>

Update Home Assistant OS

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</details>

### Resolution

<details>
<summary className="endpoint get protected">/resolution</summary>

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

</details>

<details>
<summary className="endpoint post protected">/resolution/suggestion/[uuid]</summary>

Apply a suggested action

</details>

<details>
<summary className="endpoint delete protected">/resolution/suggestion/[suggestion]</summary>

Dismiss a suggested action

</details>

<details>
<summary className="endpoint delete protected">/resolution/issue/[uuid]</summary>

Dismiss a issue

</details>

### Service

<details>
<summary className="endpoint get protected">/services</summary>

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

</details>

<details>
<summary className="endpoint get protected">/services/mqtt</summary>

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

</details>

<details>
<summary className="endpoint post protected">/services/mqtt</summary>

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

</details>

<details>
<summary className="endpoint delete protected">/services/mqtt</summary>

Deletes the service definitions

</details>

<details>
<summary className="endpoint get protected">/services/mysql</summary>

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

</details>

<details>
<summary className="endpoint post protected">/services/mysql</summary>

Create a service definition

**Payload:**

| key      | type   | description                             |
| -------- | ------ | --------------------------------------- |
| host     | string | The IP of the addon running the service |
| port     | string | The port the service is running on      |
| username | string | The username for the service            |
| password | string | The password for the service            |

</details>

<details>
<summary className="endpoint delete protected">/services/mysql</summary>

Deletes the service definitions

</details>

### Snapshot

<details>
<summary className="endpoint get protected">/snapshots</summary>

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

</details>

<details>
<summary className="endpoint post protected">/snapshots/new/full</summary>

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

</details>

<details>
<summary className="endpoint post protected">/snapshots/new/upload</summary>

Upload a snapshot.

**Example response:**

```json
{
  "slug": "skuwe823"
}
```

</details>

<details>
<summary className="endpoint post protected">/snapshots/new/partial</summary>

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

</details>

<details>
<summary className="endpoint post protected">/snapshots/reload</summary>

Reload snapshots from storage.

</details>

<details>
<summary className="endpoint get protected">/snapshots/[snapshot]/download</summary>

Download the snapshot file with the given slug.

</details>

<details>
<summary className="endpoint get protected">/snapshots/[snapshot]/info</summary>

Returns a [Snapshot details model](api/supervisor/models.md#snapshot-details) for the add-on.

</details>

<details>
<summary className="endpoint delete protected">/snapshots/[snapshot]</summary>

Removes the snapshot file with the given slug.

</details>

<details>
<summary className="endpoint post protected">/snapshots/[snapshot]/restore/full</summary>

Does a full restore of the snapshot with the given slug.

**Payload:**

| key      | type   | optional | description                          |
| -------- | ------ | -------- | ------------------------------------ |
| password | string | True     | The password for the snapshot if any |

</details>

<details>
<summary className="endpoint post protected">/snapshots/[snapshot]/restore/partial</summary>

Does a partial restore of the snapshot with the given slug.

**Payload:**

| key           | type    | optional | description                                    |
| ------------- | ------- | -------- | ---------------------------------------------- |
| homeassistant | boolean | True     | `true` if Home Assistant should be restored    |
| addons        | list    | True     | A list of add-on slugs that should be restored |
| folders       | list    | True     | A list of directories that should be restored  |
| password      | string  | True     | The password for the snapshot if any           |

**You need to supply at least one key in the payload.**

</details>

### Supervisor

<details>
<summary className="endpoint get protected">/supervisor/info</summary>

Returns information about the supervisor

**Returned data:**

| key                 | type         | description                                                   |
| ------------------- | ------------ | ------------------------------------------------------------- |
| version             | string       | The installed supervisor version                              |
| version_latest      | string       | The latest published version in the active channel            |
| arch                | string       | The architecture of the host (armhf, aarch64, i386, amd64)    |
| channel             | string       | The active channel (stable, beta, dev)                        |
| timezone            | string       | The current timezone                                          |
| healthy             | bool         | The supervisor is in a healthy state                          |
| supported           | bool         | The environment is supported                                  |
| logging             | string       | The current log level (debug, info, warning, error, critical) |
| ip_address          | string       | The internal docker IP address to the supervisor              |
| wait_boot           | int          | Max time to wait during boot                                  |
| debug               | bool         | Debug is active                                               |
| debug_block         | bool         | `true` if debug block is enabled                               |
| diagnostics         | bool or null | Sending diagnostics is enabled                                |
| addons              | list         | A list of installed [Addon models](api/supervisor/models.md#addon)            |
| addons_repositories | list         | A list of add-on repository URL's as strings                  |

**Example response:**

```json
{
  "version": "246",
  "version_latest": "version_latest",
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

</details>

<details>
<summary className="endpoint get protected">/supervisor/logs</summary>

Returns the raw container logs from docker.

</details>

<details>
<summary className="endpoint post protected">/supervisor/options</summary>

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

</details>

<details>
<summary className="endpoint get">/supervisor/ping</summary>

Ping the supervisor to check if it can return a response.

</details>

<details>
<summary className="endpoint post protected">/supervisor/reload</summary>

Reload parts of the supervisor, this enable new options, and check for updates.

</details>

<details>
<summary className="endpoint post protected">/supervisor/repair</summary>

Repair docker overlay issues, and lost images.

</details>

<details>
<summary className="endpoint get protected">/supervisor/stats</summary>

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

</details>

<details>
<summary className="endpoint post protected">/supervisor/update</summary>

Update the supervisor

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| version | string | The version you want to install, default is the latest version |

</details>

### Placeholders

Some of the endpoints uses placeholders indicated with `[]` in the endpoint URL.

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
