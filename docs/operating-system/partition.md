---
title: "Partitioning"
sidebar_label: Partitions
---

The Home Assistant Operating System (HAOS) partition layout is a bit different from what is typically used on a Linux system.

## Partition Table

HAOS prefers GPT (GUID Partition Table) whenever possible. Boot ROMs of some SoCs don't support GPT, in that case a hybrid GPT/MBR is used if possible and legacy MBR otherwise (see also [Metadata](board-metadata.md) documentation).

## Partitions

```text
-------------------------
|       Boot            |
-------------------------
|       Kernel A        |
-------------------------
|       System A        |
|                       |
-------------------------
|       Kernel B        |
-------------------------
|       System B        |
|                       |
-------------------------
|       Bootstate       |
-------------------------
|       Overlay         |
|                       |
...

-------------------------
|       Data            |
|                       |
|                       |
-------------------------
```

### System partitions

The boot partition is typically a FAT partition and contains system specific content to enable booting. On x86-64 systems this is the EFI system partition containing Barebox.

Next two versions of the Linux kernel and the main operating systems are stored (Kernel A/B and System A/B, a total of 4 partitions). This allows the system to fall back to the previous release in case booting on the new release fails (A/B update method). The system partitions are only written to during an update and are read-only under regular operation.

The overlay partition is used to store certain operating system level settings (such as networking settings). The file system label `hassos-overlay` is used to find and mount this partition.

### Data partition

The data partition is the main partition containing all containers (Supervisor/Core/Plug-Ins and Add-Ons) as well as user data. It has by far the most I/O operations and hence benefits most if mounted on a fast storage (via the data disk feature) device. It is mounted to `/mnt/data`, and some subdirectories are bind mounted to other places (like `/var/lib/docker`). The file system label `hassos-data` is used to find and mount this partition.

On a fresh installation, the data partition contains the latest version (at build time) of the Supervisor and its Plug-Ins. There is no Home Assistant Core pre-installed, instead a smaller landing page. The Supervisor downloads the latest version of Home Assistant Core on first boot. This makes sure that users start with the latest version of Home Assistant Core after starting the HAOS the first time.

The data disk feature makes use of the fact that HAOS uses the `hassos-data` label: The feature prepares the disk by partitioning it and creating a file system with the label `hassos-data-external`. On reboot the file system utility `dumpe2fs` is used to move all data from the existing `hassos-data` partition to the new partition. Finally the file system label of the existing data partition is changed to `hassos-data-old` (to avoid getting mounted again) and the new data partition on the data disk to `hassos-data`.
