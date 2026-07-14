---
title: "Documentation testing"
---

The Home Assistant documentation repository tests documentation changes with GitHub Actions.
For the current workflow, see [`test.yml`](https://github.com/home-assistant/home-assistant.io/blob/current/.github/workflows/test.yml).

The workflow runs two lint jobs:

- **Lint Markdown** checks Markdown structure and formatting with remark.
- **Lint Text** checks spelling, terminology, and wording with textlint.

The workflow also checks that integration pages in `source/_integrations` use the `.markdown` file extension instead of `.md`.

## Running the tests locally

Install the Node.js dependencies in the `home-assistant.io` repository:

```shell
npm install
```

Then run the same commands used by CI:

```shell
npm run markdown:lint
npm run textlint
```

The commands are defined in [`package.json`](https://github.com/home-assistant/home-assistant.io/blob/current/package.json).

## Markdown checks

The Markdown checks use [remark](https://remark.js.org/) in CI.
The `markdown:lint` script runs:

```shell
remark --quiet --frail .
```

The remark rules are defined in [`.remarkrc.js`](https://github.com/home-assistant/home-assistant.io/blob/current/.remarkrc.js).
The configuration includes checks for code block hygiene, heading hygiene, list consistency, and prohibited strings.

Files and directories ignored by remark are listed in [`.remarkignore`](https://github.com/home-assistant/home-assistant.io/blob/current/.remarkignore).

### Adding a remark rule

To add a Markdown rule:

1. Install the remark lint rule package with `npm install --save-dev <package-name>`. This updates [`package.json`](https://github.com/home-assistant/home-assistant.io/blob/current/package.json) and [`package-lock.json`](https://github.com/home-assistant/home-assistant.io/blob/current/package-lock.json).
2. Enable and configure the rule in [`.remarkrc.js`](https://github.com/home-assistant/home-assistant.io/blob/current/.remarkrc.js).
3. Run `npm run markdown:lint`.
4. Fix existing violations or add justified exclusions to [`.remarkignore`](https://github.com/home-assistant/home-assistant.io/blob/current/.remarkignore).

## Text checks

The text checks use [textlint](https://textlint.github.io/).
The `textlint` script checks selected documentation directories, including:

- `source/_docs`
- `source/_faq`
- `source/_integrations`
- `source/_dashboards`
- `source/cloud`
- `source/getting-started`
- `source/hassio`
- `source/dashboards`

The textlint rules are defined in [`.textlintrc.json`](https://github.com/home-assistant/home-assistant.io/blob/current/.textlintrc.json).
The configuration currently uses:

- `common-misspellings` for common spelling mistakes.
- `terminology` for product names, preferred terms, and wording replacements.
- `comments` so contributors can disable textlint for a specific section when needed.
- `allowlist` for text that should be ignored by textlint.

### Adding terminology entries

Add terminology entries to the `terminology` rule's `terms` list in [`.textlintrc.json`](https://github.com/home-assistant/home-assistant.io/blob/current/.textlintrc.json).

Use a string for an accepted term that must keep its spelling or capitalization:

```json
"Home Assistant",
"Z-Wave",
"GitHub"
```

Use a substitution pair to flag one spelling or phrase and suggest another:

```json
["addon", "add-on"],
["Github", "GitHub"],
["repo\\b", "repository"]
```

The first value in a substitution pair is the textlint pattern to match.
The second value is the suggested replacement shown to contributors.
Escape characters that have special meaning in JSON or regular expressions.

Keep new entries close to related existing entries.
After changing terminology, run `npm run textlint` in the `home-assistant.io` repository.

### Disabling textlint inline

For a false positive, you can disable textlint with HTML comments around the affected text:

```html
<!-- textlint-disable -->

Text that textlint should ignore.

<!-- textlint-enable -->
```

To disable only one rule, add the rule name:

```html
<!-- textlint-disable terminology -->

Text that textlint should ignore for this rule.

<!-- textlint-enable terminology -->
```

Keep inline disables as narrow as possible.
Put a blank line before and after textlint comments unless doing so would break the surrounding Markdown structure.
Do not put these comments inside [Liquid text boxes](/docs/documenting/general-style-guide#text-boxes).

### Adding a textlint rule

To add a text rule:

1. Add the textlint rule package to [`package.json`](https://github.com/home-assistant/home-assistant.io/blob/current/package.json) and update [`package-lock.json`](https://github.com/home-assistant/home-assistant.io/blob/current/package-lock.json).
2. Enable and configure the rule in [`.textlintrc.json`](https://github.com/home-assistant/home-assistant.io/blob/current/.textlintrc.json).
3. Run `npm run textlint`.
4. Fix existing violations or add narrow exclusions to the `allowlist` section of [`.textlintrc.json`](https://github.com/home-assistant/home-assistant.io/blob/current/.textlintrc.json).

## Markdownlint configuration

The repository has a [`.markdownlint.json`](https://github.com/home-assistant/home-assistant.io/blob/current/.markdownlint.json) file.
This file defines markdownlint-compatible settings, for example disabling the line length rule and allowing inline HTML.
The recommended VS Code extensions include markdownlint in [`.vscode/extensions.json`](https://github.com/home-assistant/home-assistant.io/blob/current/.vscode/extensions.json), so contributors may see markdownlint warnings in their editor.

Markdownlint is not run by the current GitHub Actions test workflow or the `package.json` scripts.
If you add or change markdownlint rules, also add a script and CI step if the rule must be enforced for pull requests.
