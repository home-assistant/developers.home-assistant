---
title: "Logging"
---
A good way to find out what is going on in the integration is having the integration log what it is doing.

:::warning
Please make sure not to spam the logs, as that will make it harder to find the relevant information and may cause performance issues.
:::

## Debug logging

By default, Home Assistant does not log debug messages.
Debug logging can be enabled for the integration by the user as described in the [user documentation].
Enabling debug logging will set the log level for the integration module and for the module declared in the manifest to debug.

So when debug logging is enabled for the following integration, it will set the log level to debug for both the `my_integration` and `dependency` modules:
```json
{
  "domain": "my_integration",
  "name": "My Integration",
  "loggers": ["dependency"],
  "requirements": ["dependency==0.2.1"]
}
```

:::warning
Make sure to not log sensitive information, as debug logs may be shared with others when troubleshooting issues.
:::

To enable debug logs for a specific module, users can either add `logger` configuration as described in [the logger documentation].
Or they can use the [`logger.set_level`] service to set the log level for the module to debug.

[user documentation]: https://www.home-assistant.io/docs/configuration/troubleshooting/#enabling-debug-logging
[`logger.set_level`]: https://www.home-assistant.io/integrations/logger/#action-set-level
[the logger documentation]: https://www.home-assistant.io/integrations/logger/