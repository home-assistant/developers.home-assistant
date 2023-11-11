---
author: Mike Degatano, Stefan Agner
authorURL: https://github.com/mdegat01
title: "Public Addon Config"
---

**Update:** The implementation has been updated on short notice due to concerns
about user impact! See the update section at the end about details.

Add-ons can now have a public folder for config or data files, which users can see
and modify, but it is still backed up with the add-on.

Many add-ons ask users to provide files as part of the addon configuration. Or generate
files that they want users to be able to see and potentially modify. They typically
handle this by including `config` and/or `share` in the list of folders to map.

The problem with this is twofold:

1. Nothing in `config` or `share` is backed up with the add-on. So, backups of that add-on do not include all the necessary files to run it after restore.
2. Add-ons that map `config` have far more access than they should since `config` includes all secrets and credentials used in your Home Assistant integrations.

There is now a better solution for add-on developers. Add-ons can include `addon_config`
in the list of folders to map. Then, the supervisor will create a folder for that add-on
at `/addon_configs/<your addon slug>` and map that to `/addon_config` within the add-on
container. If your addon needs to be able to create and modify files in this folder
in addition to collecting files from users, use `addon_config:rw` instead.

To read more about this feature and some of the use cases, see [Add-on advanced options](/docs/add-ons/configuration#add-on-advanced-options).

## Backwards compatibility with `/config`

Initially, we intended to rename `/config` to `/homeasssistant`. However, due to
concerns about user impact (users need to be aware of that change, potentially
update scripts etc, and it would also be counter intuitive since inside the Core
container the configuration is still mapped at `/config`).

So at this point the Home Assistant's config folder will be mapped to `/config`
inside the add-on container no matter if you are using the old `config` mapping
or the new `homeassistant_config` mapping. The `homeassistant_config` is
encouraged going forward since it makes it more obvious that this config folder
is not meant for the add-on to store configurations.

## New `addon_configs` folder

Some add-ons need access to all these add-on-specific config folders. For example:

1. Samba
2. SSH
3. Studio Code Server

Essentially, these add-ons provide alternative means of editing the configuration
files of Home Assistant and its add-ons. Add-ons like these should add `all_addon_configs:rw`
to the list of folders in the map field. This will map the entire addon configs
folder within the container at `/addon_configs`.

## Update November 11 2023

Supervisor 2023.11.0 has a bug where the `addon_config` isn't working at
startup. Please wait until a fixed version has completely rolled out (see
[Supervsior issue #4689](https://github.com/home-assistant/supervisor/issues/4689).

Due to concerns of confusion for users what /config exactly represents this
change has been amended to always expose the add-on config to `/addon_config`
instead (see [Supervisor change #4697](https://github.com/home-assistant/supervisor/pull/4697).

This change will be rolled out with Supervisor 2023.11.2 (at the time of writing
available on the beta channel).

