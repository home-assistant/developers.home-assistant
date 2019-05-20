---
title: Entitat de qualitat de l'aire
sidebar_label: Qualitat de l'aire
---

## Propietats

> Les propietats han de retornar només informació en memòria i no fer transaccions I/O (com peticions web). Implementa el mètode `update()` or `async_update()` per obtenir les dades.

| Name                         | Tipus   | Per defecte    | Descripció                                         |
| ---------------------------- | ------- | -------------- | -------------------------------------------------- |
| particulate_matter_2_5     | flotant | **Obligatori** | Nivell de partícules PM2.5 (<= 2.5 μm) level.      |
| particulate_matter_10      | flotant | **Obligatori** | Nivell de partícules PM10 (<= 10 μm) level.        |
| particulate_matter_0_1     | flotant | `Cap`          | Nivell de partícules ultrafines (<= 0.1 μm) level. |
| air_quality_index          | flotant | `Cap`          | Índex de qualitat de l'aire (AQI).                 |
| ozone                        | flotant | `Cap`          | Nivell d'ozó (O3).                                 |
| carbon_monoxide              | flotant | `Cap`          | Nivell de monòxid de carboni (CO).                 |
| carbon_dioxide               | flotant | `Cap`          | Nivell de diòxid de carboni (CO2).                 |
| sulphur_dioxide              | flotant | `Cap`          | Nivell de diòxid de sofre (SO2).                   |
| nitrogen_oxide               | flotant | `Cap`          | Nivell d'òxid de nitrogen (N2O).                   |
| nitrogen_monoxide            | flotant | `Cap`          | Nivell de monòxid de nitrogen (NO).                |
| nitrogen_dioxide             | flotant | `Cap`          | Nivell de diòxid de nitrogen (NO2).                |
| volatile_organic_compounds | flotant | `Cap`          | Nivell de compostos orgànics volàtils (COV).       |

Les propietats han de estar en les unitats definides a `unit_system`.