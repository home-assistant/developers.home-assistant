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

## Entities

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `entities`
| entities | list | **Required** | Entity id's
| title | string | `None` | Card title

## Entity filter

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `entitiey-filter`
(wip: check introduction meanwhile)

## History graph

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `history-graph`
| entity | string | **Required** | Entity id of `history_graph` domain

## Media controler

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `media-control`
| entity | string | **Required** | Entity id of `media_player` domain

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
