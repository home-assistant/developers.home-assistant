---
title: Home Assistant Frontend Architecture
sidebar_label: Architecture
id: version-0.80.0-frontend_architecture
original_id: frontend_architecture
---

The Home Assistant frontend is built using web components. This is a modern web technology allowing us to encapsulate templates, styling and logic into a single file and expose it as an HTML tag in the browser. These componens are composable, allowing a very dynamic and powerful foundation of our application.

## Structure

The Home Assistant frontend can be broken up in 4 parts:

### Bootstrap

File: `src/entrypoints/core.js`

This is a very tiny script which is the first thing that is loaded on the page. It is responsible for checking for authentication credentials and setting up the websocket connection with the backend.

The script allows us to start downloading the data while also downloading the rest of the UI in parallel.

### App shell

File: `src/entrypoints/app.js`

This is everything that is required to render the sidebar and handle the routing.

### Panels

Folder: `src/panels/`

Each page in Home Assistant is a panel. Components can register extra panels to be shown to the user. Examples of panels are "states", "map", "logbook" and "history".

### More info dialog

Folder: `src/dialogs/more-info`

This is a dialog that allows users to see more information about an entity and control its state.

The more info dialog can be triggered from any component in the app by firing a DOM event `hass-more-info` with as detail `{ entityId: 'light.kitchen' }`.

## Data Flow

The frontend leverages the [Websocket API](external_api_websocket.md) and the [Rest API](external_api_rest.md) to interact with Home Assistant.

The data is made available as the `hass` property which is passed down to every component. The `hass` property contains the whole application state and has methods to call APIs.

We use a unidirectional data flow (like Flux, Redux). When you make a change in the backend (like turning on a light), the `hass` object will be updated at the root of the application and will be made available to every component that needs it.

## Routing

The frontend uses decentralized routing. Each component only knows enough about the routing to know how to handle the part it's responsible for. Further routing is passed down the component tree.

For example, the `<home-assistant>` main component will look at the first part of the url to decide which panel should be loaded. Each panel can have its own mapping between the url and what content to show.

For the routing, we use the [`<app-route>`](https://www.polymer-project.org/3.0/toolbox/routing) web component.

## Bundling

We use Webpack to bundle up the application. We have various gulp scripts to help with generating the icon set and the index.html.

We're aggresively code splitting our application by leveraging the dynamic import syntax (`import('path/to/some/file.js')`). When encountering an `import()`, Webpack will split the code into different chunks and makes sure that they are loaded when needed.


