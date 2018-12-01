---
title: Sending data home
id: version-0.83.0-app_integration_sending_data
original_id: app_integration_sending_data
---

There are different APIs that your app can use to send data back or communicate with Home Assistant.

## Short note on instance URLs

Some users have configured Home Assistant to be available outside of their home network using a dynamic DNS service. There are some routers that don't support hairpinning / NAT loopback: a device sending data from inside the routers network, via the externally configured DNS service, to Home Asisstant, which also resides inside the local network.

To work around this, the app will need to record which WiFi is the home network, and use a direct connection when connected to the home WiFi network.

## Webhooks

Any component in Home Assistant can register webhook endpoints. The webhook endpoints contain a randomized URL-segment which are bound to just a single update handler. Because of this, the call requires no authentication, making calls have little overhead.

Webhooks are ideal for sending quick updates, like location or battery, from your app to Home Assistant.

Webhooks are available on the local instance on `/api/webhook/<webhook id>`, which requires a direct connection. If the Home Assistant instance is configured to use Home Assistant Cloud, it is possible to get a cloud url for the webhook. This url is accessible from anywhere on the internet.

To register a webhook in your component:

```python
async def handle_webhook(hass, webhook_id, request):
    """Handle webhook callback."""
    body = await request.json()
    # Do something with the data


webhook_id = hass.components.webhook.async_generate_id()

hass.components.webhook.async_register(
    DOMAIN, 'Name of the webhook', webhook_id, handle_webhook)

print(
  "Webhook available on:",
  hass.components.webhook.async_generate_url(webhook_id)
)
```

## Websocket API

With a websocket connection you will be able to stream updates from Home Assistant and control most of the things inside Home Assistant. This API is perfect if you want to show a realtime view of the house and allow the user to interact with it.

Websocket API requires authentication via an access token and a direct connection with the instance.

- [Websocket API Docs](external_api_websocket)
- [Making authenticated requests](auth_api#making-authenticated-requests)

## Rest API

With the Rest API you are able to query the state of the house and call services. Your component is also able to register new HTTP views to offer other Rest API endpoints.

Rest API requires authentication via an access token and a direct connection with the instance.

- [Rest API Docs](external_api_rest)
- [Making authenticated requests](auth_api#making-authenticated-requests)
