---
author: thomasddn
authorURL: https://github.com/thomasddn
title: "Hassfest prioritizes strings.json for custom integrations"
---

### Summary of changes

The hassfest validation will now check against `strings.json` instead of `translations/en.json` for custom integrations, but only if `strings.json` exists. If `strings.json` does not exist, then the validation will run against `translations/en.json`, just like it did before.

Custom integrations might resolve to `strings.json` in combination with a translation provider (e.g. Lokalise). The advantage is that you can reference other keys for common translation values, which makes translating to different languages less tedious and less error-prone.

If you are not actually using `strings.json` in your custom integration but still have it there (because it was copied from examples or core components), you can remove the file to make hassfest work like before.

### Examples

A `strings.json` file using references to common keys. A translation provider will replace the key references with their actual value. How common keys must be referenced depends on the translation provider.

```json
{
    "common": {
        "error": "Error",
        "unknown": "Unknown"
    },
    "entity": {
        "sensor": {
            "charging_connection_status": {
                "name": "Charging connection status",
                "state": {
                    "connection_status_connected_ac": "Connected AC",
                    "connection_status_connected_dc": "Connected DC",
                    "connection_status_disconnected": "Disconnected",
                    "connection_status_fault": "[%key:common::error%]",
                    "connection_status_unspecified": "[%key:common::unknown%]"
                }
            },
            "charging_system_status": {
                "name": "Charging status",
                "state": {
                    "charging_system_charging": "Charging",
                    "charging_system_done": "Done",
                    "charging_system_fault": "[%key:common::error%]",
                    "charging_system_idle": "Idle",
                    "charging_system_scheduled": "Scheduled",
                    "charging_system_unspecified": "[%key:common::unknown%]"
                }
            }
        }
    }
}
```