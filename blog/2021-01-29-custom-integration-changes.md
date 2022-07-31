---
author: Joakim Sørensen
authorURL: https://github.com/ludeeus
authorImageURL: /img/profile/ludeeus.jpg
authorTwitter: ludeeus
title: Custom integration changes
---

Happy New Year everyone! 2021 is finally here 🎉

As you probably are aware, recently we were made aware of security issues in several popular custom integrations. You can read more about that here:

- https://www.home-assistant.io/blog/2021/01/14/security-bulletin/
- https://www.home-assistant.io/blog/2021/01/22/security-disclosure/
- https://www.home-assistant.io/blog/2021/01/23/security-disclosure2/

In light of these incidents. Starting with the Home Assistant 2021.2.0 beta that was just released, we are changing two things that will affect custom integrations.

## Deprecated utilities

The `sanitize_filename` and `sanitize_path` helpers located in the `homeassistant.utils` package have been deprecated and are pending removal. This will happen with the release of Home Assistant 2021.4.0 scheduled for the first week of April this year.

We have added `raise_if_invalid_filename` and `raise_if_invalid_path` as replacement. They are located in the same `homeassistant.utils` package. These new functions will raise a `ValueError` instead of relying on the developer comparing the output of the function to the input to see if it is different. This will prevent misuse.

## Versions

The second change is pretty cool! Versions!

The [`manifest.json` file][manifest] now has added support for a `version` key. The version should be a string with a major, minor and patch version. For example, `"1.0.0"`.

This version will help users communicate with you the version they had issues with. And if you ever find a security issue with your custom integration, Home Assistant will be able to block insecure versions from being used.

**The `version` key is required from Home Assistant version 2021.6**

## Hassfest updated

`hassfest` is our internal tool that is used in Home Assistant to validate all integrations. In April we made this available as a GitHub Action to help you find issues in your custom integration. This action can be used in any custom integration hosted on GitHub. If you have not added that to your repository yet, now is the time! [Read more about that here][hassfest].

If you are using the `hassfest` GitHub action, you will now start to see warnings when it runs if you are missing the `version` key in your [`manifest.json` file][manifest]. This warning will become an error at a later point when the `version` key becomes fully required for custom integrations.

## Serving files

Making resources available to the user is a common use case for custom integrations, whether that is images, panels, or enhancements the user can use in Lovelace. The only way one should serve static files from a path is to use `hass.http.register_static_path`. Use this method and avoid using your own, as this can lead to serious bugs or security issues.

```python
from pathlib import Path

should_cache = False
files_path = Path(__file__).parent / "static"
hass.http.register_static_path("/api/my_integration/static", str(files_path), should_cache)
```

That's it for this update about custom integrations. Keep doing awesome stuff! Until next time 👋

[AwesomeVersion]: https://github.com/ludeeus/awesomeversion
[CalVer]: https://calver.org/
[SemVer]: https://semver.org/
[hassfest]: /blog/2020/04/16/hassfest
[manifest]: /docs/creating_integration_manifest
