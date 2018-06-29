---
title: "Type Of Cards"
sidebar_label: Cards
---

These cards are WIP and things may change.

## Camera preview

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `camera-preview`
| entity | string | **Required** | Entity id of `camera` domain

## Column

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `column`
| cards | list | **Required** | List of cards

## Entities

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `entities`
| entities | list | **Required** | Entity id's
| title | string | Optional | Card title
| show_header_toggle | boolean | true | Button to turn on/off all entities

## Entity filter

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `entity-filter`
| filter | list | **Required** | See filter description
| card | object | `{'type': 'entities'}` | Extra options to pass down to the card rendering the result.

Filter options:

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| domain | string | Optional | Filter all entities that match the domain
| state | string | Optional | Match entities that match state. Note, in YAML, make sure you wrap it in quotes to make sure it is parsed as a string.
| entity_id | string | Optional | Filter entities by id, supports wildcards (`*living_room*`)

## Glance

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `glance`
| entities | list | **Required** | Entity id's or `{'entity': ''entity_id', 'title': 'title'}`
| title | string | Optional | Card title

## History graph

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `history-graph`
| entity | string | **Required** | Entity id of `history_graph` domain
| hours_to_show | integer | 24 | Hours to show
| refresh_interval | integer | 0 | Refresh interval in seconds

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

## Picture elements

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `picture-elements`
| image | string | **Required** | URL of an image
| elements | list | **Required** | List of elements
| title | string | Optional | Card title

Element types:

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `state-badge`
| entity | string | **Required** | Entity id
| style | object | **Required** | See "Style options"
| tap_action | string | more-info | Set to `toggle` to change state

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `state-text`
| entity | string | **Required** | Entity id
| style | object | **Required** | See "Style options"

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `service-button`
| service | object | **Required** | `{'domain': 'light', 'service': 'turn_on', 'data': {'entity_id': 'light.floor'}}`
| style | object | **Required** | See "Style options"
| title | string | optional | Button label


Style options (CSS):

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| left | string | **Required** | Position from left, `25%`
| top | string | **Required** | Position from top, `50%`
| ... | string | inherit | ...
| "--paper-item-icon-color" | string | inherit | Badge-icon off-color, `green`

## Picture entity

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `picture-entity`
| entity | string | **Required** | Entity id to control via picture.
| image | string | optional| URL of an image.
| state_image | object | optional| `{'on': '/on.png', ... 'default': '/default.png'}`
| title | string | Optional | Card title

## Picture glance

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `picture-glance`
| image | string | **Required** | URL of an image
| entities | list | **Required** | Entity id's
| title | string | Optional | Card title

## Plant info

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `plant-status`
| entity | string | **Required** | Entity id of `plant` domain

## Row

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `row`
| cards | list | **Required** | List of cards

## Weather forecast

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `weather-forecast`
| entity | string | **Required** | Entity id of `weather` domain
