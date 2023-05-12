---
author: Jan Bouwhuis
authorURL: https://twitter.com/jbouwh
title: Recent MQTT changes to improve overall performance
---

The way Home Assistant's MQTT integration processes MQTT messages and how subscribes and unsubscribes are performed has changed.

### Updates were made in the way MQTT subscribes, unsubscribes are performed

Subscribes and unsubscribes are not immediately sent to the broker anymore. Debouncer code was added that will delay subscribes to the broker and bundle them when more are added within the debounce time. At the point where the actual (un)subscribes are done, the (un)subscribes are bundled in one call to the broker. These changes will speed up the MQTT integration and the startup of integrations that register a lot of MQTT entities, especially when shared topics are subscribed to (e.g. to publish the availability). In the MQTT debug logging the `mid` number shows what (un)subscribe calls have been bundled in one call to the MQTT broker.

### The way how retained messages are processed has changed

The way how MQTT messages with a `retain` flag are handled has changed. Basically a retain flag is added to a received message when we are (re)subscribing to the broker and retained messages are available. The broker will replay these payloads directly after (re)subscribing. Also when the connection was lost, and we are reconnecting, the same behavior is seen. When there are multiple subscriptions that subscribe to the same topic, all shared subscriptions are receiving the retained messages. Up until this point the behavior has not changed.
When another subscription with `shared` topic(s) is added, we will resubscribe to the broker to ensure we receive any retained messages for that new subscription. Existing subscriptions (that already received a retained payload and were initialized earlier) will no longer receive the replayed retained payload triggered by the new subscribes. This will improve performance.

> After replaying retained message the broker will send updates without a `retain` flag even when the remote client published with a `retain` flag, hence we cannot tell if that update was `retained`. See OASIS MQTT Version 3.1.1 spec ([on how the RETAIN flag is used](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc385349265)) and Normative Statement Number [MQTT-3.3.1-9](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718134).
