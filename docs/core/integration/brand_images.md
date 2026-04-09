---
title: "Brand images"
sidebar_label: "Brand images"
---
To help users visually identify integrations and hardware, Home Assistant shows icons and logos for integrations and hardware entities.
Icons are square images that are used in the UI when space is limited, while logos are rectangular images that are used in the integration configuration page and other places where there is more space.
Home Assistant has support for both light and dark mode images.

## How to add brand images
The way brand images are added depends on the type of integration.

### Core integrations
For core integrations, brand images are added by creating a pull request to the [brands repository].
The images should be added to a directory named after the integration domain inside the `core_integrations/` directory.
For example, brand images for the Philips Hue integration would go in `core_integrations/hue`.

:::info
These images are cached on the server side, so once a pull request is merged, the images might not be immediately available.
:::

#### Material design icons
Some integrations, like helpers, don't have a brand to represent.
In those cases, you can use icons from the Material Design Icons library by having an `icon.txt` file in the folder in `core_integrations/` with the name of the icon to use, prefixed by `mdi:`.

### Core brands
Just like core integrations, [core brands] are added by creating a pull request to the [brands repository].
The images should be added to a directory named after the brand domain inside the `core_brands/` directory.
For example, brand images for the Google brand would go in `core_brands/google`.

If the brand has the same images as one of its integrations, you can create a symlink to avoid duplication.
For example, the Samsung brand has the same images as the Samsung TV integration, so the `core_integrations/samsung_tv` directory contains symlinks to the images in `core_brands/samsung`.

### Custom integrations
Before Home Assistant 2026.3, custom integrations were also required to add their brand images to the [brands repository].
Starting with Home Assistant 2026.3, custom integrations can include their own brand images by adding a `brand/` directory inside the integration directory.
For example, if you have a custom integration with the domain `my_integration`, you can add brand images in `custom_components/my_integration/brand/`.

Local brand images take precedence over images from the [brands repository], so if a custom integration has a local `brand/` directory, Home Assistant will use those images instead of the ones from the [brands repository].

:::info
If a custom integration will be contributed to Home Assistant Core, be sure to remove the local brand images and open a PR to add them to the [brands repository] instead.
:::

[core brands]: /docs/creating_integration_brand.md
[brands repository]: https://github.com/home-assistant/brands

## How brand images are served
Brand images are served through a local API so that they are served from the same origin as the frontend.
The available API endpoints are:
- `/api/brands/integration/{domain}/{image}` - Integration icons and logos
- `/api/brands/hardware/{category}/{image}` - Hardware images

All endpoints return a generic placeholder image by default if the requested image does not exist.
To opt out and receive a 404 instead, add the `?placeholder=no` query parameter.

These endpoints require authentication. Requests can authenticate using either a standard authenticated session (Bearer token) or by passing an access token in a `token` query parameter.
The frontend obtains this access token via the `brands/access_token` WebSocket command and appends it to all brand image URLs automatically.