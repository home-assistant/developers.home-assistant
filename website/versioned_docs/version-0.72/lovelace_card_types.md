---
title: Type Of Cards
sidebar_label: Cards
id: version-0.72-lovelace_card_types
original_id: lovelace_card_types
---

These cards are WIP and things may change.

## Camera preview

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `camera-preview`
| entity | string | **Required** | Entity id of `camera` domain

## Entities

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `entities`
| entities | list | **Required** | Entity id's
| title | string | Optional | Card title

## Entity filter

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `entity-filter`
| filter | list | **Required** | See filter description
| card_config | object | `None` | Extra options to pass down to the card rendering the result.
| card | string | `entities` | Card to use to render the result. Follows same rules as card type.

Filter options:

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| domain | string | Optional | Filter all entities that match the domain
| state | string | Optional | Match entities that match state. Note, in YAML, make sure you wrap it in quotes to make sure it is parsed as a string.
| entity_id | string | Optional | Filter entities by id, supports wildcards (`*living_room*`)

## Entity picture

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `entity-picture`
| image | string | **Required** | URL of an image.
| entity | string | **Required** | Entity id to control via picture.

## Glance

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `glance`
| entities | list | **Required** | Entity id's
| title | string | Optional | Card title

## History graph

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `history-graph`
| entity | string | **Required** | Entity id of `history_graph` domain

## Iframe

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `iframe`
| url | string | **Required** | iframe source url
| aspect_ratio | string | `"50%"` | Iframe height-width-ratio
| title | string | Optional | Card title

## Markdown

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `markdown`
| content | string | **Required** | Content to render as [markdown](http://commonmark.org/help/).
| title | string | Optional | Card title

## Media controller

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `media-control`
| entity | string | **Required** | Entity id of `media_player` domain

## Picture glance

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `picture-glance`
| image | string | **Required** | URL of an image.
| entities | list | **Required** | Entity id's
| title | string | Optional | Card title

## Plant info

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `plant-status`
| entity | string | **Required** | Entity id of `plant` domain

## Weather forecast

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `weather-forecast`
| entity | string | **Required** | Entity id of `weather` domain
