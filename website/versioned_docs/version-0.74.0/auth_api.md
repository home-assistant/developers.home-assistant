---
title: Authentication API
sidebar_label: API
id: version-0.74.0-auth_api
original_id: auth_api
---

> This is experimental. It is not persisted and is not yet intended for production.

This page will describe the steps required to fetch an access token for a user and how to refresh it. We follow the OAuth 2 specification.

## Requirements

A client needs to be created inside Home Assistant before a client can request users to authorize it or fetch a new access token. The only way currently to create a client is programmatically:

```python
client = await hass.auth.async_get_or_create_client(
    'Example client',
    redirect_uris=['http://www.example.com/hass_callback']
)
print(client.id)
```

## Authorize

[![Authorization flow sequence diagram](/img/en/auth/authorize_flow.png)](https://www.websequencediagrams.com/?lz=dGl0bGUgQXV0aG9yaXphdGlvbiBGbG93CgpVc2VyIC0-IENsaWVudDogTG9nIGludG8gSG9tZSBBc3Npc3RhbnQKABoGIC0-IFVzZXI6AEMJZSB1cmwgAD4JACgOOiBHbyB0bwAeBWFuZCBhAC0ICgBQDgB1DACBFw5jb2RlAHELAE4RZXQgdG9rZW5zIGZvcgAoBgBBGlQAJQUK&s=qsd)

 - The authorize url should contain `client_id`, `redirect_uri` and, if available, `client_secret` as query parameters. Example: `http://your-instance.com/auth/authorize?client_id=ABCDE&client_secret=QWERTY&redirect_uri=https%3A%2F%2Fexample.com%2Fhass_callback`
 - The user will navigate to this link, log into Home Assistant and authorize the client.
 - Once authorized, the user will be redirected back to the passed in redirect uri with the authorization code as part of the query parameters. Example: https://example.com/hass_callback?code=12345
 - This authorization code can be exchanged for tokens by sending it to the token endpoint (see next section).
 - As specified in the OAuth 2 specification, it is possible to pass an optional state string to the authorize url using the `state` query parameter. This string will be added as query parameter to the redirect url.

## Token

The token endpoint returns tokens given valid grants. This grant is either an authorization code retrieved from the authorize endpoint or a refresh token.

All interactions with this endpoint need to be HTTP POST requests to `http://your-instance.com/auth/token` with the request body encoded in `application/x-www-form-urlencoded`.

### Authorization code

Use the grant type `authorization_code` to retrieve the tokens after a user has successfully finished the authorize step. The request body is:

```
grant_type=authorization_code&code=12345
```

The return response will be an access and refresh token:

```json
{
    "access_token": "ABCDEFGH",
    "expires_in": 1800,
    "refresh_token": "IJKLMNOPQRST",
    "token_type": "Bearer"
}
```

### Refresh token

Use the grant type `refresh_token` to retrieve an access token using a refresh token. The request body is:

```
grant_type=refresh_token&refresh_token=QWERTY
```

The return response will be an access token:

```json
{
    "access_token": "ABCDEFGH",
    "expires_in": 1800,
    "token_type": "Bearer"
}
```

## Making authenticated requests

Once you have an access token, you can make authenticated requests to the Home Assistant APIs.

For the websocket connection, pass the access token in the [authentication message](https://developers.home-assistant.io/docs/en/external_api_websocket.html#authentication-phase).

For HTTP requests, pass the token type and access token as the authorization header:

```
Authorization: Bearer ABCDEFGH
```

If the access token is no longer valid, you will get a response with HTTP status code 401 unauthorized. This means that you will need to refresh the token. If the refresh token doesn't work, the tokens are no longer valid and the client should ask the user to authorize again.
