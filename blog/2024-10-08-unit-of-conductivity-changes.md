---
author: Erik Montnemery
authorURL: https://github.com/emontnemery
title: "Changes to the UnitOfConductivity enum"
---

The `UnitOfConductivity` enum has been changed from:

```py
  class UnitOfConductivity(StrEnum):
    """Conductivity units."""

    SIEMENS = "S/cm"
    MICROSIEMENS = "µS/cm"
    MILLISIEMENS = "mS/cm"
```

To:

```py
  class UnitOfConductivity(StrEnum):
    """Conductivity units."""

    SIEMENS_PER_CM = "S/cm"
    MICROSIEMENS_PER_CM = "µS/cm"
    MILLISIEMENS_PER_CM = "mS/cm"
```

The old enum members can be used during a deprecation period of one year, to give time for custom integrations to migrate to the new enum members.

See [core PR #127919](https://github.com/home-assistant/core/pull/127919) for implementation details.
