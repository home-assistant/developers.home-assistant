---
title: "Built-in intents"
---

import intents from '!!yaml-loader!../intents/intents.yaml';

The following intents are supported by Home Assistant:

<>
{
  Object.entries(intents)
  .filter(([intent, info]) => !intent.startsWith("HassClimate"))
  .map(
    ([intent, info]) =>
      <>
        <h3>{intent}</h3>
        <p>{info.description}</p>
        <b>Slots</b>
        {info.slots && (
          <ul>
            {Object.entries(info.slots).map(([slot, slotInfo]) => (
              <li>
                <b>{slot}</b> - {slotInfo.description}
              </li>
            ))}
          </ul>
        )}
        <p><small>
          <a href={`https://www.home-assistant.io/integrations/${info.domain}`}>Provided by the <code>{info.domain}</code> integration.</a>
        </small></p>
      </>
  )
}
</>

## Deprecated intents

These are old intents that are not supported by template matching sentences and are planned to be removed or replaced.

### HassToggle

Toggle the state of an entity.

| Slot name | Type | Required | Description
| --------- | ---- | -------- | -----------
| name | string | Yes | Name of the entity to toggle.

### HassHumidifierSetpoint

Set target humidity.

| Slot name | Type | Required | Description
| --------- | ---- | -------- | -----------
| name | string | Yes | Name of the entity to control.
| humidity | integer, 0-100 | Yes | Target humidity to set.

### HassHumidifierMode

Set humidifier mode if supported by the humidifier.

| Slot name | Type | Required | Description
| --------- | ---- | -------- | -----------
| name | string | Yes | Name of the entity to control.
| mode | string | Yes | The mode to switch to.

### HassShoppingListAddItem

Add an item to the shopping list.

| Slot name | Type | Required | Description
| --------- | ---- | -------- | -----------
| item | string | Yes | Name of item to add to the list.

### HassShoppingListLastItems

List the last 5 items on the shopping list.

_This intent has no slots._



[This page is automatically generated based on the Intents repository.](https://github.com/home-assistant/intents/blob/main/intents.yaml)
