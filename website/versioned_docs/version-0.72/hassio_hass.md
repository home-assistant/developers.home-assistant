---
title: Hass.io <> Home Assistant integration development
sidebar_label: HASS Integration development
id: version-0.72-hassio_hass
original_id: hassio_hass
---

These steps will help you connect your local Home Assistant to a remote Hass.io instance. You can then make changes locally to either the Hass.io component or the frontend and test it out against a real instance.

For this guide, we're going to assume that you have an Hass.io instance up and running. If you don't, you can use the generic installation method to install it inside a [virtual machine](https://github.com/home-assistant/hassio-build/tree/master/install#install-hassio).

## SSH Access

To develop for the frontend, we're going to need SSH access to the host machine.

- If you're using a standard Hass.io installation, check [these instructions](hassio_debugging.md#ssh-access-to-the-host).
- If you're using the generic installer on a VM, setup port forwarding from the virtual machine port 22 to port 10022 on the host. You can then connect to it using `ssh your-username@127.0.0.1 -p 10022`.
- If you're using the generic installer on your own machine, check the manual for your operating system.

## Getting connection details

To connect to a remote Hass.io from Home Assistant, we need two pieces of information: the location where the supervisor API is running and an auth token to connect to it.

To get these info, do the following steps:

 - SSH into the Hass.io host machine (this is not the SSH add-on!)
 - If you're using a generic installation, run `sudo bash` to change to root.
 - Run `docker inspect homeassistant | grep HASSIO`. The output should contain a value for `HASSIO` and `HASSIO_TOKEN`. `HASSIO` should be an ip address and `HASSIO_TOKEN` is a string with random letters/numbers.
 - Disconnect the SSH session.

 ## Having Home Assistant connect to remote Hass.io

 The connection with the supervisor is hidden inside the host and is only accessible from applications running on the host. So to make it accessible for our Home Assistant instance, we will need to route the connection to our computer running Home Assistant. We're going to do this by forwarding ports via an SSH connection.

We are going to SSH from our machine running Home Assistant into the remote Hass.io host. We're going to configure our SSH connection to forward all local connections to localhost port 10081 to be sent from the Hass.io host to the IP address that we got as `HASSIO` value in the last step.

> These instructions are for non-Windows systems

We can setup port forwarding from the Hass.io machine to our machine by adding the following line to the SSH command: `-L10081:<HASSIO VALUE>:80`. For example, if the value of HASSIO was `172.30.32.2` and you run Hass.io generic installer via a VM, the command would look like this:

```bash
ssh paulus@127.0.0.1 -p 10022 -L10081:172.30.32.2:80
```

As long as the terminal window with the SSH connection is open, the port forwarding will remain active.

Now let's open a new terminal window and start Home Assistant.

First, make sure Home Assistant will load the Hass.io component by adding `hassio:` to your `configuration.yaml` file. Next, we will need to tell Hass.io component how to connect to the remote Hass.io instance, we do this by setting the `HASSIO` and `HASSIO_TOKEN` environment variables when starting Home Assistant. Note that the `HASSIO` value is not the same as the one that we saw above.

```bash
HASSIO=127.0.0.1:10081 HASSIO_TOKEN=<VALUE OF HASSIO_TOKEN> hass
```

Voila. Your local Home Assistant installation will now connect to a remote Hass.io instance.

## Frontend development

> This requires Home Assistant 0.71 or later.

We need a couple more steps to do frontend development. First, make sure you have a Home Assistant frontend development set up ([instructions](frontend_index.md)).

Update the Hass.io component configuration in your `configuration.yaml` to point at the frontend repository:

```yaml
# configuration.yaml
hassio:
  development_repo: /home/paulus/dev/hass/home-assistant-polymer
```

To build a local version of the Hass.io panel, go to the frontend repository and run:

```bash
cd hassio
script/build_hassio
```

Now start Home Assistant as discussed in the previous section and it will now connect to the remote Hass.io but show your local frontend.

We're currently transitioning in how we're building the frontend so we don't have an incremental development mode just yet. For now, after making a local change, run `script/build_hassio` again.
