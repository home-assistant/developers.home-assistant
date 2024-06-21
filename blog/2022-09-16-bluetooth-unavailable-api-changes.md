---
author: J. Nick Koston
authorURL: https://github.com/bdraco
title: "Bluetooth async_track_unavailable API changes for 2022.10"
---

For Home Assistant Core 2022.10 we have changed the `async_track_unavailable` bluetooth API to send the last `BluetoothServiceInfoBleak` to the callback instead of the `address`.

Below is a new example of the usage:

```python
from homeassistant.components import bluetooth

def _unavailable_callback(info: bluetooth.BluetoothServiceInfoBleak) -> None:
    _LOGGER.debug("%s is no longer seen", info.address)
   
cancel = bluetooth.async_track_unavailable(hass, _unavailable_callback, "44:44:33:11:23:42", connectable=True)
```

