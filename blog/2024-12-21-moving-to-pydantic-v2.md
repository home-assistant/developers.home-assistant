---
author: Joost Lekkerkerker
authorURL: https://github.com/joostlek
authorImageURL: https://avatars.githubusercontent.com/u/7083755?v=4
title: "Moving to Pydantic v2"
---

Pydantic is a widely used library in Python for data validation. On June 30, 2023, Pydantic v2 was released, introducing significant changes that are not backward compatible with Pydantic v1.

Starting with Home Assistant Core 2025.1, Pydantic v2 will replace v1. If your custom integration uses Pydantic, it must be updated to support Pydantic v2 to keep working in the upcoming release.

Over the past year, our community has worked hard to ensure that the libraries used by Home Assistant Core are compatible with both Pydantic v1 and v2. This dual compatibility has helped make our transition to Pydantic v2 as smooth as possible.

For a quick migration, you can use the Pydantic v1 shims included in Pydantic v2. Detailed information about using these shims in a v1/v2 environment can be found in the [Pydantic migration guide](https://docs.pydantic.dev/latest/migration/#using-pydantic-v1-features-in-a-v1v2-environment).