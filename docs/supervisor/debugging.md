---
title: "Debugging the Home Assistant Supervisor"
sidebar_label: Debugging
---

The following debug tips and tricks are for developers who are running the Home Assistant image and are working on the base image. If you use the generic Linux installer script, you should be able to access your host and logs as per your host.

## Debug Supervisor

Below you will find an example Visual Studio Code configuration to attach a Python debugger to the Home Assistant Supervisor.  This configuratrion is intended as the default by Run> Start Debugging, or pressing F5.  You will need to change "IP" to match your Supervisor IP within the Docker environment.  This can be detected from within docker by running the command `ip addr`

.vscode/launch.json
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
