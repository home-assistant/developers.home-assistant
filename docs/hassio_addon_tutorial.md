---
title: "Tutorial: Making your first add-on"
---

So you've got Home Assistant going and you've been enjoying the built-in add-ons but you're missing this one application. Time to make your own add-on! In Hass.io 0.24 we introduced the option to have local add-ons be build on your device. This is great for developing new add-ons locally.

To get started with developing add-ons, we first need access to where Hass.io looks for local add-ons. For this you can use the Samba add-on or the SSH add-on.

For Samba, once you have enabled and started it, your Hass.io instance will show up in your local network tab and share a folder called "addons". This is the folder to store your custom add-ons.

If you are on macOS and the folder is not showing up automatically, go to Finder and press CMD+K then enter 'smb://hassio.local'

![Screenshot of Windows Explorer showing a folder on the Hass.io server](/img/en/hass.io/tutorial/samba.png)

For SSH, you will have to install it. Before you can start it, you will have to have a private/public key pair and store your public key in the add-on config ([see docs for more info][ssh]). Once started, you can SSH to Hass.io and store your custom add-ons in "/addons".

![Screenshot of Putty connected to Hass.io](/img/en/hass.io/tutorial/ssh.png)

Once you have located your add-on directory, it's time to get started!

[ssh]: https://www.home-assistant.io/addons/ssh/

## Step 1: The basics

 - Create a new directory called `hello_world`
 - Inside that directory create three files.

`Dockerfile`:
```
ARG BUILD_FROM
FROM $BUILD_FROM

ENV LANG C.UTF-8

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
```

`config.json`:
```json
{
  "name": "Hello world",
  "version": "1",
  "slug": "hello_world",
  "description": "My first real add-on!",
  "arch": ["armhf", "armv7", "aarch64", "amd64", "i386"],
  "startup": "before",
  "boot": "auto",
  "options": {},
  "schema": {}
}
```

`run.sh`:
```bash
echo Hello world!
```
Make sure your editor is using UNIX-like line breaks (LF), not Dos/Windows (CRLF).

## Step 2: Installing and testing your add-on

Now comes the fun part, time to open the Hass.io UI and install and run your add-on.

 - Open the Home Assistant frontend
 - Go to the Hass.io panel
 - On the top right click the shopping basket to go to the add-on store.

![Screenshot of the Hass.io main panel](/img/en/hass.io/screenshots/main_panel_addon_store.png)

 - On the top right click the refresh button
 - You should now see a new card called "Local" that lists your add-on!

![Screenshot of the local repository card](/img/en/hass.io/screenshots/local_repository.png)

 - Click on your add-on to go to the add-on details page.
 - Install your add-on
 - Start your add-on
 - Refresh the logs of your add-on, you should now see "Hello world!" in your logs.

![Screenshot of the add-on logs](/img/en/hass.io/tutorial/addon_hello_world_logs.png)

### I don't see my add-on?!

Oops! You clicked refresh in the store and your add-on didn't show up. Or maybe you just updated an option, clicked refresh and saw your add-on disappear.

When this happens, it means that your `config.json` is invalid. It's either invalid JSON or one of the specified options is incorrect. To see what went wrong, go to the Hass.io panel and in the supervisor card click on "View logs". This should bring you to a page with the logs of the supervisor. Scroll to the bottom and you should be able to find the validation error.

Once you fixed the error, go to the add-on store and click refresh again.

## Step 3: Hosting a server

Until now we've been able to do some basic stuff, but it's not very useful yet. So let's take it one step further and host a server that we expose on a port. For this we're going to use the built-in HTTP server that comes with Python 3.

To do this, we will need to update our files as follows:

 - `Dockerfile`: Install Python 3
 - `config.json`: Make the port from the container available on the host
 - `run.sh`: Run the Python 3 command to start the HTTP server

Add to your `Dockerfile` before `RUN`:

```
# Install requirements for add-on
RUN apk add --no-cache python3

# Python 3 HTTP Server serves the current working dir
# So let's set it to our add-on persistent data directory.
WORKDIR /data
```

Add "ports" to `config.json`. This will make TCP on port 8000 inside the container available on the host on port 8000.

```json
{
  "name": "Hello world",
  "version": "0.2",
  "slug": "hello_world",
  "description": "My first real add-on!",
  "arch": ["armhf", "armv7", "aarch64", "amd64", "i386"],
  "startup": "before",
  "boot": "auto",
  "options": {},
  "schema": {},
  "ports": {
    "8000/tcp": 8000
  }
}
```

Update `run.sh` to start the Python 3 server:

```
python3 -m http.server 8000
```

## Step 4: Installing the update

Since we updated the version number in our `config.json`, Home Assistant will show an update button when looking at the add-on details. You might have to refresh your browser or click the refresh button in the add-on store for it to show up. If you did not update the version number, you can also uninstall and install the add-on again. After installing the add-on again, make sure you start it.

Now navigate to [http://hassio.local:8000](http://hassio.local:8000) to see our server in action!

![Screenshot of the file index served by the add-on](/img/en/hass.io/tutorial/python3-http-server.png)

## Bonus: Working with add-on options

In the screenshot you've probably seen that our server only served up 1 file: `options.json`. This file contains the user configuration for this add-on. Because we specified an empty "config" and "schema" in our `config.json`, the file is currently empty.

Let's see if we can get some data into that file!

To do this, we need to specify the default options and a schema for the user to change the options.

Change the options and schema entries in your `config.json` with the following:

```json
{
  …

  "options": {
    "beer": true,
    "wine": true,
    "liquor": false,
    "name": "world",
    "year": 2017
  },
  "schema": {
    "beer": "bool",
    "wine": "bool",
    "liquor": "bool",
    "name": "str",
    "year": "int"
  },

  …
}
```

Refresh the add-on store and re-install your add-on. You will now see the options available in the add-on config screen. When you now go back to our Python 3 server and download `options.json`, you'll see the options you set. [Example of how options.json can be used inside `run.sh`](https://github.com/home-assistant/hassio-addons/blob/master/mosquitto/run.sh#L4-L6)
