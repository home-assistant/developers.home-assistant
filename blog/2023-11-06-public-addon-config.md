---
author: Mike Degatano
authorURL: https://github.com/mdegat01
title: "Public Addon Config"
---

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
at `/addon_configs/<your addon slug>` and map that to `/config` within the add-on
container. If your addon needs to be able to create and modify files in this folder
in addition to collecting files from users, use `addon_config:rw` instead.

To read more about this feature and some of the use cases, see [Add-on advanced options](/docs/add-ons/configuration#add-on-advanced-options).

## Backwards compatibility with `/config`

You may notice that the new public config folder is mapped to `/config`. Which is
previously where Home Assistant's config folder was mapped if you added `config`
to the `map` field.

This option is intended to replace the need for add-ons to map Home Assistant's
config into their container. As such, an add-on cannot include both `config` and
`addon_config` in the `map` field.

Going forward, if you do need to make Home Assistant's config available to your
add-on, you should list `homeassistant_config` as a folder in the `map` field. Then
Home Assistant's config folder will be mapped to `/homeassistant` within the container.

## New `addon_configs` folder

Some add-ons need access to all these add-on-specific config folders. For example:

1. Samba
2. SSH
3. Studio Code Server

Essentially, these add-ons provide alternative means of editing the configuration
files of Home Assistant and its add-ons. Add-ons like these should add `all_addon_configs:rw`
to the list of folders in the map field. This will map the entire addon configs
folder within the container at `/addon_configs`.
