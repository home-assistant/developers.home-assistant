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
Return overview information about installed add-ons.

**Payload:**

| key          | type | description                                        |
| ------------ | ---- | -------------------------------------------------- |
| addons       | list | A list of [Addon models](api/supervisor/models.md#addon)           |

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
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/addons/reload" method="post">
Reloads the information stored about add-ons.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/changelog" method="get">
Get the changelog for an add-on.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/documentation" method="get">
Get the documentation for an add-on.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/logs" method="get">
Returns the raw container logs from docker.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/icon" method="get">
Get the add-on icon
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/info" method="get">
Get details about an add-on

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
| host_uts            | boolean            | `true` if host UTS namespace access is enabled.                                        |
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
| translations        | dictionary         | A dictionary containing content of translation files for the add-on |
| udev                | boolean            | `true` if udev access is granted is enabled                                            |
| update_available    | boolean            | `true` if an update is available                                                       |
| url                 | string or null     | URL to more information about the add-on                                               |
| usb                 | list               | A list of attached USB devices                                                         |
| version             | string             | The installed version of the add-on                                                    |
| version_latest      | string             | The latest version of the add-on                                                       |
| video               | boolean            | `true` if video is enabled                                                             |
| watchdog            | boolean            | `true` if watchdog is enabled                                                          |
| webui               | string or null     | The URL to the web UI for the add-on                                                   |
| signed              | boolean            | True if the image is signed and trust                                                  |

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
  "host_uts": false,
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
  "translations": {
    "en": {
      "configuration": {
        "lorem": "ipsum"
      }
    }
  },
  "udev": false,
  "update_available": false,
  "url": null,
  "usb": ["/dev/usb1"],
  "version_latest": "1.0.2",
  "version": "1.0.0",
  "video": false,
  "watchdog": true,
  "webui": "http://[HOST]:1337/xy/zx",
  "signed": false
}
```

</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/install" method="post">
Install an add-on

**Deprecated!** Use [`/store/addons/<addon>/install`](#store) instead.

</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/logo" method="get">
Get the add-on logo
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/options" method="post">
Set the protection mode on an add-on.

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
| ingress_panel | boolean       | `true` if ingress_panel is enabled      |
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
Run a configuration validation against the current stored add-on configuration or payload.

**Payload:**

Optional the raw add-on options.

**Returned data:**

| key              | type        | description                      |
| ---------------- | ----------- | -------------------------------- |
| message          | string      | Include the error message        |
| valid            | boolean        | If config is valid or not        |
| pwned            | boolean | None | True or false if include pwned secrets. On error it's None |

</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/options/config" method="get">
The Data endpoint to get his own rendered configuration.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/rebuild" method="post">
Rebuild the add-on, only supported for local build add-ons.
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/restart" method="post">
Restart an add-on
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/security" method="post">
Set the protection mode on an add-on.

This function is not callable by itself and you can not use `self` as the slug here.

**Payload:**

| key       | type    | description                     |
| --------- | ------- | ------------------------------- |
| protected | boolean | `true` if protection mode is on |

</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/start" method="post">
Start an add-on
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
Stop an add-on
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/uninstall" method="post">
Uninstall an add-on
</ApiEndpoint>

<ApiEndpoint path="/addons/<addon>/update" method="post">
Update an add-on

**Deprecated!** Use [`/store/addons/<addon>/update`](#store) instead.

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
| audio            | dictionary | An [Audio model](api/supervisor/models.md#audio) |

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
Create an audio profile

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

<ApiEndpoint path="/auth" method="get">
You can do authentication against Home Assistant Core using Basic Authentication.
Use the `X-Supervisor-Token` header to provide the Supervisor authentication token.
See the corresponding POST method to provide JSON or urlencoded credentials.
</ApiEndpoint>

<ApiEndpoint path="/auth" method="post">
You can do authentication against Home Assistant Core.
You can POST the data as JSON, as urlencoded (with `application/x-www-form-urlencoded` header) or by using use basic authentication.
For using Basic authentication, you can use the `X-Supervisor-Token` for Supervisor authentication token.

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

### Backup

<ApiEndpoint path="/backups" method="get">

Return a list of [Backups](api/supervisor/models.md#backup)

**Example response:**

```json
{
  "backups": [
    {
      "slug": "skuwe823",
      "date": "2020-09-30T20:25:34.273Z",
      "name": "Awesome backup",
      "type": "partial",
      "size": 44,
      "protected": true,
      "compressed": true,
      "content": {
        "homeassistant": true,
        "addons": ["awesome_addon"],
        "folders": ["ssl", "media"]
      }
    }
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/backups/info" method="get">

Return information about backup manager.

**Returned data:**

| key              | type       | description                                          |
| ---------------- | ---------- | ---------------------------------------------------- |
| backups          | list       | A list of [Backups](api/supervisor/models.md#backup) |
| days_until_stale | int        | Number of days until a backup is considered stale    |

**Example response:**

```json
{
  "backups": [
    {
      "slug": "skuwe823",
      "date": "2020-09-30T20:25:34.273Z",
      "name": "Awesome backup",
      "type": "partial",
      "size": 44,
      "protected": true,
      "compressed": true,
      "content": {
        "homeassistant": true,
        "addons": ["awesome_addon"],
        "folders": ["ssl", "media"]
      }
    }
  ],
  "days_until_stale": 30
}
```

</ApiEndpoint>

<ApiEndpoint path="/backups/new/full" method="post">

Create a full backup.

**Payload:**

| key        | type    | optional | description                              |
| ---------- | ------- | -------- | -----------------------------------------|
| name       | string  | True     | The name you want to give the backup     |
| password   | string  | True     | The password you want to give the backup |
| compressed | boolean | True     | `false` to create uncompressed backups   |

**Example response:**

```json
{
  "slug": "skuwe823"
}
```

</ApiEndpoint>

<ApiEndpoint path="/backups/new/upload" method="post">

Upload a backup.

**Example response:**

```json
{
  "slug": "skuwe823"
}
```

</ApiEndpoint>

<ApiEndpoint path="/backups/new/partial" method="post">

Create a partial backup.

**Payload:**

| key        | type    | optional | description                                 |
| ---------- | ------- | -------- | ------------------------------------------- |
| name       | string  | True     | The name you want to give the backup        |
| password   | string  | True     | The password you want to give the backup    |
| homeassistant   | boolean    | True | Add home assistant core settings to the backup |
| addons     | list    | True     | A list of strings representing add-on slugs |
| folders    | list    | True     | A list of strings representing directories  |
| compressed | boolean | True     | `false` to create uncompressed backups      |

**You need to supply at least one key in the payload.**

**Example response:**

```json
{
  "slug": "skuwe823"
}
```

</ApiEndpoint>

<ApiEndpoint path="/backups/options" method="post">
Update options for backup manager, you need to supply at least one of the payload keys to the API call.

**Payload:**

| key              | type           | description                                           |
| ---------------- | -------------- | ----------------------------------------------------- |
| days_until_stale | int            | Set number of days until a backup is considered stale |

**You need to supply at least one key in the payload.**

</ApiEndpoint>

<ApiEndpoint path="/backups/reload" method="post">

Reload backup from storage.

</ApiEndpoint>

<ApiEndpoint path="/backups/<backup>/download" method="get">

Download the backup file with the given slug.

</ApiEndpoint>

<ApiEndpoint path="/backups/<backup>/info" method="get">

Returns a [Backup details model](api/supervisor/models.md#backup-details) for the add-on.

</ApiEndpoint>

<ApiEndpoint path="/backups/<backup>" method="delete">

Removes the backup file with the given slug.

</ApiEndpoint>

<ApiEndpoint path="/backups/<backup>/restore/full" method="post">

Does a full restore of the backup with the given slug.

**Payload:**

| key      | type   | optional | description                          |
| -------- | ------ | -------- | ------------------------------------ |
| password | string | True     | The password for the backup if any |

</ApiEndpoint>

<ApiEndpoint path="/backups/<backup>/restore/partial" method="post">

Does a partial restore of the backup with the given slug.

**Payload:**

| key           | type    | optional | description                                    |
| ------------- | ------- | -------- | ---------------------------------------------- |
| homeassistant | boolean | True     | `true` if Home Assistant should be restored    |
| addons        | list    | True     | A list of add-on slugs that should be restored |
| folders       | list    | True     | A list of directories that should be restored  |
| password      | string  | True     | The password for the backup if any           |

**You need to supply at least one key in the payload.**

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
Passing `image`, `refresh_token`, `audio_input` or `audio_output` with `null` resets the option.
:::

**Payload:**

| key            | type           | description                         |
| -------------- | -------------- | ----------------------------------- |
| boot           | boolean        | Start Core on boot                  |
| image          | string or null | Name of custom image                |
| port           | int            | The port that Home Assistant run on |
| ssl            | boolean        | `true` to enable SSL                |
| watchdog       | boolean        | `true` to enable the watchdog       |
| wait_boot      | int            | Time to wait for Core to startup    |
| refresh_token  | string or null | Token to authenticate with Core     |
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
| backup | boolean | Create a partial backup of core and core configuration before updating, default is false |

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
| fallback         | bool    | Try fallback DNS on failure      |
| host             | string  | The IP address of the plugin     |
| llmnr            | bool    | Can resolve LLMNR hostnames      |
| locals           | list    | A list of DNS servers            |
| mdns             | bool    | Can resolve MulticastDNS hostnames |
| servers          | list    | A list of DNS servers            |
| update_available | boolean | `true` if an update is available |
| version          | string  | The installed observer version   |
| version_latest   | string  | The latest published version     |

**Example response:**

```json
{
  "host": "127.0.0.18",
  "version": "1",
  "version_latest": "2",
  "update_available": true,
  "servers": ["dns://8.8.8.8"],
  "locals": ["dns://127.0.0.18"],
  "mdns": true,
  "llmnr": false,
  "fallback": true
}
```

</ApiEndpoint>

<ApiEndpoint path="/dns/logs" method="get">
Returns the raw container logs from docker.
</ApiEndpoint>

<ApiEndpoint path="/dns/options" method="post">
Set DNS options

**Payload:**

| key      | type | optional | description                 |
| -------  | ---- | -------- | --------------------------- |
| fallback | bool | True     | Enable/Disable fallback DNS |
| servers  | list | True     | A list of DNS servers       |

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
    "devices": [
      {
        "name": "ttyACM0",
        "sysfs": "/sys/devices/usb/00:01",
        "dev_path": "/dev/ttyACM0",
        "by_id": "/dev/serial/by-id/usb-Silicon_Labs-RFUSB_9017F723B061A7C01410CFCF-if00-port1",
        "subsystem": "tty",
        "parent": null,
        "attributes": {
          "MINOR": "5"
        },
        "children": [
          "/sys/devices/soc/platform/00ef"
        ]
      }
    ]
}
```

**Returned data:**

| key      | description                                                  |
| -------- | ------------------------------------------------------------ |
| devices  | A list of [Device models](api/supervisor/models.md#device)   |

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

### Host

<ApiEndpoint path="/host/info" method="get">
Return information about the host.

**Returned data**

| key              | type           | description                               |
| ---------------- | -------------- | ----------------------------------------- |
| agent_version    | string or null | Agent version running on the Host         |
| apparmor_version | string or null | The AppArmor version from host            |
| boot_timestamp   | int            | The timestamp for the last boot in microseconds |
| broadcast_llmnr  | bool or null   | Host is broadcasting its LLMNR hostname   |
| broadcast_mdns   | bool or null   | Host is broadcasting its MulticastDNS hostname |
| chassis          | string or null | The chassis type                          |
| cpe              | string or null | The local CPE                             |
| deployment       | string or null | The deployment stage of the OS if any     |
| disk_total       | float          | Total space of the disk in MB             |
| disk_used        | float          | Used space of the disk in MB              |
| disk_free        | float          | Free space of the disk in MB              |
| features         | list           | A list of features available for the host |
| hostname         | string or null | The hostname of the host                  |
| kernel           | string or null | The kernel version on the host            |
| llmnr_hostname   | string or null | The hostname currently exposed on the network via LLMNR for host |
| operating_system | string         | The operating system on the host          |
| startup_time     | float          | The time in seconds it took for last boot |

**Example response:**

```json
{
  "agent_version": "1.2.0",
  "apparmor_version": "2.13.2",
  "chassis": "specific",
  "cpe": "xy",
  "deployment": "stable",
  "disk_total": 32.0,
  "disk_used": 30.0,
  "disk_free": 2.0,
  "features": ["shutdown", "reboot", "hostname", "services", "haos"],
  "hostname": "Awesome host",
  "llmnr_hostname": "Awesome host",
  "kernel": "4.15.7",
  "operating_system": "Home Assistant OS",
  "boot_timestamp": 1234567788,
  "startup_time": 12.345,
  "broadcast_llmnr": true,
  "broadcast_mdns": false
}
```

</ApiEndpoint>

<ApiEndpoint path="/host/logs" method="get">

Get systemd Journal logs from the host. Returns log entries in plain text, one
log record per line.

**HTTP Request Headers**

| Header   | optional | description                                    |
| -------- | -------- | ---------------------------------------------- |
| Accept   | true     | Type of data (currently only text/plain)       |
| Range    | true     | Range of log entries. The format is `entries=cursor[[:num_skip]:num_entries]` |

:::tip
To get the last log entries the Range request header supports negative values
as `num_skip`. E.g. `Range: entries=:-9:` returns the last 10 entries. Or
`Range: entries=:-200:100` to see 100 entries starting from the one 200 ago.
:::

API returns the last 100 lines by default. Provide a value for `Range` to see
logs further in the past.

</ApiEndpoint>

<ApiEndpoint path="/host/logs/follow" method="get">

Identical to `/host/logs` except it continuously returns new log entries.

</ApiEndpoint>

<ApiEndpoint path="/host/logs/identifiers">

Returns a list of syslog identifiers from the systemd journal that you can use
with `/host/logs/identifiers/<identifier>` and `/host/logs/boots/<bootid>/identifiers/<identifier>`.

</ApiEndpoint>

<ApiEndpoint path="/host/logs/identifiers/<identifier>" method="get">

Get systemd Journal logs from the host for entries related to a specific log
identifier. Some examples of useful identifiers here include

- `audit` - If developing an apparmor profile shows you permission issues
- `NetworkManager` - Shows NetworkManager logs when having network issues
- `bluetoothd` - Shows bluetoothd logs when having bluetooth issues

A call to `GET /host/logs/identifiers` will show the complete list of possible
values for `identifier`.

Otherwise it provides the same functionality as `/host/logs`.

</ApiEndpoint>

<ApiEndpoint path="/host/logs/identifiers/<identifier>/follow" method="get">

Identical to `/host/logs/identifiers/<identifier>` except it continuously returns
new log entries.

</ApiEndpoint>

<ApiEndpoint path="/host/logs/boots">

Returns a dictionary of boot IDs for this system that you can use with
`/host/logs/boots/<bootid>` and `/host/logs/boots/<bootid>/identifiers/<identifier>`.

The key for each item in the dictionary is the boot offset. 0 is the current boot,
a negative number denotes how many boots ago that boot was.

</ApiEndpoint>

<ApiEndpoint path="/host/logs/boots/<bootid>" method="get">

Get systemd Journal logs from the host for entries related to a specific boot.
Call `GET /host/info/boots` to see the boot IDs. Alternatively you can provide a
boot offset:

- 0 - The current boot
- Negative number - Count backwards from current boot (-1 is previous boot)
- Positive number - Count forward from last known boot (1 is last known boot)

Otherwise it provides the same functionality as `/host/logs`.

</ApiEndpoint>

<ApiEndpoint path="/host/logs/boots/<bootid>/follow" method="get">

Identical to `/host/logs/boots/<bootid>` except it continuously returns
new log entries.

</ApiEndpoint>

<ApiEndpoint path="/host/logs/boots/<bootid>/identifiers/<identifier>" method="get">

Get systemd Journal logs entries for a specific log identifier and boot.
A combination of `/host/logs/boots/<bootid>` and `/host/logs/identifiers/<identifier>`.

</ApiEndpoint>

<ApiEndpoint path="/host/logs/boot/<bootid>/<identifier>/entries/follow" method="get">

Identical to `/host/logs/boots/<bootid>/identifiers/<identifier>` except it continuously
returns new log entries.

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

**Returned data:**

| key     | type   | optional | description                       |
| ------- | ------ | -------- | --------------------------------- |
| session | string | False    | The token for the ingress session |

</ApiEndpoint>

<ApiEndpoint path="/ingress/validate_session" method="post">
Validate an ingress session, extending it's validity period.

**Payload:**

| key     | type   | optional | description                       |
| ------- | ------ | -------- | --------------------------------- |
| session | string | False    | The token for the ingress session |

</ApiEndpoint>

### Root

<ApiEndpoint path="/available_updates" method="get">

Returns information about available updates

**Example response:**

```json
{
  "available_updates": [
  {
      "panel_path": "/update-available/core",
      "update_type": "core",
      "version_latest": "321",
    },
    {
      "panel_path": "/update-available/os",
      "update_type": "os",
      "version_latest": "321",
    },
    {
      "panel_path": "/update-available/supervisor",
      "update_type": "supervisor",
      "version_latest": "321",
    },
    {
      "name": "Awesome addon",
      "icon": "/addons/awesome_addon/icon",
      "panel_path": "/update-available/awesome_addon",
      "update_type": "addon",
      "version_latest": "321",
    }
  ]
}
```

**Returned data:**

| key | type | description |
| -- | -- | -- |
| update_type | string | `addon`, `os`, `core` or `supervisor` |
| name | string | Returns the name (only if the `update_type` is `addon`) |
| icon | string | Returns the path for the icon if any (only if the `update_type` is `addon`) |
| version_latest | string | Returns the available version |
| panel_path | string | Returns path where the UI can be loaded |

</ApiEndpoint>

<ApiEndpoint path="/refresh_updates" method="post">
This reloads information about add-on repositories and fetches new version files.
</ApiEndpoint>

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
| state | string | The core state of the Supervisor. |
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
  "state": "running",
  "timezone": "Europe/Tomorrowland"
}
```

</ApiEndpoint>

### Mounts

<ApiEndpoint path="/mounts" method="get">
Returns information about mounts configured in Supervisor

**Returned data:**

| key              | type       | description                                        |
| ---------------- | ---------- | -------------------------------------------------- |
| mounts           | list       | A list of [Mounts](api/supervisor/models.md#mount) |

**Example response:**

```json
{
  "mounts": [
    {
      "name": "my_share",
      "usage": "media",
      "type": "cifs",
      "server": "server.local",
      "share": "media",
      "state": "active"
    }
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/mounts" method="post">
Add a new mount in Supervisor and mount it

**Payload:**

Accepts a [Mount](api/supervisor/models.md#mount)

Value in `name` must be unique and can only consist of letters, numbers and underscores.

**Example payload:**

```json
{
  "name": "my_share",
  "usage": "media",
  "type": "cifs",
  "server": "server.local",
  "share": "media",
  "username": "admin",
  "password": "password"
}
```

</ApiEndpoint>

<ApiEndpoint path="/mounts/<name>" method="put">
Update an existing mount in Supervisor and remount it

**Payload:**

Accepts a [Mount](api/supervisor/models.md#mount).

The `name` field should be omitted. If included the value must match the existing
name, it cannot be changed. Delete and re-add the mount to change the name.

**Example payload:**

```json
{
  "usage": "media",
  "type": "nfs",
  "server": "server.local",
  "path": "/media/camera"
}
```

</ApiEndpoint>

<ApiEndpoint path="/mounts/<name>" method="delete">
Unmount and delete an existing mount from Supervisor.

</ApiEndpoint>

<ApiEndpoint path="/mounts/<name>/reload" method="post">
Unmount and remount an existing mount in Supervisor using the same configuration.

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
| interfaces | A list of [Network interface models](api/supervisor/models.md#network-interface) |
| docker     | Information about the internal docker network |
| host_internet | Boolean to indicate if the host can reach the internet. |
| supervisor_internet | Boolean to indicate if the Supervisor can reach the internet. |

**Example response:**

```json
{
  "interfaces": [
    {
      "interface": "eth0",
      "type": "ethernet",
      "primary": true,
      "enabled": true,
      "connected": true,
      "ipv4": {
        "method": "static",
        "ip_address": "192.168.1.100/24",
        "gateway": "192.168.1.1",
        "nameservers": ["192.168.1.1"],
      },
      "ipv6": null,
      "wifi": null,
      "vlan": null,
    }
  ],
  "docker": {
    "interface": "hassio",
    "address": "172.30.32.0/23",
    "gateway": "172.30.32.1",
    "dns": "172.30.32.3"
  },
  "host_internet": true,
  "supervisor_internet": true
}
```

</ApiEndpoint>

<ApiEndpoint path="/network/interface/<interface>/info" method="get">

Returns a [Network interface model](api/supervisor/models.md#network-interface) for a specific network interface.

</ApiEndpoint>

<ApiEndpoint path="/network/reload" method="post">

Update all Network interface data.

</ApiEndpoint>

<ApiEndpoint path="/network/interface/<interface>/update" method="post">
Update the settings for a network interface.

**Payload:**

| key     | type   | optional | description                                                            |
| ------- | ------ | -------- | ---------------------------------------------------------------------- |
| enabled | bool   | True     | Enable/Disable an ethernet interface / VLAN got removed with disabled   |
| ipv4    | dict   | True     | A struct with ipv4 interface settings                                  |
| ipv6    | dict   | True     | A struct with ipv6 interface settings                                  |
| wifi    | dict   | True     | A struct with Wireless connection settings                             |

**ipv4 / ipv6:**

| key         | type   | optional | description                                                                           |
| ----------- | ------ | -------- | ------------------------------------------------------------------------------------- |
| method      | string | True     | Set IP configuration method can be `auto` for DHCP or Router Advertisements (only IPv6), `static` or `disabled`     |
| address     | list   | True     | The new IP address for the interface in the X.X.X.X/XX format as list                 |
| nameservers | list   | True     | List of DNS servers to use                                                            |
| gateway     | string | True     | The gateway the interface should use                                                  |

**wifi:**

| key    | type   | optional | description                                                                    |
| ------ | ------ | -------- | ------------------------------------------------------------------------------ |
| mode   | string | True     | Set the mode `infrastructure` (default), `mesh`, `adhoc` or `ap`              |
| auth   | string | True     | Set the auth mode: `open` (default), `web`, `wpa-psk`                          |
| ssid   | string | True     | Set the SSID for connect into                                                  |
| psk    | string | True     | The shared key which is used with `web` or `wpa-psk`                           |

</ApiEndpoint>

<ApiEndpoint path="/network/interface/<interface>/accesspoints" method="get">

Return a list of available [Access Points](api/supervisor/models.md#access-points) on this Wireless interface.

**This function only works with Wireless interfaces!**

**Returned data:**

| key          | description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| accesspoints | A list of [Access Points](api/supervisor/models.md#access-points) |

**Example response:**

```json
{
  "accesspoints": [
    {
      "mode": "infrastructure",
      "ssid": "MY_TestWifi",
      "mac": "00:00:00:00",
      "frequency": 24675,
      "signal": 90
    }
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/network/interface/<interface>/vlan/<id>" method="post">

Create a new VLAN *id* on this network interface.

**This function only works with ethernet interfaces!**

**Payload:**

| key     | type   | optional | description                                                            |
| ------- | ------ | -------- | ---------------------------------------------------------------------- |
| ipv4    | dict   | True     | A struct with ipv4 interface settings                                  |
| ipv6    | dict   | True     | A struct with ipv6 interface settings                                  |

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

Load host configurations from a USB stick.

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
| data_disk        | string  | Device which is used for holding OS data persistent          |

**Example response:**

```json
{
  "version": "4.3",
  "version_latest": "5.0",
  "update_available": true,
  "board": "ova",
  "boot": "slot1",
  "data_disk": "BJTD4R-0x123456789"
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

<ApiEndpoint path="/os/datadisk/list" method="get">

Returns possible targets for the new data partition.

**Returned data:**

| key              | type    | description                                                                         |
| ---------------- | ------- | ----------------------------------------------------------------------------------- |
| devices          | list    | List of IDs of possible data disk targets                                           |
| disks            | list    | List of [disks](api/supervisor/models.md#disk) which are possible data disk targets |

**Example response:**

```json
{
  "devices": [
    "Generic-Flash-Disk-123ABC456",
    "SSK-SSK-Storage-ABC123DEF"
  ],
  "disks": [
    {
      "name": "Generic Flash Disk (123ABC456)",
      "vendor": "Generic",
      "model": "Flash Disk",
      "serial": "123ABC456",
      "size": 8054112256,
      "id": "Generic-Flash-Disk-123ABC456",
      "dev_path": "/dev/sda"
    },
    {
      "name": "SSK SSK Storage (ABC123DEF)",
      "vendor": "SSK",
      "model": "SSK Storage",
      "serial": "ABC123DEF",
      "size": 250059350016,
      "id": "SSK-SSK-Storage-ABC123DEF",
      "dev_path": "/dev/sdb"
    }
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/os/datadisk/move" method="post">

Move datadisk to a new location, **This will also reboot the device!**

**Payload:**

| key     | type   | description                                                       |
| ------- | ------ | ----------------------------------------------------------------- |
| device  | string | ID of the disk device which should be used as the target for the data migration |

</ApiEndpoint>

<ApiEndpoint path="/os/boards/{board}" method="get">

Returns information about your board if it has features or settings
that can be modified from Home Assistant. The value for `board`
is the value in the `board` field returned by `/os/info`.

Boards with such options are documented below.

</ApiEndpoint>

<ApiEndpoint path="/os/boards/yellow" method="get">

If running on a yellow board, returns current values for its settings.

**Returned data:**

| key           | type    | description                  |
| ------------- | ------- | ---------------------------- |
| disk_led      | boolean | Is the disk LED enabled      |
| heartbeat_led | boolean | Is the heartbeat LED enabled |
| power_led     | boolean | Is the power LED enabled     |

**Example response:**

```json
{
  "disk_led": true,
  "heartbeat_led": true,
  "power_led": false
}
```

</ApiEndpoint>

<ApiEndpoint path="/os/boards/yellow" method="post">

If running on a yellow board, changes one or more of its settings.

**Payload:**

| key           | type    | description                              |
| ------------- | ------- | ---------------------------------------- |
| disk_led      | boolean | Enable/disable disk LED enabled          |
| heartbeat_led | boolean | Enable/disable the heartbeat LED enabled |
| power_led     | boolean | Enable/disable the power LED enabled     |

</ApiEndpoint>

### Resolution

<ApiEndpoint path="/resolution/info" method="get">

**Returned data:**

| key      | type       | description                                      |
| -------- | ---------- | ------------------------------------------------ |
| unsupported | list | A list of reasons why an installation is marked as unsupported (container, dbus, docker_configuration, docker_version, lxc, network_manager, os, privileged, systemd) |
| unhealthy | list | A list of reasons why an installation is marked as unhealthy (docker, supervisor, privileged, setup) |
| issues | list | A list of [Issue models](api/supervisor/models.md#issues) |
| suggestions | list | A list of [Suggestion models](api/supervisor/models.md#suggestion) actions |
| checks | list | A list of [Check models](api/supervisor/models.md#check) |

**Example response:**

```json
{
  "unsupported": ["os"],
  "unhealthy": ["docker"],
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
      "type": "clear_backups",
      "context": "system",
      "reference": null,
      "auto": false
    }
  ],
  "checks": [
    {
      "slug": "free_space",
      "enabled": true
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

<ApiEndpoint path="/resolution/issue/<uuid>/suggestions" method="get">

Get suggestions that would fix an issue if applied.

**Returned data:**

| key         | type       | description                                                                |
| ----------- | ---------- | -------------------------------------------------------------------------- |
| suggestions | list       | A list of [Suggestion models](api/supervisor/models.md#suggestion) actions |

**Example response:**

```json
{
  "suggestions": [
    {
      "uuid": "B9923620C9A11EBBDC3C403FC2CA371",
      "type": "clear_backups",
      "context": "system",
      "reference": null,
      "auto": false
    }
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/resolution/issue/<uuid>" method="delete">

Dismiss an issue

</ApiEndpoint>

<ApiEndpoint path="/resolution/healthcheck" method="post">

Execute a healthcheck and autofix & notifcation.

</ApiEndpoint>

<ApiEndpoint path="/resolution/check/<slug>/options" method="post">

Set options for this check.

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| enabled | bool   | If the check should be enabled or disabled                     |

</ApiEndpoint>

<ApiEndpoint path="/resolution/check/<slug>/run" method="post">

Execute a specific check right now.

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

### Store

<ApiEndpoint path="/store" method="get">

Returns add-on store information.

**Example response:**

```json
{ "addons":
  [
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
  "repositories": [
    {
      "slug": "awesom_repository",
      "name": "Awesome Repository",
      "source": "https://example.com/addons",
      "url": "https://example.com/addons",
      "maintainer": "Awesome Maintainer"
    }
  ]
}
```

</ApiEndpoint>

<ApiEndpoint path="/store/addons" method="get">

Returns a list of store add-ons

**Example response:**

```json
[
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
]
```

</ApiEndpoint>

<ApiEndpoint path="/store/addons/<addon>" method="get">

Returns information about a store add-on

**Example response:**

```json
{
  "advanced": false,
  "apparmor": "default",
  "arch": ["armhf", "aarch64", "i386", "amd64"],
  "auth_api": true,
  "available": true,
  "build": false,
  "description": "Awesome description",
  "detached": false,
  "docker_api": false,
  "documentation": true,
  "full_access": true,
  "hassio_api": false,
  "hassio_role": "manager",
  "homeassistant_api": true,
  "homeassistant": "2021.2.0b0",
  "host_network": false,
  "host_pid": false,
  "icon": false,
  "ingress": true,
  "installed": false,
  "logo": true,
  "long_description": "lorem ipsum",
  "name": "Awesome add-on",
  "rating": 5,
  "repository": "core",
  "signed": false,
  "slug": "7kshd7_awesome",
  "stage": "stable",
  "update_available": false,
  "url": "https://example.com/addons/tree/main/awesome_addon",
  "version_latest": "1.0.0",
  "version": "1.0.0"
}
```

</ApiEndpoint>

<ApiEndpoint path="/store/addons/<addon>/install" method="post">

Install an add-on from the store.

</ApiEndpoint>

<ApiEndpoint path="/store/addons/<addon>/update" method="post">

Update an add-on from the store.

**Payload:**

| key     | type   | description                                                    |
| ------- | ------ | -------------------------------------------------------------- |
| backup | boolean | Create a partial backup of the add-on, default is false |

</ApiEndpoint>

<ApiEndpoint path="/store/addons/<addon>/changelog" method="get">
Get the changelog for an add-on.
</ApiEndpoint>

<ApiEndpoint path="/store/addons/<addon>/documentation" method="get">
Get the documentation for an add-on.
</ApiEndpoint>

<ApiEndpoint path="/store/addons/<addon>/icon" method="get">
Get the add-on icon
</ApiEndpoint>

<ApiEndpoint path="/store/addons/<addon>/logo" method="get">
Get the add-on logo
</ApiEndpoint>

<ApiEndpoint path="/store/reload" method="post">

Reloads the information stored about add-ons.

</ApiEndpoint>

<ApiEndpoint path="/store/repositories" method="get">

Returns a list of store repositories

**Example response:**

```json
[
  {
    "slug": "awesom_repository",
    "name": "Awesome Repository",
    "source": "https://example.com/addons",
    "url": "https://example.com/addons",
    "maintainer": "Awesome Maintainer"
  }
]
```

</ApiEndpoint>

<ApiEndpoint path="/store/repositories" method="post">

Add an addon repository to the store

**Payload:**

| key        | type   | description                                      |
| ---------- | ------ | ------------------------------------------------ |
| repository | string | URL of the addon repository to add to the store. |

**Example payload:**

```json
{
  "repository": "https://example.com/addons"
}
```

</ApiEndpoint>

<ApiEndpoint path="/store/repositories/<repository>" method="get">

Returns information about a store repository

**Example response:**

```json
{
  "slug": "awesom_repository",
  "name": "Awesome Repository",
  "source": "https://example.com/addons",
  "url": "https://example.com/addons",
  "maintainer": "Awesome Maintainer"
}
```

</ApiEndpoint>

<ApiEndpoint path="/store/repositories/<repository>" method="delete">

Remove an unused addon repository from the store.

</ApiEndpoint>

### Security

<ApiEndpoint path="/security/info" method="get">

Returns information about the security features

**Returned data:**

| key                 | type         | description                                                   |
| ------------------- | ------------ | ------------------------------------------------------------- |
| content_trust       | bool         | If content-trust is enabled or disabled on the backend        |
| pwned               | bool         | If pwned check is enabled or disabled on the backend          |
| force_security      | bool         | If force-security is enabled or disabled on the backend       |

**Example response:**

```json
{
  "content_trust": true,
  "pwned": true,
  "force_security": false,
}
```

</ApiEndpoint>

<ApiEndpoint path="/security/options" method="post">

**Payload:**

| key                 | type   | description                                            |
| ------------------- | ------ | ------------------------------------------------------ |
| content_trust       | bool   | Disable/Enable content-trust                           |
| pwned               | bool   | Disable/Enable pwned                                   |
| force_security      | bool   | Disable/Enable force-security                          |

</ApiEndpoint>

<ApiEndpoint path="/security/integrity" method="post">

Run a full platform integrity check.

**Returned data:**

| key | type | description |
| ----| ---- | ----------- |
| supervisor | str | `pass`, `error`, `failed`, `untested` |
| core | str | `pass`, `error`, `failed`, `untested` |
| plugins | dict | A dictionary with key per plugin as `pass`, `error`, `failed`, `untested` |
| addons | dict | A dictionary with key per addon as `pass`, `error`, `failed`, `untested` |

**Example response:**

```json
{
  "supervisor": "pass",
  "core": "pass",
  "plugins": {
    "audio": "pass",
    "cli": "pass"
  },
  "addons": {
    "core_ssh": "untested",
    "xj3493_test": "pass"
  }
}
```

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
| addons_repositories | list         | A list of add-on repository URL's as strings                  |
| auto_update         | bool         | Is auto update enabled for supervisor                         |

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
  "addons_repositories": ["https://example.com/addons"],
  "auto_update": true
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
| auto_update         | bool   | Enable/disable auto update for supervisor              |

</ApiEndpoint>

<ApiEndpoint path="/supervisor/ping" method="get" unprotected>

Ping the supervisor to check if it can return a response.

</ApiEndpoint>

<ApiEndpoint path="/supervisor/reload" method="post">

Reload parts of the supervisor, this enable new options, and check for updates.

</ApiEndpoint>

<ApiEndpoint path="/supervisor/restart" method="post">

Restart the supervisor, can help to get the supervisor healthy again.

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
| application | The name of an application, call `/audio/info` to get the correct name                                                                                 |
| interface   | A valid interface name, example `eth0`, to get the interface name you can call `/network/info`. You can use `default` to get the primary interface |
| registry    | A registry hostname defined in the container registry configuration, to get the hostname you can call `/docker/registries`                            |
| service     | The service name for a service on the host.                                                                                                           |
| backup    | A valid backup slug, example `skuwe823`, to get the slug you can call `/backups`                                                                  |
| suggestion  | A valid suggestion, example `clear_full_backup`, to get the suggestion you can call `/resolution`                                         |
| uuid        | The UUID of a discovery service, to get the UUID you can call `/discovery`                                                                            |
