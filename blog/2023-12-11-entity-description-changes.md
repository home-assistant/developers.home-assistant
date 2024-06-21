---
author: Erik Montnémery
authorURL: https://github.com/emontnemery
title: "Changes to EntityDescription data classes"
---

The `EntityDescription` classes have changed; derived `dataclasses` should now set `frozen=True` and `kw_only=True`.

Setting `frozen` to `True` makes the `EntityDescription` instances immutable, which means they cannot be accidentally updated after creation.
Setting `kw_only` to `True` ensures the order of fields can be changed in the base class without breaking users.

During a deprecation period, which will end with HA Core 2025.1, it will still be possible to derive `dataclasses` not setting `frozen=True` or `kw_only=True`, but this will be logged, and the user will be asked to create an issue with the custom integration.

Once HA Core 2025.1 is released, it will no longer be possible to derive `dataclasses` without setting `frozen=True` or `kw_only=True`.

More details can be found in the [core PR #105211](https://github.com/home-assistant/core/pull/105211).
