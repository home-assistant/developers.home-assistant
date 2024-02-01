---
title: "Update System"
sidebar_label: Update System
---

Home Assistant Operating System uses [RAUC](https://rauc.io/) as update system. RAUC is an image based update system designed for embedded System. It has support for multiple boot slots thus supporting A/B style update mechanism. The update system integrates with popular bootloaders such as U-Boot but also allows to integrate with custom boot flows via scripts. It uses X.509 cryptography to sign and verify update bundles.

## RAUC and Home Assistant OS

RAUC is readily available from Buildroot. The HAOS build system creates update bundles (`.raucb` files) which get uploaded along the disk image files used for initial installation. The RAUC update bundles essentially contain the kernel and system partition as well as the boot partition and for certain boards a boot image named `SPL`. The same partition images are used to generate the disk image and update bundles. All boards use a similar RAUC manifest generated from the template file at `buildroot-external/ota/manifest.raucm.gtpl`. The manifest defines the exact content of the update bundle.

RAUC has an excellent documentation at [rauc.readthedocs.io](https://rauc.readthedocs.io/) on it's own, this guide will mostly focus on practical and HAOS specific aspects of RAUC.

## Using update bundles

RAUC runs as a systemd system service on HAOS. The system service exposes a D-Bus API. The Supervisor makes use of this D-Bus API to initiate updates. The update bundles themselves get downloaded by the Supervisor and passed along to RAUC. From the RAUC system service perspective the update is a simple local update installation.

For development or testing, RAUC update bundles can be installed with the `rauc install` command from the shell. E.g. updating a particular board manually can be done with the following commands run on the HAOS shell directly:

```sh
# cd /mnt/data/
# curl -L -O https://github.com/home-assistant/operating-system/releases/download/11.5.rc3/haos_rpi5-64-11.5.rc3.raucb
# rauc install haos_rpi5-64-11.5.rc3.raucb
# reboot
```

After the reboot the system should run with the newly installed HAOS version.

## Boot slots

HAOS has two boot slots named A and B. A new installation always starts off with a single boot slot deployed (Slot A). On update, the other boot slot is being written to, and the system reboots into the other boot slot. So the first update on a newly installed system will get installed into boot slot B. Supervisor shows the boot slot with `ha os info`, on the OS shell `rauc status` command can be used to see the complete status about the two boot slots.

```sh
# rauc status
=== System Info ===
Compatible:  haos-rpi5-64
Variant:     
Booted from: kernel.0 (A)

=== Bootloader ===
Activated: kernel.0 (A)

=== Slot States ===
  [spl.0] (/dev/disk/by-partlabel/hassos-boot, raw, inactive)

  [boot.0] (/dev/disk/by-partlabel/hassos-boot, vfat, inactive)

x [kernel.0] (/dev/disk/by-partlabel/hassos-kernel0, raw, booted)
        bootname: A
        boot status: good
    [rootfs.0] (/dev/disk/by-partlabel/hassos-system0, raw, active)

o [kernel.1] (/dev/disk/by-partlabel/hassos-kernel1, raw, inactive)
        bootname: B
        boot status: good
    [rootfs.1] (/dev/disk/by-partlabel/hassos-system1, raw, inactive)
```

After an update, RAUC instructs the boot loader to boot into the other slot (e.g. with U-Boot by writing U-Boot environment variables). If the boot succeeds, the Slot is marked good and the system will continue to boot into this boot slot. Typically three attempts are made with each boot slot before reverting to the other boot slot, but the exact logic s dependent on the bootloader integration.

## Security

The HAOS RAUC update bundles are signed. HAOS has it's own PKI with development and release CAs. Currently all public builds are signed with thee release CA. The certificates are pre-installed on the OS in `/etc/rauc/keyring.pem`.

When building locally, a self-signed certificate is generated the first time a build directory is used. The certificate and it's associated private key is stored in the root of the build directory as `key.pem` and `cert.pem` (see also `buildroot-external/scripts/rauc.sh`). From that point onwards, every build is using the same self-signed certificates. This self-signed certificate is also automatically added to the keyring of the HAOS image itself. This means a HAOS installation from a locally built image can process update bundles from that same build directory.

### Updating to a development build

Updating an existing, official installation to a local, self-signed build fails with a signature verification error:

```sh
# rauc install haos_rpi5-64-11.6.dev0.raucb
installing
  0% Installing
  0% Determining slot states
 20% Determining slot states done.
 20% Checking bundle
 20% Verifying signature
 40% Verifying signature failed.
 40% Checking bundle failed.
100% Installing failed.
LastError: signature verification failed: Verify error:self signed certificate
Installing `/mnt/data/haos_rpi5-64-11.6.dev0.raucb` failed
```

However, Home Assistant Operating System isn't a locked down platform. It uses the default keyring to verify incoming updates. With root access to the OS shell it is fairly trivial to add another keyring to the keychain, and therefor update to a self-signed OS build:

```sh
# cp -r /etc/rauc/ /tmp/rauc
# cat /mnt/data/cert.pem >> /tmp/rauc/keyring.pem
# mount -o bind /tmp/rauc/ /etc/rauc/
# systemctl restart rauc
```

With this change, a local build can be installed. Installing an official update from the local build is still possible, since the self-signed certificate is appended to the keychain. Meaning the official release certificates are still accepted even for a local build. This allows to update to an official release from a local development build.