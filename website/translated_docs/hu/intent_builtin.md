---
title: "Built-in intents"
---

Home Assistant comes with a couple of built-in intents. These intents aim to offer similar functionality as exposed via the services. All built-in intents are prefixed with "Hass" to avoid collision with user defined intents.

## Core

### HassTurnOff

Turn an entity off.

| Slot name | Type   | Required | Description                     |
| --------- | ------ | -------- | ------------------------------- |
| name      | string | Yes      | Name of the entity to turn off. |

### HassTurnOn

Turn an entity on.

| Slot name | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| name      | string | Yes      | Name of the entity to turn on. |

### HassToggle

Toggle the state of an entity.

| Slot name | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| name      | string | Yes      | Name of the entity to toggle. |

## Cover

### HassOpenCover

Open a cover.

| Slot name | Type   | Required | Description                       |
| --------- | ------ | -------- | --------------------------------- |
| name      | string | Yes      | Name of the cover entity to open. |

### HassCloseCover

Close a cover.

| Slot name | Type   | Required | Description                        |
| --------- | ------ | -------- | ---------------------------------- |
| name      | string | Yes      | Name of the cover entity to close. |

## Light

### HassLightSet

Set the state of a light.

| Slot name  | Type                        | Required | Description                        |
| ---------- | --------------------------- | -------- | ---------------------------------- |
| name       | string                      | Yes      | Name of the entity to toggle.      |
| color      | string, name of valid color | No       | Color to change the light to.      |
| brightness | integer, 0-100              | No       | Brightness to change the light to. |

## Shopping List

### HassShoppingListAddItem

Add an item to the shopping list.

| Slot name | Type   | Required | Description                      |
| --------- | ------ | -------- | -------------------------------- |
| item      | string | Yes      | Name of item to add to the list. |

### HassShoppingListLastItems

List the last 5 items on the shopping list.

*This intent has no slots.*