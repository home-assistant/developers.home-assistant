---
title: Entitat aspiradora
sidebar_label: Aspiradora
---

## Propietats

> Les propietats han de retornar només informació en memòria i no fer transaccions I/O (com peticions web). Implementa el mètode `update()` or `async_update()` per obtenir les dades.

| Name                 | Tipus  | Per defecte                             | Descripció                                                                         |
| -------------------- | ------ | --------------------------------------- | ---------------------------------------------------------------------------------- |
| name                 | string | **Obligatori**                          | Nom del dispositiu.                                                                |
| state                | string | **Obligatori**                          | Un dels estats presents en la secció Estats.                                       |
| battery_level        | int    | `Cap`                                   | Nivell de càrrega actual.                                                          |
| battery_icon         | string | Funció                                  | Icona de bateria per mostrar a la interfície d'usuari.                             |
| cleaning_mode        | string | `Cap`                                   | Mode de neteja actual.                                                             |
| cleaning_mode_list | list   | `NotImplementedError()`                 | Llista de les possibles velocitats del ventilador i els possibles modes de neteja. |
| error                | string | Obligatori, ha d'incloure `STATE_ERROR` | Missatge d'error en el cas de que l'aspirador es trobi en `STATE_ERROR`.           |

## States

| State             | Descripció                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `STATE_CLEANING`  | L'aspiradora està funcionant.                                                                                           |
| `STATE_DOCKED`    | L'aspiradora està aparcada, segurament, també carregant-se.                                                             |
| `STATE_PAUSED`    | L'aspiradora estava en funcionament però s'ha aturat sense retornar a la base.                                          |
| `STATE_IDLE`      | L'aspiradora no està aturada ni aparcada a la base, no hi ha errors.                                                    |
| `STATE_RETURNING` | L'aspiradora ha acabat i està retornant a la base però encara no hi ha arribat.                                         |
| `STATE_ERROR`     | Hi ha hagut un error mentre l'aspiradora estava en funcionament. L'error pot ser descrit en una propietat de l'entitat. |

## Methods

### `turn_on` o `async_turn_on`

Engega l'aspiradora i comença a funcionar.

### `turn_off` o `async_turn_off`

Apaga l'aspiradora i retorna a la base.

### `return_to_base` o `async_return_to_base`

Posa l'aspiradora en mode tornar a la base.

### `stop` o `async_stop`

Atura l'aspiradora sense retornar a la base.

### `clean_spot` o `async_clean_spot`

Realitza una neteja focalitzada.

### `locate` o `async_locate`

Localitza l'aspiradora.

### `set_cleaning_mode` o `async_set_cleaning_mode`

Especifica el mode de neteja.

### `send_command` o `async_send_command`

Envia una missatge de control a l'aspiradora.