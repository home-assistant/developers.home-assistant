---
title: "Sensors"
---

El component `mobile_app` permet exposar sensors personalitzats que es poden gestionar completament des de l'aplicació.

## Registre d'un sensor

Els sensor han d'estar registrats abans de poder ser actualitzats. Només pots registrar els sensors d'un en un però, els pots actualitzar tots a la vegada.

Per registrar un sensor has de fer una petició al "webhook" com aquesta:

```json
{
  "data": {
    "attributes": {
      "foo": "bar"
    },
    "device_class": "battery",
    "icon": "mdi:battery",
    "name": "Battery State",
    "state": "12345",
    "type": "sensor",
    "unique_id": "battery_state",
    "unit_of_measurement": "%"
  },
  "type": "register_sensor"
}
```

Les claus vàlides són:

| Clau                  | Tipus                           | Obligatori | Descripció                                                                                                                                                                                                           |
| --------------------- | ------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| attributes            | objecte                         | No         | Atributs afegits al sensor.                                                                                                                                                                                          |
| device_class          | string                          | No         | Una de les classes disponibles. [Classes de Sensor binari](https://www.home-assistant.io/components/binary_sensor/#device-class), [Classes de Sensor](https://www.home-assistant.io/components/sensor/#device-class) |
| icon                  | Material Design Icon (string)   | No         | Ha de començar amb el prefix `mdi:`. Si no es proporciona, el valor per defecte serà `mdi:cellphone`                                                                                                                 |
| name                  | string                          | Sí         | Nom del sensor.                                                                                                                                                                                                      |
| state                 | booleà, flotant, enter o string | Sí         | Estat del sensor.                                                                                                                                                                                                    |
| type                  | string                          | Sí         | Tipus de sensor. Pot ser `binary_sensor` o bé `sensor`.                                                                                                                                                              |
| unique_id             | string                          | Sí         | Identificador únic en la instal·lació de l'aplicació. El necessitaràs més endavant. Normalment el millor és que sigui similar al nom del sensor.                                                                     |
| unit_of_measurement | string                          | No         | Unitat de mesura del sensor.                                                                                                                                                                                         |

Els sensors apareixeran tan bon punt s'hagin registrat.

## Actualització d'un sensor

Un cop un sensor estigui registrat, s'ha d'actualitzar. És un procés similar al del registre, però pots actualitzar-los tots a la vegada.

Per exemple, per actualitzar un sensor que ja ha estat registrat (com el de sobre), has d'enviar això:

```json
{
  "data": [
    {
      "attributes": {
        "hello": "world"
      },
      "icon": "mdi:battery",
      "state": 123,
      "type": "sensor",
      "unique_id": "battery_state"
    }
  ],
  "type": "update_sensor_states"
}
```

En les actualitzacions només algunes de les claus estan permeses:

| Clau       | Tipus                           | Obligatori | Descripció                                                                                                                                       |
| ---------- | ------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| attributes | objecte                         | No         | Atributs afegits al sensor.                                                                                                                      |
| icon       | Material Design Icon (string)   | No         | Ha de començar amb el prefix `mdi:`.                                                                                                             |
| state      | booleà, flotant, enter o string | Sí         | Estat del sensor.                                                                                                                                |
| type       | string                          | Sí         | Tipus de sensor. Pot ser `binary_sensor` o bé `sensor`.                                                                                          |
| unique_id  | string                          | Sí         | Identificador únic en la instal·lació de l'aplicació. El necessitaràs més endavant. Normalment el millor és que sigui similar al nom del sensor. |