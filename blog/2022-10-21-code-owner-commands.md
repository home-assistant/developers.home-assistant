---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: GitHub Commands for Code Owners
---

The Home Assistant [service hub](https://github.com/home-assistant/service-hub/) has been extended by [Ludeeus](https://github.com/ludeeus) with a new feature: GitHub commands for code owners.

This feature allows any code owner to triage issues that are labeled with their integration. The following commands are available starting today:

* `@home-assistant close`<br />
  Close the issue. Limited to when there is only 1 integration labeled

* `@home-assistant rename New Title`<br />
  Change the title of the issue. Limited to when there is only 1 integration labeled

* `@home-assistant unassign <your domain>`<br />
  Remove the integration label and related assignees.

The bot will include these commands when it posts a comment to notify a code owner of a new issue or pull request ([example](https://github.com/home-assistant/core/issues/80731#issuecomment-1287084569)).
