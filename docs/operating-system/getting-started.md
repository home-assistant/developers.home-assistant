---
title: "Getting Started with Home Assistant Operating System Development"
sidebar_label: Getting Started
---

## Prepare Development Environment

### Check-out Source Code

The main repository located at [github.com/home-assistant/operating-system/](https://github.com/home-assistant/operating-system/) contains Buildroot customizations via the [br2-external mechanism](https://buildroot.org/downloads/manual/manual.html#outside-br-custom) as well as helper scripts and GitHub Action CI scripts. The main repository uses the Git Submodule mechanism to point to Buildroot itself. While most customizations can be done by the br2-mechanism, some modifications are made to Buildroot itself. For that reason we also maintain a fork of Buildroot under [github.com/home-assistant/buildroot/](https://github.com/home-assistant/buildroot/). The aim is to keep the amount of patches on-top of upstream Buildroot minimal.

Make sure you have `git` available and clone the main HAOS repository as follows:

```shell
git clone https://github.com/home-assistant/operating-system/
cd operating-system/
git submodule update --init
```

When you update your local git repository, make sure to also update the `buildroot` submodule. This makes sure you'll get the matching Buildroot in case it got updated as well.

```shell
git pull
git submodule update
```

To get back to a pristine state, use the following two commands (this deletes all local modifications!)

```shell
git reset --hard
git submodule update --init --force
```

### Install prerequisites

HAOS is using build containers to run Buildroot. Install the Docker container engine and make sure you have a working `docker` command which allows to run privileged containers. The build scripts are meant to be run as user, but some commands use privileges, hence a working `sudo` command is required as well.

While Buildroot can run on most Linux distributions natively, its strongly recommended to use the Debian based build container. This allows for a stable and known build environment with all dependencies pre-installed.

:::info
The build container needs to get started with privileges since at some point during the build process a new loopback device-backed filesystem image will be mounted inside a Docker container. Hence rootless containers won't work to build HAOS.
:::

## Build Images using Build Container

The script `scripts/enter.sh` builds the build container image and starts a container using that image. Arguments passed to the script get executed inside the container.

HAOS uses a configuration file for each supported target. To build for a specific target (board), the configuration file needs to be passed to `make`. The configuration files are stored in `buildroot-external/configs/`. Note that the ending `_defconfig` will be appended automatically and *must not* be passed to `make`. E.g. to build the Raspberry Pi 4 64-bit configuration `buildroot-external/configs/rpi4_64_defconfig` use the following command:

```
$ sudo scripts/enter.sh make rpi4_64
Sending build context to Docker daemon  159.7kB
Step 1/8 : FROM debian:bullseye
 ---> a178460bae57
[...]
Successfully built 11d679ac51be
Successfully tagged hassos:local
[...]
/usr/bin/make -C /build/buildroot O=/build/output BR2_EXTERNAL=/build/buildroot-external "rpi4_64_defconfig"
[...]
```

This invokes make using the `Makefile` in the root of the source repository inside the container. This makefile in turn invokes Buildroot's makefile.

Depending on the speed of your machine the build process takes 0.5 to 1h. The build files (object files, intermediate binaries etc.) are stored in the folder `output/` (used to be in `buildroot/output/` in rel-6 and older branches). The final image files are stored in the `release/` directory.

### Rebuild packages

Buildroot uses packages like a regular distribution. But instead of just downloading a pre-built package, Buildroot packages download the source files and compile the binaries directly. Buildroot remembers which package has been built already. This makes the second build much faster, since only the final image gets regenerated. If you want to force Buildroot to rebuild a particular package, just delete it from the `output/build/` directory:

```shell
rm -rf output/build/linux-custom/
```

:::tip
You can check `output/build/packages-file-list.txt` to learn which file in the final image belongs to what package. This makes it easier to find the package you would like to change.
:::

### Build for Multiple Targets

To build for multiple targets in a single source directory, separate output directories must be used. The output directory can be specified with the `O=` argument. A recommended pattern is to just use an output directory named after the targets configuration file:


```shell
sudo scripts/enter.sh make O=output_rpi4_64 rpi4_64
```

### Use the Build Container Interactively

If no argument to `scripts/enter.sh` is passed, a shell will be presented.

```bash
$ sudo scripts/enter.sh
Sending build context to Docker daemon  159.7kB
Step 1/8 : FROM debian:bullseye
 ---> a178460bae57
[...]
builder@c6dfb4cd4036:/build$ 
```

From this shell, the same build above could be started using `make O=output_rpi4_64 rpi4_64`.

This allows to invoke other Buildroot targets, e.g. to [graph dependencies between packages](https://buildroot.org/downloads/manual/manual.html#_graphing_the_dependencies_between_packages). To use other Buildroot targets, make sure to change to the `buildroot/` directory and execute commands from there

```bash
builder@c6dfb4cd4036:/build$ cd buildroot/
builder@c6dfb4cd4036:/build$ make O=../output_rpi4_64 graph-depends
Getting dependency tree...
dot  -Tpdf \
        -o /build/output_rpi4/graphs/graph-depends.pdf \
        /build/output_rpi4/graphs/graph-depends.dot
builder@c6dfb4cd4036:/build$
```

## Use Qemu to Test Images

The target OVA (Open Virtual Appliance) contains images for various virtual machines. One of the image format is QCOW2, the native image format for QEMU. It can be used to test a new HAOS build using QEMU.

Since HAOS requires UEFI support, this is slightly more tricky than with "classic"(/legacy) MBR-based images. On a *Debian* host install the [ovmf package](https://packages.debian.org/stable/ovmf) which provides the "UEFI firmware for 64-bit x86 virtual machines". That package will install a **TianoCore**-derived QEMU UEFI image at `/usr/share/OVMF/OVMF_CODE.fd`, which can be used with QEMU to boot the generated QCOW2 image.

```bash
$ sudo scripts/enter.sh make O=output_ova ova
[...]
$ unxz release/haos_ova-7.0.dev20211003.qcow2.xz
$ qemu-system-x86_64 -enable-kvm -name haos -smp 2 -m 1G -drive file=release/haos_ova-7.0.dev20211003.qcow2,index=0,media=disk,if=virtio,format=qcow2 -drive file=/usr/share/ovmf/x64/OVMF_CODE.fd,if=pflash,format=raw,readonly=on
```

This will show QEMU's SDL interface and should boot Home Assistant Operating System. Once the boot completes and the Home Assistant CLI prompt `ha > ` is shown, you can use `login` to access the root shell.

## Create a pull request for review

Once you are happy with your changes create a separate git branch and commit them. Try to describe *why* you think that change is important and should be applied to HAOS. E.g "update kernel" is also obvious from the changes itself. The maintainer is more interested why you think the kernel should be updated. The *why* can be fairly trivial (update kernel to make sure we keep up with latest changes), or it can have some interesting details (update kernel since this latest version fixes ethernet on board xy).

Create a fork of the upstream [github.com/home-assistant/operating-system](https://github.com/home-assistant/operating-system) repository (if you haven't already) and push your branch to your forked GitHub repository. Then open a new pull request. All changes should be made against the development branch `dev`. If you like your change in the next stable release, add the `rel-x` label so it is marked for backporting.
