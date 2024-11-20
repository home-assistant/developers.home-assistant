---
title: "Icon translations"
related_rules:
  - entity-translations
  - entity-device-class
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

In the past, icons were part of the state of the integration.
This was not really necessary, as they were usually either static or had a fixed set of states.

To relieve the state machine, icon translations were introduced.
The name of this feature sounds weird since it is not about translating the icon itself, but rather referencing an icon by a translation key.
The idea behind icon translations is that the integration defines icons in a file, which is then used by the frontend to display the icon.
This also adds support for different icons for state attribute values, for example the possible preset modes of a climate entity.

:::info
Be aware that entities can also get icons from the device class.
If the context of the entity is exactly the same as the device class, we should not overwrite this icon to maintain consistency between integrations.
For example, a PM2.5 sensor entity would not get a custom icon, as the device class already provides it in the same context.
:::

## Example implementation

In this example, we define a sensor entity with a translation key.
In the `icons.json` file, we define the icon for the sensor entity and a state icon for the state `high`.
So when the state of the entity is `high`, we will show the icon `mdi:tree-outline`, otherwise we will show `mdi:tree`.

`sensor.py`
```python {5} showLineNumbers
class MySensor(SensorEntity):
    """Representation of a sensor."""

    _attr_has_entity_name = True
    _attr_translation_key = "tree_pollen"
```

`icons.json`
```json
{
  "entity": {
    "sensor": {
      "tree_pollen": "mdi:tree",
      "state": {
        "high": "mdi:tree-outline"
      }
    }
  }
}
```

## Additional resources

For more information about icon translations, check the [entity](../../entity#icon-translations) documentation.

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>