---
title: "Frontend architecture"
sidebar_label: "Architecture"
---

The Home Assistant frontend is built using web components. This is a modern web technology allowing us to encapsulate templates, styling and logic into a single file and expose it as an HTML tag in the browser. These components are composable, allowing a very dynamic and powerful foundation of our application.

## Structure

The Home Assistant frontend can be broken up in 4 parts:

### Bootstrap

File: `src/entrypoints/core.ts`

This is a very tiny script which is the first thing that is loaded on the page. It is responsible for checking for authentication credentials and setting up the websocket connection with the backend.

The script allows us to start downloading the data while also downloading the rest of the UI in parallel.

### App shell

File: `src/entrypoints/app.ts`

This entry point loads the `<home-assistant>` root element and the global styles. The root element is implemented in `src/layouts/home-assistant.ts`. It initializes the application state, handles top-level navigation, and renders `src/layouts/home-assistant-main.ts`.

The main layout renders the sidebar and passes the active route to the panel resolver, which loads and displays the requested panel.

### Panels

Folder: `src/panels/`

Each page in Home Assistant is a panel. Components can register extra panels to be shown to the user. Examples of panels are "states", "map", "logbook" and "history".

### Dialogs

Folder: `src/dialogs`

Certain information and data entry is presented to users in flows. Dialogs can be triggered on any page. The most common one is the entity more info dialog, which allows users to dig into an entity's state, history, and settings.

## Data flow

The frontend leverages the [WebSocket API](/docs/api/websocket) and the [REST API](/docs/api/rest) to interact with Home Assistant.

The data is made available as the `hass` property which is passed down to every component. The `hass` property contains the core state and has methods to call APIs.

Components that only need part of the Home Assistant state should consume the relevant [Lit context](data.md#context) instead.

Components can subscribe to information that is not available in the core state. Subscriptions run through the websocket API which keeps the data in sync with the backend.

We use a unidirectional data flow. When you make a change in the backend (like turning on a light), the `hass` object will be updated at the root of the application and will be made available to every component that needs it.

## Routing

The frontend uses decentralized routing. Each component only knows enough about the routing to know how to handle the part it's responsible for. Further routing is passed down the component tree.

For example, the `<home-assistant>` main component will look at the first part of the url to decide which panel should be loaded. Each panel can have its own mapping between the url and what content to show.
