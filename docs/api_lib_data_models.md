---
title: "Python Library: Modelling Data"
sidebar_label: Modelling Data
---

Now that we have authentication going, we can start making authenticated requests and fetch data!

When modeling the data, it is important that we expose the data from the API in the same structure as that the API offers it. Some API designs might not make a lot of sense or contain typos. It is important that we still represent them in our objects. This makes it easy for developers using your library to follow the API documentation and know how it will work in your library.

API libraries should try to do as little as possible. So it is okay to represent data structures as classes, but you should not transform data from one value into another. For example, you should not implement conversion between Celsius and Fahrenheit temperatures. This involves making decisions on precisions of results and should therefore be left to the developer using the library.

For this example, we're going to model an async library for a Rest API named ExampleHub that has two endpoints:

- get `/light/<id>`: query the information of a single light.

  ```json
  {
    "id": 1234,
    "name": "Example Light",
    "is_on": true
  }
  ```

- post `/light/<id>`: control the light. Example JSON to send: `{ "is_on": false }`. Responds with the new state of the light.

- get `/lights`: return a list of all lights
  ```json
  [
    {
      "id": 1234,
      "name": "Example Light",
      "is_on": true
    },
    {
      "id": 5678,
      "name": "Example Light 2",
      "is_on": false
    }
  ]
  ```

As this API represents lights, we're first going to create a class to represent a light.

```python
from .auth import Auth


class Light:
    """Class that represents a Light object in the ExampleHub API."""

    def __init__(self, raw_data: dict, auth: Auth):
        """Initialize a light object."""
        self.raw_data = raw_data
        self.auth = auth

    # Note: each property name maps the name in the returned data

    @property
    def id(self) -> int:
        """Return the ID of the light."""
        return self.raw_data["id"]

    @property
    def name(self) -> str:
        """Return the name of the light."""
        return self.raw_data["name"]

    @property
    def is_on(self) -> bool:
        """Return if the light is on."""
        return self.raw_data["id"]

    async def async_control(self, is_on: bool):
        """Control the light."""
        resp = await self.auth.request(
            "post", f"light/{self.id}", json={"is_on": is_on}
        )
        resp.raise_for_status()
        self.raw_data = await resp.json()

    async def async_update(self):
        """Update the light data."""
        resp = await self.auth.request("get", f"light/{self.id}")
        resp.raise_for_status()
        self.raw_data = await resp.json()
```

Now that we have a light class, we can model the root of the API, which provides the entry points into the data.

```python
from typing import List

from .auth import Auth
from .light import Light


class ExampleHubAPI:
    """Class to communicate with the ExampleHub API."""

    def __init__(self, auth: Auth):
        """Initialize the API and store the auth so we can make requests."""
        self.auth = auth

    async def async_get_lights(self) -> List[Light]:
        """Return the lights."""
        resp = await self.auth.request("get", "lights")
        resp.raise_for_status()
        return [Light(light_data, self.auth) for light_data in await resp.json()]

    async def async_get_light(self, light_id) -> Light:
        """Return the lights."""
        resp = await self.auth.request("get", f"light/{light_id}")
        resp.raise_for_status()
        return Light(await resp.json(), self.auth)
```

With these two files in place, we can now control our lights like this:

```python
import asyncio
import aiohttp

from my_package import Auth, ExampleHubAPI


async def main():
    async with aiohttp.ClientSession() as session:
        auth = Auth(session, "http://example.com/api", "secret_access_token")
        api = ExampleHubAPI(auth)

        lights = await api.async_get_lights()

        # Print light states
        for light in lights:
            print(f"The light {light.name} is {light.is_on}")

        # Control a light.
        light = lights[0]
        await light.async_control(not light.is_on)


asyncio.run(main())
```
