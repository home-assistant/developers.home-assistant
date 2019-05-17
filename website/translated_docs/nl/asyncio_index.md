---
title: "Asynchronous Programming"
sidebar_label: Introduction
---

On September 29, 2016 we released [Home Assistant 0.29](https://www.home-assistant.io/blog/2016/09/29/async-sleepiq-emoncms-stocks/) as part of our bi-weekly release schedule. This release introduced a complete overhaul of the core spearheaded by [Ben Bangert](https://github.com/bbangert/).

The old core was set up like a “traditional” threaded application. Each resource that was not thread safe (ie. the state of entities) would be protected by a lock. This caused a lot of waiting and potential inconsistency because a task could now end up waiting halfway through its job until some resource got freed.

Our new core is based on Python’s built-in **asyncio** module. Instead of having all threads have access to the core API objects, access is now limited to a special thread called the *event loop*. All components will now schedule themselves as a task to be executed by the event loop. This gives us the guarantee that only a single task is executed at the same time, meaning we no longer need any locks.

The only problem with running everything inside the event loop is when a task does blocking I/O; something most third-party Python libraries do. For example, while requesting new information from a device, the core will stop running until we get a response from the device. To handle this, a task is able to suspend itself until the response is available, after which it will be enqueued in the event loop to process the result.

For a task to be able to suspend itself, all code that it calls must support this capability. In practice, this would mean that each device integration will need a full rewrite of the library that offers the integration! As this is something that cannot be achieved, ever, a 100% backwards compatible API has been added so that no platform will require updating.

The backwards compatible API schedules a task in a different thread and blocks that thread until the task has been processed by the event loop.