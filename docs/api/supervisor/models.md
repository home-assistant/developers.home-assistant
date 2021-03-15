---
title: "Models"
---

These models are describing objects that are getting returned from the supervisor API.

## Addon

| key              | type           | description                                           |
| ---------------- | -------------- | ----------------------------------------------------- |
| name             | string         | The name of the add-on                                |
| slug             | string         | The slug for the add-on                               |
| advanced         | boolean        | `true` if it should only be visible to advanced users |
| description      | string         | The description of the add-on                         |
| repository       | string         | The repository the add-on came from                   |
| version          | string or null | The installed version of the add-on                   |
| version_latest   | string         | The latest published version of the add-on            |
| update_available | boolean        | `true` if an update is available                      |
| installed        | string         | `true` if the the add-on is installed                 |
| available        | boolean        | `false` if you can not install the add-on             |
| icon             | bool           | The add-on has a icon file                            |
| logo             | bool           | The add-on has a logo file                            |
| state            | string         | The state of the add-on (started, stopped)            |

## Application

| key          | type    | description                            |
| ------------ | ------- | -------------------------------------- |
| name         | string  | The application name                   |
| index        | int     | TODO: What is this?                    |
| stream_index | int     | TODO: What is this?                    |
| stream_type  | string  | The type of the stream (INPUT, OUTPUT) |
| volume       | float   | The current volume                     |
| mute         | boolean | `true` if the application is muted     |
| addon        | string  | The add-on slug                        |

## Audio

| key         | type | description                                     |
| ----------- | ---- | ----------------------------------------------- |
| card        | list | A list of [Card models](#card)                  |
| input       | list | A list of [Audio device models](#audio-device)  |
| output      | list | A list of [Output device models](#audio-device) |
| application | list | A list of [Application models](#application)    |

## Audio device

| key          | type        | description                                  |
| ------------ | ----------- | -------------------------------------------- |
| name         | string      | The name of the device                       |
| index        | int         | TODO: What is this?                          |
| description  | string      | The description of the device                |
| volume       | float       | The current volume                           |
| mute         | string      | `true` if the device is muted                |
| default      | string      | `true` if the device is default              |
| card         | int or null | TODO: What is this?                          |
| applications | string      | A list of [Application models](#application) |

## Audio profile

| key         | type    | description                     |
| ----------- | ------- | ------------------------------- |
| name        | string  | The name of the profile         |
| description | string  | The description of the profile  |
| active      | boolean | `true` if the profile is active |

## Card

| key      | type   | description                                      |
| -------- | ------ | ------------------------------------------------ |
| name     | string | The name of the card                             |
| index    | int    | TODO: What is this?                              |
| driver   | string | The name of the card driver                      |
| profiles | list   | A list of [Audio profile models](#audio-profile) |

## Discovery

| key     | type   | description               |
| ------- | ------ | ------------------------- |
| addon   | string | The add-on slug           |
| service | string | The service name          |
| uuid    | string | The UUID of the discovery |
| config  | dict   | The configuration         |

## Host Service

| key         | type   | description             |
| ----------- | ------ | ----------------------- |
| name        | string | The service name        |
| description | string | The service description |
| state       | string | The service state       |

## Network interface

| key         | type    | description                                                                  |
| ----------- | ------- | ---------------------------------------------------------------------------- |
| interface   | string  | The interface name i.e eth0.                                                 |
| type        | string  | The interface type: `ethernet`, `wireless` or `vlan`.                        |
| enabled     | boolean | Return True if the interface is enabled.                                     |
| connected   | boolean | Return True if the interface is connected to the network.                    |
| primary     | boolean | `true` if it's the primary network interface.                                |
| ipv4        | struct or null  | An IP config struct with IPv4 connection details.                            |
| ipv6        | struct or null  | An IP config struct with IPv6 connection details.                            |
| wifi        | struct or null  | An Wifi config struct with wireless connection details.                      |
| vlan        | struct or null  | An Vlan config struct with details about the vlan.                           |

### IP configuration

| key         | type    | description                                                                  |
| ----------- | ------- | ---------------------------------------------------------------------------- |
| method      | string  | The method used to set the IP can be `static`, `auto` or `disabled`.         |
| address     | list    | A list with IP address and the netmask in a X.X.X.X/XX format.               |
| gateway     | string  | The IP address of the gateway.                                               |
| nameservers | list    | A list containing the IP addresses of the configured nameservers as strings. |

### Wifi configuration

| key         | type    | description                                                                  |
| ----------- | ------- | ---------------------------------------------------------------------------- |
| mode        | string  | Set the mode `infrastructure`, `mesh`, `adhoc` or `ap`.                      |
| auth        | string  | Set the auth mode: `open`, `web` or `wpa-psk`.                               |
| ssid        | string  | Set the SSID for the Wireless.                                               |
| signal      | integer | Percentage of signal strength.                                               |

### VLAN configuration

| key     | type    | description                                                                  |
| ------- | ------- | ---------------------------------------------------------------------------- |
| id      | integer | The VLAN ID.                                                                 |
| parent  | string  | Parent interface which is the vlan attached.                                 |

## Access-Points

| key        | type    | description                                                                  |
| ---------- | ------- | ---------------------------------------------------------------------------- |
| mode       | string  | One of: `infrastructure`, `mesh` or `adhoc`.                                 |
| ssid       | string  | Wireless network ID.                                                         |
| frequency  | integer | The operating frequency of this Access Point.                                |
| signal     | integer | Percentage of signal strength.                                               |
| mac        | string  | MAC Address of the Access Point.                                             |

## Panel

| key    | type    | description                            |
| ------ | ------- | -------------------------------------- |
| enable | boolean | `true` if it's enabled                 |
| icon   | string  | The sidebar icon                       |
| title  | string  | The sidebar title                      |
| admin  | boolean | `true` if it's for admin accounts only |

## Repository

| key        | type           | description                           |
| ---------- | -------------- | ------------------------------------- |
| slug       | string         | The repository slug                   |
| name       | string         | The name of the repository            |
| source     | string         | The URL to the repository             |
| url        | string or null | URL for repository website            |
| maintainer | string         | The name of the repository maintainer |

## Service

| key       | type    | description                         |
| --------- | ------- | ----------------------------------- |
| slug      | string  | The service slug                    |
| available | boolean | `true` if the service is available  |
| providers | list    | A list of providers for the service |

## Snapshot

| key       | type    | description                                                           |
| --------- | ------- | --------------------------------------------------------------------- |
| slug      | string  | A generated slug for the snapshot                                     |
| date      | string  | A ISO date string representation of the date the snapshot was created |
| name      | string  | The name given to the snapshot                                        |
| type      | string  | The type of snapshot (full, partial)                                  |
| protected | boolean | `true` if the snapshot is password protected                          |

## Snapshot details

| key           | type    | description                                                                                                                |
| ------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| slug          | string  | A generated slug for the snapshot                                                                                          |
| type          | string  | The type of snapshot (full, partial)                                                                                       |
| name          | string  | The name given to the snapshot                                                                                             |
| date          | string  | A ISO date string representation of the date the snapshot was created                                                      |
| size          | string  | The size of the snapshot in MB                                                                                             |
| protected     | boolean | `true` if the snapshot is password protected                                                                               |
| homeassistant | string  | The version of Home Assistant that was in use                                                                              |
| addons        | list    | A list of add-ons in the snapshot, addons are represented as a dictionary with these keys [`slug`,`name`,`version`,`size`] |
| repositories  | list    | A list of add-on repository URL's as strings                                                                               |
| folders       | list    | A list of strings representing directories                                                                                 |

## Stats

| key            | type  | description                               |
| -------------- | ----- | ----------------------------------------- |
| cpu_percent    | float | The percentage of the CPU that is used    |
| memory_usage   | int   | The current memory usage in bytes         |
| memory_limit   | int   | The max allowed memory usage in bytes     |
| memory_percent | float | The percentage of the memory that is used |
| network_tx     | int   | Network transmission usage                |
| network_rx     | int   | Network receiver usage                    |
| blk_read       | int   | File system read usage                    |
| blk_write      | int   | File system write usage                   |

## Issue

| key       | type        | description                                         |
| ----------| ----------- | --------------------------------------------------- |
| uuid      | str         | A generated uuid as issue ID                        |
| type      | str         | Type of the issue                                   |
| context   | str         | In which context the issue occorse                  |
| reference | str or null | Depend on the Context, a reference to a other Model |

## Suggestion

| key       | type        | description                                         |
| ----------| ----------- | --------------------------------------------------- |
| uuid      | str         | A generated uuid as suggestion ID                   |
| type      | str         | Type of the suggestion                              |
| context   | str         | In which context the suggestion occorse             |
| reference | str or null | Depend on the Context, a reference to a other Model |

## Check

| key       | type        | description                                         |
| ----------| ----------- | --------------------------------------------------- |
| slug      | str         | A generated slug for the check                      |
| enable    | bool        | The enabled state of the check                      |

## Device

| key        | type           | description                                                           |
| ---------- | -------------- | --------------------------------------------------------------------- |
| name       | string         | Name of the device object                                             |
| sysfs      | string         | Path to sysfs device object                                           |
| dev_path   | string         | Path to devfs                                                         |
| subsystem  | string or null | Subsystem type of the device (tty, input, sound, block, misc)         |
| by_id      | string or null | Udev by ID link                                                       |
| attributes | dict           | A dict with pure udev device attributes for debug and understanding   |
