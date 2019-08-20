---
title: Entity Registry and disabling entities
sidebar_label: Disabling entities
---

The entity registry tracks all entities with unique IDs. For each entity, the registry keeps track of options that impact how the entity interacts with the core. One of these options is `disabled_by`.

When `disabled_by` is set to a string value, the entity will not be added to Home Assistant when the integration passes it to `async_add_entities`.

## Integration Architecture

If an integration uses polling, there are no architectural requirements to work with disabled_by. If an integration notifies Home Assistant of updates, the entity needs to register itself with the incoming push data inside the lifecycle method `async_added_to_hass`. This lifecycle method is only called if the entity is actually added to Home Assistant (and so it's not disabled).

Entity disabling works with entities provided via a config entry or via an entry in configuration.yaml. If your integration is set up via a config entry and supports [unloading](config_entries_index.md#unloading-entries), Home Assistant will be able to reload your integration after entities have been enabled/disabled to apply the changes without a restart.

## Users editing the entity registry

One way an entity can be disabled is by the user editing the entity registry via the UI. In this case, the `disabled_by` value will be set to `user`. This will only work with entities that are already registered.

## Integrations setting default value of disabled_by for new entity registry entries

As an integration you can control if your entity is enabled when it is first registered. This is controlled by the `entity_registry_enabled_default` property. It defaults to `True`, which means the entity will be enabled.

If the property returns `False`, the `disabled_by` value of the newly registered entity will be set to `integration`.

## Config entry system options setting default value of disabled_by for new entity registry entries

The user can also control how new entities that are related to a config entry are received by setting the system option `disable_new_entities` of a config entry to `True`. This can be done via the UI.

If an entity is getting registered and this system option is set to `True`, the `disabled_by` property will be initialized as `config_entry`.

If `disable_new_entities` is set to `True` and `entity_registry_enabled_default` returns `False`, the `disabled_by` value will be set to `integration`.

## Integrations offering options to control disabled_by

Some integrations will want to offer options to the user to control which entities are being added to Home Assistant. For example, the Unifi integration might want to offer to only include wireless clients but exclude wired clients. Another example is that the Hue integration offers an option to make the groups defined inside Hue available in Home Assistant.

Integrations can offer options to users either via [configuration.yaml](configuration_yaml_index) or using an [Options Flow](config_entries_options_flow_handler.md).

It is important that if an integration offers an option to change which entities are exposed that:

- The option is only applied to existing integrations the first time it is set. It should not be applied on every reboot. This allows the user to enable individual entities.
- The option should impact the value of the entity property `entity_registry_enabled_default` so that new entities are disabled properly.
