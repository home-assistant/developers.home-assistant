---
title: "Maintenance"
---

This page documents a couple of points for maintaining the Home Assistant code. Most of the tasks don't need to be performed on a regular base thus the steps, used tools, or details are preserved here.

## Source code

### Line separator

People are using various operating systems to develop components and platforms for Home Assistant. This could lead to different line endings on file. We prefer `LN`. Especially Microsoft Windows tools tend to use `CRLF`.

```bash
$ find homeassistant -name "*.py" -exec file {} \; | grep BOM
$ find homeassistant -name "*.py" -exec file {} \; | grep CRLF
```

To fix the line separator, use `dos2unix` or `sed`.

```bash
$ dos2unix homeassistant/components/notify/kodi.py
```

### File permissions

Most files don't need to the be executable. `0644` is fine.

### Dependencies

A lot of components and platforms depends on third-party Python modules. The dependencies which are stored in the `requirements_*.txt` files are tracked by [Requires.io](https://requires.io/github/home-assistant/home-assistant/requirements/?branch=dev).

If you update the requirements of a component/platform by updating `manifest.json`, run the provided script to update the `requirements_*.txt` file(s).

```bash
$ script/gen_requirements_all.py
```

Start a test run of Home Assistant. If that was successful, include all files in a Pull Request. Add a short summary of the changes, a sample configuration entry, details about the tests you performed to ensure the update works, and other useful information to the description.

## Documentation

- Merge `current` into `next` on a regular base.
- Optimize the images.