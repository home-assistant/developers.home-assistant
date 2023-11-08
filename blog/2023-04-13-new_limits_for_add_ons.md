---
author: Stefan Agner
authorURL: https://github.com/agners
title: New limits for Supervisor Add-ons
---

With Home Assistant OS 10, we update to the latest Docker release 23.0. With the
new Docker version the maximum number of open file descriptors for add-ons
changed to infinity (sort of).

If you are an add-on developer and experience out-of-memory issues on Home
Assistant OS 10, you can apply the old limit by using `ulimit -n 1048576` before
starting your service.

Background: During Home Assistant OS release candidate phase, the higher limit turned out to
be problematic for several add-ons (Node-RED, Network UPS Tools, and the EMQX
MQTT broker, see [Home Assistant OS issue #2438](https://github.com/home-assistant/operating-system/issues/2438)).
In all cases, the problems manifested as an out-of-memory error,
where it worked on the same hardware as the previous Home Assistant OS release. Also
in all three cases, memory got allocated dynamically depending on the number of
open file descriptors allowed (which can be determined via `prlimit64` syscall,
which returns a limit of 1073741816).

We considered returning to the old limit; however, according to the change
in the Docker (moby) repository using infinity as a limit has less overhead.
Therefore we decided to stick with the new default.