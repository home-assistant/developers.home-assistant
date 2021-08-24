---
author: Joakim Sørensen
authorURL: https://github.com/ludeeus
authorImageURL: /img/profile/ludeeus.jpg
authorTwitter: ludeeus
title: Supervisor update
---

It's been a while since we posted about changes to the Supervisor. Here are some highlights from the past year and the future. This information is mainly for add-on developers, but there is little something for everyone in here. If you have not yet seen it, we have posted a [blog on the main site][main_blog] that you should read.

## Snapshot -> Backup

First up, as mentioned in the [blog on the main site][main_blog], we have started a transition away from the name "snapshot" that has been with us since the beginning of the Supervisor and are now moving to the more recognizable "backup".

These changes are live now on the `dev` channel for the Supervisor, so you can start testing and adjusting your tools/add-ons to make sure they will still work when your users get this.

### API changes

With the transition from "snapshot" to "backup", a new base section in the Supervisor API has been added [`/backups`][supervisor_api_backups] that operates the same way as [`/snapshots`][supervisor_api_snapshots] with all the same endpoints as the old section has but there are two key differences:

- If you access `/backups` the data returned now will be `{"backups": []}` instead of `{"snapshots": []}`
- To delete a snapshot you now have to use the `DELETE` HTTP method with the `/backups` endpoint, previously both `POST` and `DELETE` were supported.

The old [`/snapshots`][supervisor_api_snapshots] endpoints are now deprecated and are scheduled for removal in Q4 of this year.

### Backup structure changes

For consistency, we have also changed the name of the meta file inside the backup tar from `snapshot.json` to `backup.json`. If you have a tool that uses that file you should look for both so your tool will work for existing as well as new backups.

## Streaming ingress

Some add-ons need to receive large payloads from the user, for instance with uploading. Previously, there has been a limit of 16 MB per request for add-ons running behind ingress and this is still the default. If you need to receive larger payloads, you can enable this by setting `ingress_stream` to `True` in the add-on configuration. When you do this the request is streamed from the client to your add-on, and the request has no size limit and virtually no overhead.

Note that not all webservers are able to handle this by default, so you might need to adjust it.

## Deprecated API endpoints

Over the past years, we have restructured parts of our API endpoints, but we have also kept old endpoints working. If you use any of the deprecated endpoints in your tools/add-ons you should move to use the new ones now. All deprecated endpoints are scheduled for removal in Q4 this year.

Here is a list of the deprecated endpoints and their replacements:

Deprecated endpoints | Replaced with
-- | --
`/homeassistant/*` | `/core/*`
`/snapshots/*` | `/backups/*`

In addition to this, the following are also deprecated and are also scheduled for removal in Q4 this year.

- The environment variable `HASSIO_TOKEN` has been replaced with `SUPERVISOR_TOKEN`.
- Using `X-Hassio-Key` header has been replaced with [using `Authorization` with a Bearer token][api_example].
- Using `http://hassio/` to communicate with the Supervisor has been replaced with `http://supervisor/`.

## Supervised installation

Maintaining a [supervised installation][supervised_installation] is currently not the best experience. [The script][supervised_script] that most users use to install is behind what the Supervisor wants from the host. Since there are no real upgrade paths for those using it, users of it need to manually adjust their installation.

Recently we created the [OS Agent][os_agent] as mentioned in the [blog on the main site][main_blog]. This allows for better communication between the host OS and the Supervisor, and to bring in more features. To take advantage of these features users of current supervised installations have to install the OS Agent manually.

An alternative to this route is to package and distribute the supervised installation as a deb package that can be installed and upgraded with `apt` on the host. For this to be viable, we are looking for a person (or a group of people) that wants to create and maintain this type of deployment, and bring the supervised installation method up to par with our OS, and more importantly make updates needed on the host easier for the users.

If you have questions about these changes feel free to reach out in the `#devs_supervisor` channel on [our Discord server][discord].

Until next time 👋

[discord]: https://discord.gg/c5DvZ4e
[main_blog]: https://www.home-assistant.io/blog/2021/08/24/supervisor-update/
[supervisor_api_backups]: /docs/api/supervisor/endpoints#backup
[supervisor_api_snapshots]: /docs/api/supervisor/endpoints#snapshot
[supervised_installation]: https://github.com/home-assistant/architecture/blob/master/adr/0014-home-assistant-supervised.md
[supervised_script]: https://github.com/home-assistant/supervised-installer
[os_agent]: https://github.com/home-assistant/os-agent
[api_example]: /docs/api/supervisor/examples#get-network-information-with-curl
