---
title: Home Assistant Operating System
sidebar_label: Introduction
---

The Home Assistant Operating System is a purpose built operating system specifically designed to run Home Assistant on single board computers and x86-64 systems. It aims to provide a robust and maintenance free operating system to run Home Assistant.

Home Assistant Operating System (HAOS) is using the [Buildroot](https://buildroot.org/) build system. Buildroot is not a Linux distribution in the classic sense. It provides the infrastructure and build system to build a Linux distribution. Buildroot allows us to cross compile for different architectures which makes it especially useful when compiling for architectures which typically come with fewer resources such as Arm based systems. HAOS consists of a fairly regular stack of Linux and GNU software, using Linux, the GNU C library, systemd init daemon and the Docker container engine required by the Home Assistant Supervisor.

### Components

- **Bootloader:**
  - [GRUB](https://www.gnu.org/software/grub/) for devices that support UEFI
  - [U-Boot](https://www.denx.de/wiki/U-Boot) for devices that don't support EFI
- **Operating System:**
  - [Buildroot](https://buildroot.org/) build system to generate Linux distributions
- **File Systems:**
  - [SquashFS](https://www.kernel.org/doc/Documentation/filesystems/squashfs.txt) for read-only file systems (using LZ4 compression)
  - [ZRAM](https://www.kernel.org/doc/Documentation/blockdev/zram.txt) for `/tmp`, `/var` and swap (using LZ4 compression)
- **Container Platform:**
  - [Docker Engine](https://docs.docker.com/engine/) for running Home Assistant components in containers
- **Updates:**
  - [RAUC](https://rauc.io/) for Over The Air (OTA) and USB updates
- **Security:**
  - [AppArmor](https://apparmor.net/) Linux kernel security module
