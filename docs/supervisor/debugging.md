---
title: "Debugging the Home Assistant Supervisor"
sidebar_label: Debugging
---

The following debug tips and tricks are for developers who are running the Home Assistant image and are working on the base image. If you use the generic Linux installer script, you should be able to access your host and logs as per your host.

## Debug Supervisor

Before you will be able to use the Python debugger you need to enable the debug
option in Supervisor:

```shell
ha su options --debug=true
ha su reload
```

If you are running Supervisor on a remote host, you won't be able to access the
Supervisor container directly. The "Remote ptvsd debugger" add-on (available
from the [Development Add-On Repository](https://github.com/home-assistant/addons-development)
exposes the debugging port on your host IP address allowing to debug the
Supervisor remotely.

Below you will find an example Visual Studio Code configuration to attach a Python debugger to the Home Assistant Supervisor. This configuration is intended as the default by Run> Start Debugging or pressing F5. You will need to change "IP" to match your Supervisor's IP within the Docker environment (use `ip addr` within the Supervisor container) or the host IP if you debug remotely.

`.vscode/launch.json`
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Supervisor remote debug",
            "type": "python",
            "request": "attach",
            "port": 33333,
            "host": "IP",
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}",
                    "remoteRoot": "/usr/src/hassio"
                }
            ]
        }
    ]
}
```
