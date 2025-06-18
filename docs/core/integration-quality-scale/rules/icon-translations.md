---
title: "Entities implement icon translations"
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

### State-based icon

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
      "tree_pollen": {
        "default": "mdi:tree",
        "state": {
          "high": "mdi:tree-outline"
        }
      }
    }
  }
}
```

### Range-based icons

For numeric entities, you can define icons that change based on numeric ranges. This feature eliminates the need for custom logic in your integration code and provides a consistent way to represent varying sensor values visually.

Range-based icon translations are particularly useful for:
- Battery level indicators
- Signal strength meters
- Temperature sensors
- Air quality indicators
- Fill level sensors

#### Configuration

In the `icons.json` file, define the ranges and their corresponding icons in ascending order:

```json
{
  "entity": {
    "sensor": {
      "battery_level": {
        "default": "mdi:battery-unknown",
        "range": {
          "0": "mdi:battery-outline",
          "10": "mdi:battery-10",
          "20": "mdi:battery-20",
          "30": "mdi:battery-30",
          "40": "mdi:battery-40",
          "50": "mdi:battery-50",
          "60": "mdi:battery-60",
          "70": "mdi:battery-70",
          "80": "mdi:battery-80",
          "90": "mdi:battery-90",
          "100": "mdi:battery"
        }
      }
    }
  }
}
```

The system selects the icon associated with the highest range value that's less than or equal to the entity's current numeric state. For example with the above configuration:

- A value of 15 will show the `mdi:battery-10` icon (15 is greater than 10 but less than 20)
- A value of 45 will show the `mdi:battery-40` icon (45 is greater than 40 but less than 50)
- A value of 100 will show the `mdi:battery` icon (100 equals the highest defined range)
- A value of 5 will show the `mdi:battery-outline` icon (5 is greater than 0 but less than 10)
- A value of -10 will show the `mdi:battery-unknown` default icon (value is outside defined ranges)
- A value of 120 will show the `mdi:battery` icon (any value exceeding the last defined range entry (100) will use the icon associated with that final range value)

When implementing range-based icons:

- Range values must be numeric and must be defined in ascending order
- Both integer ("0", "100") and decimal ("0.5", "99.9") range values are supported
- The icon for a given state is chosen from the highest range value that's less than or equal to the entity's current value
- The default icon is used when:
  - The entity's state value falls outside all defined ranges
  - The entity is unavailable
  - The entity's state cannot be parsed as a valid number
- If both state-based icons and range-based icons are defined in the same translation key, the state-based icons take precedence over the range-based icons
- There is no limit to how many ranges you can define, but consider performance and readability

## Additional resources

For more information about icon translations, check the [entity](/docs/core/entity#icon-translations) documentation.

## Exceptions

There are no exceptions to this rule.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>
