---
title: "Board metadata"
sidebar_label: Metadata
---

Each supported board has Home Assistant Operating System (HAOS) specific metadata file named `meta`. This documents the variables and the available options.

## Board specific variables

`BOARD_ID`:

Board identifier. Typically all lower case. Required to generate the file name and used as `VARIANT_ID` in the os-release file.

`BOARD_NAME`:

User friendly board name. Used in the `VERSION` and `VARIANT` variable in the os-release file.

## Boot related variables

`BOOT_ENV_SIZE`:

Maximum size of the boot loader environment (in hex). Required for rauc.

`BOOT_SYS`:

- efi
- hybrid
- mbr

HAOS is trying to use GPT whenever possible. To use GPT the second logical block (LBA) needs to be available. On some boards this block is reserved/required by the boot firmware. If that is the case the class MBR approach needs to be used.

Hybrid uses both partition tables in case GPT can be used, but lower level firmware still requires MBR.

`BOOT_SPL`:

- true
- false

Enable SPL (secondary program loader) handling. Some U-Boot targets generate a small loader (SPL) besides the main U-Boot binary.

`BOOTLOADER`:

- grub
- uboot

HAOS uses mainly [U-Boot](https://www.denx.de/wiki/U-Boot). For UEFI systems [GRUB](https://www.gnu.org/software/grub/) is used.

`DISK_SIZE`:

Default 2. Size of the final (uncompressed) image in GB.

`KERNEL_FILE`:

File name of the kernel binary. Typically `Image` for aarch64, `zImage` for `armv7` and `bzImage` for `amd64`.

## Supervisor related variables

`SUPERVISOR_MACHINE`:

- generic-x86-64
- khadas-vim3
- odroid-c2
- odroid-c4
- odroid-n2
- odroid-xu
- qemuarm
- qemuarm-64
- qemux86
- qemux86-64
- raspberrypi
- raspberrypi2
- raspberrypi3
- raspberrypi4
- raspberrypi3-64
- raspberrypi4-64
- tinker

`SUPERVISOR_ARCH`:

- amd64
- i386
- armhf
- armv7
- aarch64

