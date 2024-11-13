---
author: mikey0000
authorURL: https://github.com/mikey0000
title: "Area squared unit enumerators"
---

As of Home Assistant Core 2024.12, the following unit constant is deprecated and replaced 
by a corresponding enum:

  - `UnitOfArea` enumerator replaces `AREA_SQUARE_METERS` constant

Area units can also be converted between us customary and metric units using `AreaConverter`

```python
AreaConverter.convert(10, UnitOfArea.SQUARE_KILOMETERS, UnitOfArea.SQUARE_MILES)
```