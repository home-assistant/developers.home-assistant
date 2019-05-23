---
title: "Arquitectura de Hass.io"
sidebar_label: Hass.io
---

![Architecture overview of Hass.io](/img/en/architecture/hassio.png)

## Control de l'amfitrió (HC)

És un procés dimoni (deamon) que s'executa a la màquina amfitrió que permet al supervisor tenir el control d'algunes parts del sistema operatiu:

- Control d'alimentació (reinici i apagada)
- Gestió de la configuració de la xarxa
- Actualitzacions locals

## Amfitrió

Les nostres imatges pre-configurades estan basades en [HassOS](https://github.com/home-assistant/hassos) el qual està basat en [BuildRoot](https://buildroot.org/). Qualsevol màquina amb Linux pot ésser convertida en un amfitrió/servidor Hass.io utilitzant [l'instal·lador](https://www.home-assistant.io/hassio/installation/#alternative-install-on-generic-linux-server).

## Supervisor

El supervisor proporciona una API per gestionar l'amfitrió i per executar els contenidors de Docker.

## Panell de configuració

El panell de configuració s'executa dins del supervisor però s'hi pot accedir a través de la interfície d'usuari de Home Assistant. El panell de configuració permet a l'usuari gestionar la instal·lació.