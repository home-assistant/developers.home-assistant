---
title: "Custom Strategies"
---

_Introduced in Home Assistant 2021.5._

Strategies are JavaScript functions that generate dashboard configurations. When a user has not created a dashboard configuration yet, an auto-generated dashboard is shown. That configuration is generated using a built-in strategy.

It's possible for developers to create their own strategies to generate dashboards. Strategies can use all of Home Assistant's data and the user's dashboard configuration to create something new.

A strategy can be applied to the whole configuration or to a specific view.

Strategies are defined as a custom element in a JavaScript file, and included [via dashboard resources](./registering-resources.md). Home Assistant will call static functions on the class instead of rendering it as a custom element.

## Dashboard Strategies

A dashboard strategy is responsible for generating a full dashboard configuration. This can either be from scratch, or based on an existing dashboard configuration that is passed in.

An info object is passed to the strategy with information:

| Key | Description
| -- | --
| `config` | User supplied dashboard configuration, if any.
| `hass` | The Home Assistant object.
| `narrow` | If the current user interface is rendered in narrow mode or not.

```ts
class StrategyDemo {

  static async generateDashboard(info) {

    return {
      title: "Generated Dashboard",
      views: [
        {
          "cards": [
            {
              "type": "markdown",
              "content": `Generated at ${(new Date).toLocaleString()}`
            }
          ]
        }
      ]
    };

  }

}

customElements.define("ll-strategy-my-demo", StrategyDemo);
```

Use the following dashboard configuration to use this strategy:

```yaml
strategy:
  type: custom:my-demo
views: []
```

## View Strategies

A view strategy is responsible for generating the configuration of a specific dashboard view. The strategy is invoked when the user opens the specific view.

An info object is passed to the strategy with information:

| Key | Description
| -- | --
| `view` | View configuration.
| `config` | Dashboard configuration.
| `hass` | The Home Assistant object.
| `narrow` | If the current user interface is rendered in narrow mode or not.

```ts
class StrategyDemo {

  static async generateView(info) {

    return {
      "cards": [
        {
          "type": "markdown",
          "content": `Generated at ${(new Date).toLocaleString()}`
        }
      ]
    };

  }

}

customElements.define("ll-strategy-my-demo", StrategyDemo);
```

Use the following dashboard configuration to use this strategy:

```yaml
views:
- strategy:
    type: custom:my-demo
```

## Full Example

Strategies are structured such that a single class can provide both a dashboard and view strategy implementations.

It's recommended for a dashboard strategy to leave as much work to be done to the view strategies. That way the dashboard will show up for the user as fast as possible. This can be done by having the dashboard generate a configuration with views that rely on its own strategy.

Below example will create a view per area, with each view showing all entities in that area in a grid.

```ts
class StrategyDemo {

  static async generateDashboard(info) {
    // Query all data we need. We will make it available to views by storing it in strategy options.
    const [areas, devices, entities] = await Promise.all([
      info.hass.callWS({ type: "config/area_registry/list" }),
      info.hass.callWS({ type: "config/device_registry/list" }),
      info.hass.callWS({ type: "config/entity_registry/list" }),
    ]);

    // Each view is based on a strategy so we delay rendering until it's opened
    return {
      views: areas.map((area) => ({
        strategy: {
          type: "custom:my-demo",
          options: { area, devices, entities },
        },
        title: area.name,
        path: area.area_id,
      })),
    };
  }

  static async generateView(info) {
    const { area, devices, entities } = info.view.strategy.options;

    const areaDevices = new Set();

    // Find all devices linked to this area
    for (const device of devices) {
      if (device.area_id === area.area_id) {
        areaDevices.add(device.id);
      }
    }

    const cards = [];

    // Find all entities directly linked to this area
    // or linked to a device linked to this area.
    for (const entity of entities) {
      if (
        entity.area_id
          ? entity.area_id === area.area_id
          : areaDevices.has(entity.device_id)
      ) {
        cards.push({
          type: "button",
          entity: entity.entity_id,
        });
      }
    }

    return {
      cards: [
        {
          type: "grid",
          cards,
        },
      ],
    };
  }
}

customElements.define("ll-strategy-my-demo", StrategyDemo);
```

Use the following dashboard configuration to use this strategy:

```yaml
strategy:
  type: custom:my-demo
views: []
```
