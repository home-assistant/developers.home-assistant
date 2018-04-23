# Core Architecture

The Home Assistant core is responsible for Home Control. Home Assistant contains four parts which make this possible:

 * **Event Bus**: facilitates the firing and listening of events -- the beating heart of Home Assistant.
 * **State Machine**: keeps track of the states of things and fires a `state_changed` event when a state has been changed.
 * **Service Registry**: listens on the event bus for `call_service` events and allows other code to register services.
 * **Timer**: sends a `time_changed` event every 1 second on the event bus.

![Home Assistant core architecture](ha_architecture.svg)
