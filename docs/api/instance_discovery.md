---
title: "Instance discovery"
---

Home Assistant advertises itself on the local network as the `_home-assistant._tcp.local.` mDNS/Zeroconf service. Clients (for example the companion apps) can browse for this service to discover instances without asking the user for an address.

The service is registered once the [`frontend`](https://www.home-assistant.io/integrations/frontend/) integration has been set up (or on start), so that the HTTP server is up and reachable when the record is published.

## Service record

| Field | Value |
| --- | --- |
| Service type | `_home-assistant._tcp.local.` |
| Instance name | `<location_name>.<service type>`. The `location_name` has `.` replaced with a space and is truncated to fit the 63-byte DNS label limit. On a name collision, Zeroconf appends a suffix (`allow_name_change`). |
| Host (server) | `<uuid>.local.`, where `<uuid>` is the instance ID. |
| Port | The HTTP server port (`8123` by default). |

## TXT properties

| Property | Meaning | Default |
| --- | --- | --- |
| `location_name` | Friendly instance name, from `hass.config.location_name`. | `Home` if no name is configured |
| `uuid` | The instance ID (`core.uuid`); a stable, opaque 32-character hex identifier. Also reused as the host name (`<uuid>.local.`). | Generated on first run |
| `version` | [Home Assistant Core version](../versioning.md). Optional: Consumers should support missing version number if Core is not yet installed (e.g. landing page shown during initial setup). Currently the landing page advertises with the sentinel version `0000.0.0`. This is not a valid Home Assistant Core version it is merly used to work around limitations of the current Android app. | Current Core version |
| `internal_url` | Internal/LAN URL, resolved via `get_url(..., allow_external=False)`. | `""` if unavailable |
| `external_url` | External URL, resolved via `get_url(..., allow_internal=False)`. | `""` if unavailable |
| `base_url` | Deprecated; kept for backward compatibility. Set to `external_url`, or `internal_url` if there is no external URL. | `""` if neither is available |
| `requires_api_password` | Legacy flag, always advertised as `True`. The `api_password` authentication mechanism it referred to was [deprecated in 0.90](https://github.com/home-assistant/core/pull/21884) and [removed in 2024.7.0](https://github.com/home-assistant/core/pull/119976), so the flag is now meaningless. Clients should no longer parse it. | `True` |
| `landingpage` | Present and set to `True` only on the record published by the [landing page](https://github.com/home-assistant/landingpage) before Core is set up. Absent on a running Core instance. | Not set |

:::note

A TXT property value may be at most 230 bytes (`key=value` is capped at 255). Any value exceeding this is suppressed (replaced with an empty string) so it does not break advertisement.

:::
