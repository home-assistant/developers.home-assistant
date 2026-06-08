---
author: Artur Pragacz
authorURL: https://github.com/arturpragacz
title: "Entity IDs with mismatched domains are deprecated"
---

Integrations that set `entity_id` directly on an entity will now be validated
to ensure the domain portion matches the platform's domain. For example,
a `light` entity must use `light.my_light`, not `cover.my_light`.

Setting an entity ID with the wrong domain will log a deprecation warning
and will **stop working in Home Assistant 2027.5**.

In most cases, integrations should not set `entity_id` at all — Home Assistant
will generate it automatically.
