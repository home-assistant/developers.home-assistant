---
title: "Has an integration owner"
---

## Reasoning

Home Assistant integrates with thousands of different devices and services, and most integrations are contributed by people other than the core maintainers of the project.
The contributors that add and maintain an integration are encouraged to become the "integration owner".
This is a role that grants the contributor more power when handling issues and pull requests for the integration in GitHub and it means that the contributor has taken on the responsibility for the stewardship of the integration.
Integration owners will automatically get notified whenever there is a new issue or pull request for their integration.
On GitHub the integration owner is referred to as the "codeowner".

Integration owners are tracked in the `manifest.json` file of each integration.
To become an integration owner, submit a pull request adding your GitHub username to the `"codeowners"` field in the manifest.
An integration can have more than one owner.

We love integration owners!
We believe that integrations that have an owner are better maintained.
During reviews, we see the integration owner as the expert on the integration, and weigh their opinion higher than others.

## Example implementation

Integration owners are set in the `manifest.json`.

```json {3} showLineNumbers
{
  "domain": "my_integration",
  "name": "My Integration",
  "codeowners": ["@me"]
}
```

## Additional resources

More information about integration owners can be found in [ADR-0008](https://github.com/home-assistant/architecture/blob/master/adr/0008-code-owners.md).

## Exceptions

There are no exceptions to this rule.