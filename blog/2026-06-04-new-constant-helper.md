---
author: epenet
authorURL: https://github.com/epenet
title: "Introducing new constant helpers"
---

As of Home Assistant Core 2026.7, the following unit constants are deprecated and replaced 
by a corresponding class or enum:

### Select:

  - `SelectServiceArgument` class constants replace `ATTR_CYCLE` and `ATTR_OPTION` constants
  - `SelectEntityAttribute` enumerator replaces `ATTR_OPTIONS` constants
  - `SelectService` enumerator replaces `SERVICE_*` constants (in tests only, as they are single-use in the code)
