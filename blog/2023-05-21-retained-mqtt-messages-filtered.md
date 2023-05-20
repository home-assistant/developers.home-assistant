---
author: Jan Bouwhuis
authorURL: https://twitter.com/jbouwh
title: Recent MQTT changes to improve overall performance
---

The way Home Assistant's MQTT integration processes MQTT messages and how subscribes and unsubscribes are performed has changed.

### Updates were made in the way MQTT subscribes, unsubscribes are performed

Subscribes and unsubscribes are not immediately sent to the broker anymore. Debouncer code was added that will delay subscribes to the broker and bundle them when more are added within the debounce time. At the point where the actual (un)subscribes are done, the (un)subscribes are bundled into one call to the broker. These changes will speed up the MQTT integration and the startup of integrations that register a lot of MQTT entities, especially when shared topics are subscribed to (e.g. to publish the availability). In the MQTT debug logging the `mid` number shows what (un)subscribe calls have been bundled in one call to the MQTT broker.

### The way how retained messages are processed has changed

The way MQTT messages with a set `retain` flag are handled has changed such that existing subscribers are no longer passed retained messages re-sent by the broker as a result of new subscribers subscribing to the same topic. Instead, retained messages re-sent by the broker are only passed to the new subscriber.

The new behavior avoids flooding subscribers with the same retained message over and over and is also better aligned with the MQTT specification, see OASIS MQTT Version 3.1.1 spec ([on how the RETAIN flag is used](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc385349265)) and Normative Statement Number [MQTT-3.3.1-9](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718134).
