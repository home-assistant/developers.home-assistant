---
title: "Built-in intents"
---

Home Assistant comes with a couple of built-in intents. These intents aim to offer similar functionality as exposed via the services. All built-in intents are prefixed with "Hass" to avoid collision with user defined intents.

## Core

### HassTurnOff

Turn an entity off.

| Slot name | 구분     | 필수여부 | 설명                              |
| --------- | ------ | ---- | ------------------------------- |
| name      | string | 예    | Name of the entity to turn off. |

### HassTurnOn

Turn an entity on.

| Slot name | 구분     | 필수여부 | 설명                             |
| --------- | ------ | ---- | ------------------------------ |
| name      | string | 예    | Name of the entity to turn on. |

### HassToggle

Toggle the state of an entity.

| Slot name | 구분     | 필수여부 | 설명                            |
| --------- | ------ | ---- | ----------------------------- |
| name      | string | 예    | Name of the entity to toggle. |

## Cover

### HassOpenCover

Open a cover.

| Slot name | 구분     | 필수여부 | 설명                                |
| --------- | ------ | ---- | --------------------------------- |
| name      | string | 예    | Name of the cover entity to open. |

### HassCloseCover

Close a cover.

| Slot name | 구분     | 필수여부 | 설명                                 |
| --------- | ------ | ---- | ---------------------------------- |
| name      | string | 예    | Name of the cover entity to close. |

## Light

### HassLightSet

Set the state of a light.

| Slot name  | 구분                          | 필수여부 | 설명                                 |
| ---------- | --------------------------- | ---- | ---------------------------------- |
| name       | string                      | 예    | Name of the entity to toggle.      |
| color      | string, name of valid color | 아니오  | Color to change the light to.      |
| brightness | integer, 0-100              | 아니오  | Brightness to change the light to. |

## Shopping List

### HassShoppingListAddItem

Add an item to the shopping list.

| Slot name | 구분     | 필수여부 | 설명                               |
| --------- | ------ | ---- | -------------------------------- |
| item      | string | 예    | Name of item to add to the list. |

### HassShoppingListLastItems

List the last 5 items on the shopping list.

*This intent has no slots.*