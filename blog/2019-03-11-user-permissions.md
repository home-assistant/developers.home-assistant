---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Can I Have User Permissions?
---

Home Assistant has had a user permission system since Home Assistant 0.82 (released Nov, 2018). Permissions are attached to groups, a user can be part of multiple groups, user permissions are based on merging the permission policies of all of its groups. More detailed info can be found in [our docs](/docs/en/next/auth_permissions.html). Users can create their own groups, but there are also three system groups: "admin", "users" (new in 0.90), and "read-only". All three have access to all entities, but the read-only cannot control any of them. Only the users part of the admin group can access administrative options like managing users and integrations.

Before Home Assistant 0.90, we were not using any of it. Instead, all users are part of the admin group, as that group provides the same access as before we had permissions. With 0.90, we're going to allow switching the users group between the system groups "admin" and "users". When a user is part of the "users" group, they will not be able to administer Home Assistant. The UI will hide the menu items to open the configuration panel or the developer tools.

![Screenshot showing a user in the users group](/img/en/blog/2019-03-user-permissions/screenshot.png)

This feature is however unfinished. We need to audit the Home Assistant code to make sure that all APIs and service calls check the users permissions. So although a user will not be able to use the UI to make changes, there might still be APIs that can be accessed without permissions. And not only do we need to check the Home Assistant code, custom components that register services or APIs will also have to be updated.

So this is where you can help! If you're maintaining an integration, either custom or built-in, read up on [the documentation on how to check permissions](/docs/en/next/auth_permissions.html##checking-permissions). Then check that your integration checks permissions appropriately. Once you checked yours, help others check theirs, and help us to audit all services and API calls in Home Assistant.

## What about custom groups?

Although we support the creation of custom groups, don't expect it publicly exposed anytime soon. The reason for this is that it requires a lot of work on APIs that interact with the custom policies. The hardest part is that a custom policy could enable read access to only a couple of entities, and only allow control access to a subset of them. We will need to go through each API to make sure they support this. Lovelace will also need to be updated to support users having their own configuration view.

That being said, if you do want to play with it, it's possible.

> This is risky. Make backups, etc.

Turn off Home Assistant and open up `<config>/.storage/auth`. Find the key `"groups"` and add a new group:

```json
{
  "id": "my-custom-group",
  "name": "My Custom Group",
  "policy": {
    "entities": {
      "entity_ids": {
        "light.kitchen": true,
        "switch.ac": {
          "read": true
        }
      }
    }
  }
}
```

Now scroll down in the file to the `"users"` key and find the user you want to apply the custom group to. For this user, update their `"group_ids"` value to be that of your custom group. Note, you should not update the user that has `"owner": true`, as they will always have all permissions.

```json
"group_ids": [
    "my-custom-group"
],
```

Now start Home Assistant and log in with the updated user. If all went well, you should see only the kitchen lights and AC switch. Controlling the AC will fail.

A user can be as many groups as you want. Only members of the `system-admin` group can administer the system. To learn more about the policy format, check the [documentation](/docs/en/next/auth_permissions.html).
