---
title: "Tips and Tricks"
---

This page provides some tips and tricks that may help you as a contributor to Home Assistant. The list here is by no means exhaustive, and if you pick up any additional undocumented tips and tricks, please open a PR to add them here.

## Tips and Tricks

### Keep PRs simple

See the [Component Checklist](creating_component_code_review#5-make-your-pull-request-as-small-as-possible) for PR expectations.

### Test package dependency changes in Home Assistant

See the [API library docs](api_lib_index#trying-your-library-inside-home-assistant) for more information.

### Test Core integration changes in your production Home Assistant environment

If you made a change to a core integration and you want to test it in your production Home Assistant environment, copy the integration folder into `/config/custom_components`, add a version to the `manifest.json` (e.g. "version": "0.0.0"), and restart Home Assistant. Home Assistant will always prioritize integrations in `custom_components` over the core integration. Don't forget to remove it once you are done testing; otherwise, you will be stuck on that version.

### When adding a config flow to an integration, be aware of the frontend

The Home Assistant frontend caches aggressively, and as such, the first time you run Home Assistant with your new changes, you may not see the integration show up in the integration list. Check the logs to make sure there were no errors, and if not, perform a hard refresh of your browser window and try again; in many cases, that will resolve your issue.

### Running pytests from within VSCode

If you installed the required Python dependencies, you can run PyTests from within VSCode after some configuration. Via the VSCode side-menu you select "Testing" (icon: Labratory Flask) and select that the tests are in the folder "tests". After a while a treeview should appear with tests which can be executed via the "Run Test" button (icon: Play) next to the test names. 

### Getting additional support

`#devs` and `#devs_core` on the Home Assistant [Discord](https://www.home-assistant.io/join-chat/) server are great places to ask questions. Pro tip: Before you post your question, push the code you are working on into a branch and push that branch somewhere public and paste a link to it along with your question so that the person who is helping you can see your code. Please do NOT paste code blobs into the channel as it's hard to read and hides other questions/discussions.

If you see a way to improve the developer docs, please pay it forward and submit a PR to update them. See the next tip for more details.

### Missing information in the developer docs

The Home Assistant maintainers try to keep the developer docs up to date, but we also rely on contributors like you to help us correct, improve, and expand on our existing documentation. Like Home Assistant, this [documentation is open source](https://github.com/home-assistant/developers.home-assistant), and PRs are welcome. When in doubt, click the `Edit this page` button in the bottom left to get to the source file and to edit the file directly on GitHub. No command line is needed!
