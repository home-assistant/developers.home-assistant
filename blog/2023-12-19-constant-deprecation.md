---
author: Robert Resch
authorURL: https://github.com/edenhaus
authorImageURL: https://avatars.githubusercontent.com/u/26537646?s=96&v=4
title: "Deprecated constants create a log entry"
---

In recent years many constants have been replaced by Enums or other values by adding a code comment pointing to the successor.
Using deprecated constants will now create a warning log entry containing the used integration, the replacement, and the version where the constant will be removed from core.
There will be a one-year deprecation period to ensure all custom integration authors have time to adjust.

Most constants should already have been replaced, as we created several blog posts in the past about their deprecation. Some are listed below:
- [Deprecating all SUPPORT_* constants](2022-04-02-support-constants-deprecation.md)
- [Constant deprecations for 2022.5](2022-05-03-constants-deprecations.md)
- [AutomationActionType deprecation for 2022.9](2022-08-15-automation-action-type-deprecation.md)
- [Device tracker deprecations for 2022.9](2022-07-29-device-tracker_source-type-deprecation.md)
- [Deprecating media player constants](2022-09-06-media-player-repeat-mode-deprecation.md)
- [Add new precipitation intensity units](2022-10-25-new-precipitation-intensity-units.md)
- [Introducing new unit enumerators](2022-10-26-new-unit-enumerators.md)
- [Add  more unit enumerators](2022-11-28-more-unit-enumerators.md)
- [Add  more unit enumerators](2022-12-05-more-unit-enumerators.md)

More details can be found in [core PR #105736](https://github.com/home-assistant/core/pull/105736) or by checking the usage of the function [`check_if_deprecated_constant`](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/deprecation.py#L240) in the deprecation helper.