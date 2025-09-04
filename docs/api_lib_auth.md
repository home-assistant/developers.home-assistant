---
title: "Python library: authentication"
sidebar_label: Authentication
---

This page is intended for general API development, see [Home Assistant REST API api documentation](./api/rest) for interacting with Home Assistant's API.  

The Authentication part of your library is responsible for acquiring authentication and for making authenticated requests. It should not be aware of what is in the requests.

Authentication comes in many forms, but it generally boils down to that each request is accompanied by an `authorization` header which contains an access token. The access token is generally a string of random numbers/letters.

Your library should be able to acquire the authentication tokens, update them if necessary and use the authentication to make requests. It should not offer features to store the authentication data.

Because authentication is going to be stored by the developer, it is important that you return the authentication to the developer in a format that can be JSON serializable. A `dict` with primitive types (`str`, `float`, `int`) is recommended.

If your API can be served from multiple locations, your authentication class should allow the developer to pass in the location of the API.

## Async example

Python allows developers to write code that is either synchronous or asynchronous (via `asyncio`). Home Assistant is written in async, but is able to work with synchronous libraries too. We prefer async libraries.

If you are writing a library in async, we recommend that you use `aiohttp`. It's a modern and mature HTTP library and is easy to use.

```python
from aiohttp import ClientSession, ClientResponse


class Auth:
    """Class to make authenticated requests."""

    def __init__(self, websession: ClientSession, host: str, access_token: str):
        """Initialize the auth."""
        self.websession = websession
        self.host = host
        self.access_token = access_token

    async def request(self, method: str, path: str, **kwargs) -> ClientResponse:
        """Make a request."""
        if headers := kwargs.pop("headers", {}):
            headers = dict(headers)
        headers["authorization"] = self.access_token

        return await self.websession.request(
            method, f"{self.host}/{path}", **kwargs, headers=headers,
        )
```

To use this class, you will need to create an aiohttp ClientSession and pass it together with the API info to the constructor.

```python
import asyncio
import aiohttp

from my_package import Auth


async def main():
    async with aiohttp.ClientSession() as session:
        auth = Auth(session, "http://example.com/api", "secret_access_token")

        # This will fetch data from http://example.com/api/lights
        resp = await auth.request("get", "lights")
        print("HTTP response status code", resp.status)
        print("HTTP response JSON content", await resp.json())


asyncio.run(main())
```

## Sync example

```python
import requests


class Auth:
    """Class to make authenticated requests."""

    def __init__(self, host: str, access_token: str):
        """Initialize the auth."""
        self.host = host
        self.access_token = access_token

    def request(self, method: str, path: str, **kwargs) -> requests.Response:
        """Make a request."""
        if headers := kwargs.pop("headers", {}):
            headers = dict(headers)
        headers["authorization"] = self.access_token

        return requests.request(
            method, f"{self.host}/{path}", **kwargs, headers=headers,
        )
```

To use this class, construct the class with the API info.

```python
from my_package import Auth


auth = Auth("http://example.com/api", "secret_access_token")

# This will fetch data from http://example.com/api/lights
resp = auth.request("get", "lights")
print("HTTP response status code", resp.status_code)
print("HTTP response JSON content", resp.json())
```

## OAuth2

OAuth2 is a [standardized version](https://tools.ietf.org/html/rfc6749) of an authentication schema leveraging refresh and access tokens. The access token expires within a short period of time after being issued. The refresh token can be used to acquire new access tokens.

Refreshing access tokens relies on a client ID and secret, which might be held by an external service. We need to structure the authentication class to be able to allow the developer to implement their own token refresh logic.

Home Assistant ships with the Home Assistant Cloud Account Linking service, a free cloud service to allow users to quickly connect accounts using OAuth2. Home Assistant has easy to use tools built-in to allow users to configure OAuth2-based integrations. For more info, [read here](config_entries_config_flow_handler.md#configuration-via-oauth2). These built-in tools work best if your library is implemented like the examples below.

### Async example

```python
from abc import ABC, abstractmethod


class AbstractAuth(ABC):
    """Abstract class to make authenticated requests."""

    def __init__(self, websession: ClientSession, host: str):
        """Initialize the auth."""
        self.websession = websession
        self.host = host

    @abstractmethod
    async def async_get_access_token(self) -> str:
        """Return a valid access token."""

    async def request(self, method, url, **kwargs) -> ClientResponse:
        """Make a request."""
        if headers := kwargs.pop("headers", {}):
            headers = dict(headers)

        access_token = await self.async_get_access_token()
        headers["authorization"] = f"Bearer {access_token}"

        return await self.websession.request(
            method, f"{self.host}/{url}", **kwargs, headers=headers,
        )
```

Now the developer that is using your library will have to implement the abstract method for getting the access token. Let's assume that the developer has their own token manager class.

```python
from my_package import AbstractAuth


class Auth(AbstractAuth):
    def __init__(self, websession: ClientSession, host: str, token_manager):
        """Initialize the auth."""
        super().__init__(websession, host)
        self.token_manager = token_manager

    async def async_get_access_token(self) -> str:
        """Return a valid access token."""
        if self.token_manager.is_token_valid():
            return self.token_manager.access_token

        await self.token_manager.fetch_access_token()
        await self.token_manager.save_access_token()

        return self.token_manager.access_token
```

### Sync example

If you are using `requests`, we recommend that you use the `requests_oauthlib` package. Below is an example that works with a local client ID and secret but also allows outsourcing token fetching to Home Assistant.

```python
from typing import Optional, Union, Callable, Dict

from requests import Response
from requests_oauthlib import OAuth2Session
from oauthlib.oauth2 import TokenExpiredError


class Auth:
    def __init__(
        self,
        host: str,
        token: Optional[Dict[str, str]] = None,
        client_id: str = None,
        client_secret: str = None,
        token_updater: Optional[Callable[[str], None]] = None,
    ):
        self.host = host
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_updater = token_updater

        extra = {"client_id": self.client_id, "client_secret": self.client_secret}

        self._oauth = OAuth2Session(
            auto_refresh_kwargs=extra,
            client_id=client_id,
            token=token,
            token_updater=token_updater,
        )

    def refresh_tokens(self) -> Dict[str, Union[str, int]]:
        """Refresh and return new tokens."""
        token = self._oauth.refresh_token(f"{self.host}/auth/token")

        if self.token_updater is not None:
            self.token_updater(token)

        return token

    def request(self, method: str, path: str, **kwargs) -> Response:
        """Make a request.

        We don't use the built-in token refresh mechanism of OAuth2 session because
        we want to allow overriding the token refresh logic.
        """
        url = f"{self.host}/{path}"
        try:
            return getattr(self._oauth, method)(url, **kwargs)
        except TokenExpiredError:
            self._oauth.token = self.refresh_tokens()

            return getattr(self._oauth, method)(url, **kwargs)
```

A developer will now be able to override the refresh token function to route it via their own external service.

```python
from my_package import AbstractAuth


class Auth(AbstractAuth):
    def refresh_tokens(self) -> Dict[str, Union[str, int]]:
        """Refresh and return new tokens."""
        self.token_manager.fetch_access_token()
        self.token_manager.save_access_token()

        return self.token_manager.access_token
```
