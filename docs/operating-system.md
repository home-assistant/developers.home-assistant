---
title: Home Assistant Operating System
sidebar_label: Introduction
---

The Home Assistant Operating System is a purpose built operating system specifically designed to run Home Assistant on single board computers and x86-64 systems. It aims to provide a robust and maintenance free operating system to run Home Assistant.

Home Assistant Operating System (HAOS) is being built using the [Buildroot](https://buildroot.org/) build system. Buildroot is not a Linux distribution in the classic sense, but more like a meta-distribution which provides the infrastructure and build system to build your own distribution (in our case HAOS). Buildroot allows to cross compile HAOS for different architectures which makes it especially useful when compiling for architectures which typically come with fewer resources such as Arm based systems. HAOS consists of a fairly regular stack of Linux and GNU software, using Linux, the GNU C library, systemd init daemon and the Docker container engine required by the Home Assistant Supervisor.
