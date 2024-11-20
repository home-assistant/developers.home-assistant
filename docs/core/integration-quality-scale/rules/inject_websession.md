---
title: "The integration dependency supports passing in a websession (IQS028)"
related_rules:
  - async_dependency
---
import RelatedRules from './_includes/related_rules.jsx'

## Reasoning

Since many devices and services are connected via HTTP, the number of active web sessions can be high.
To improve the efficiency of those web sessions, it is recommended to support passing in a web session to the dependency client that is used by the integration.

Home Assistants supports this for [`aiohttp`](https://docs.aiohttp.org/en/stable/) and [`httpx`](https://www.python-httpx.org/).
This means that the integration dependency should use either of those two libraries.

## Example implementation

In the example below, an `aiohttp` session is passed in to the client.
The equivalent for `httpx` would be `get_async_client`.

```python {4} showLineNumbers
async def async_setup_entry(hass: HomeAssistant, entry: MyConfigEntry) -> bool:
    """Set up my integration from a config entry."""

    client = MyClient(entry.data[CONF_HOST], async_get_clientsession(hass))
```

:::info
There are cases where you might not want a shared session, for example when cookies are used.
In that case, you can create a new session using `async_create_clientsession` for `aiohttp` and `create_async_httpx_client` for `httpx`.
:::

## Exceptions

If the integration is not making any HTTP requests, this rule does not apply.

## Related rules

<RelatedRules relatedRules={frontMatter.related_rules}></RelatedRules>