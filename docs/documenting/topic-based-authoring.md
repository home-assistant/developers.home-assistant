---
title: "Topic-based authoring"
---

Topic-based authoring organizes documentation around the reader's purpose.
A topic answers one main question: what something means, how to complete a task, which options are available, how to learn a skill, or how to solve a problem.

A topic can be a whole page or a section within a page.
You do not need a separate page for every topic.

For integration, trigger, condition, and action pages, follow the [Integration page structure](/docs/documenting/integration-docs-examples/) guidance and templates.
Their page structures are documented there rather than repeated here.

## Put the UI first

For every feature configurable from the UI, present the UI as the standard way to configure it.
This applies across topic types, including tutorials, reference topics, and troubleshooting.
Present UI instructions and options before YAML or command-line alternatives.

Document YAML or command-line alternatives where they are supported and relevant, under separate headings or tabs, and explain when to use them.
Do not imply that file editing is part of normal setup when the UI can complete the task.

## One purpose per section

Keep each section focused on one topic type.
Avoid explaining a concept, giving a procedure, and listing every option under the same heading.
Separate those purposes with descriptive headings, or link to another topic when the supporting material already exists.

Keep each topic focused on one subject or goal.
A concept topic should explain one concept, a task topic should cover one task, and a troubleshooting topic should address one problem.
A reference topic should describe one set of related facts or options.
A tutorial can combine several tasks that serve one learning goal.

If you start describing how to do another task, create a separate topic for it.
For example, if creating an area requires instructions for creating a floor, put the floor-creation steps in their own task topic.
The new topic can be another section on the same page or a separate page.
Keep steps that contribute directly to the original task's outcome together.

For example, a page about areas can contain:

```markdown
---
title: "Areas"
---

<!-- Concept: what an area is and why you would use one. -->

## Creating an area
<!-- Task: the steps needed to create an area. -->

## Area settings
<!-- Reference: the available settings and their meanings. -->
```

A short introduction, prerequisite, or explanation needed to complete a step does not make a task a mixed-topic section.
Keep that context close to the instruction.
Move extended background and complete option lists into their own sections.

A parent heading can group several topics under subheadings.
A troubleshooting section can group separate details blocks for individual symptoms, descriptions, and resolutions.
Keep the text under each heading focused on its stated purpose.

## Choosing a topic type

Choose the type based on what the reader needs:

- [Concept](#concept): understand what something is, why it matters, or how it works.
- [Task](#task): complete a specific goal.
- [Reference](#reference): look up a fact, setting, value, or behavior.
- [Tutorial](#tutorial): learn through a guided exercise that produces a functional example.
- [Troubleshooting](#troubleshooting): recognize and resolve a problem.

The subject does not determine the type.
For example, areas can be the subject of a concept, a creation task, or a settings reference.
UI instructions and YAML instructions are also not separate topic types; they are different ways to perform a task or describe configuration.

## Concept

A concept explains what something is and helps the reader understand it.
Use it for definitions, relationships, design choices, and reasons to use a feature.

### Headings for concept topics

Use a noun or descriptive phrase, such as `Areas`, `Parts of an automation`, or `Wake word processing`.
Use a question when it states the reader's need more clearly, such as `What is data polling?`.

Avoid headings such as `Introduction` or `Overview` when you can name the subject instead.

### Content for concept topics

Start with a plain-language explanation.
Add a concrete example and explain relevant relationships or trade-offs.
Define unfamiliar terms or link to their definitions.

For example:

```markdown
## Areas

An area groups devices and entities that belong to a room or another part of your home. For example, a living room area lets you target all the lights in that room with one action.
```

Keep setup instructions in a task topic.
Link to that task when it helps the reader act on the explanation.
Avoid turning a concept into an option catalog or a long sequence of UI steps.
Instead, create a reference topic for the options list and link to it.

## Task

A task helps the reader achieve a specific goal.
It assumes they want to get something done rather than work through a lesson.

### Headings for task topics

Use descriptive headings in sentence-style capitalization.
Name the subject or outcome rather than the topic type: use `Creating an area`, not `Task`.
Follow the [heading and formatting rules](/docs/documenting/general-style-guide#headings) in the documentation style guide.

Use an action and its object.
Prefer an `-ing` phrase, such as `Creating an area` or `Updating Home Assistant`, to match a common pattern in the existing documentation.
Imperative headings, such as `Write the image to your SD card`, also work for stages in a larger procedure.
Keep sibling headings parallel.

For a parent heading that groups nested procedures, use a noun or descriptive phrase for the shared subject.
Use an `-ing` phrase for each procedure below it.
For example, use `Backup locations` as the parent heading and `Defining the backup location for automatic backups` as the procedure heading.

Avoid vague headings such as `Usage`, `Configuration`, or `Working with areas` when the task has a more specific outcome.

### Content for task topics

Briefly state when or why to do the task if the heading does not make that clear.
List prerequisites, including required hardware, permissions, or prior setup, in a **Prerequisites** subsection before the steps.
Omit the subsection when there are no prerequisites worth stating.

Use a numbered list for sequential actions.
Start each step with an instruction, and place supporting explanations or expected results beneath it.
Finish with the outcome and, when useful, a way to check it.

For example:

```markdown
## Creating an area

1. Go to {% my areas title="**Settings** > **Areas, labels & zones**" %} and select **Create area**.
2. Enter a **Name** for the area.
3. Select **Create**.
   - Result: A new area is created.
```

Keep steps focused on the goal.
Avoid lengthy explanations, exhaustive field descriptions, or several unrelated procedures under one task heading.
Link to concept or reference topics for those details.

## Reference

A reference topic provides facts the reader can look up without following a procedure.
Use it for settings, supported values, syntax, response fields, and other defined behavior.

### Headings for reference topics

Name the information being described, such as `Area settings`, `Blueprint inputs`, or `Response data`.
Avoid catch-all headings such as `Important information` or `Good to know` when the content has a more specific subject.

### Content for reference topics

Use a consistent structure for comparable entries.
For settings, document their names, meanings, accepted values, and defaults where applicable.
Make required and optional settings clear.
Use UI labels for UI reference and exact keys for YAML reference.

For example:

```markdown
## Area settings

- **Name**: The name of the area. Required.
- **Alias**: An alternative name that a voice assistant can use to refer to the area.
```

Use the site's supported reference blocks or lists according to the information.
If a table is necessary, follow the style guide's [table guidelines](/docs/documenting/general-style-guide#tables).
Keep the result easy to scan.
A short example can clarify a value or show valid syntax without becoming a tutorial.

Keep constraints beside the settings or behavior they affect.
Avoid burying setup instructions in field descriptions or repeating a full procedure before every reference entry.

## Tutorial

A tutorial teaches a skill through a guided example with a concrete outcome.
By the end, the reader should have a functional example they can use or adapt.
A task helps readers do their own work; a tutorial gives them a learning exercise to follow.
This distinction is about purpose, not difficulty: a simple procedure is not automatically a tutorial, and a tutorial can teach a complex skill.

### Headings for tutorials

Use `Tutorial:` followed by an action and an outcome, such as `Tutorial: Create your first automation`.
Name stages by what the reader will do, using consistent wording.
Number stage headings when their order matters.

### Content for tutorials

State what the reader will build and learn, then list what they need before starting.
Guide them through one chosen path with manageable stages.
Show expected results along the way and include a final check.

For example, an outline for the existing first-automation scenario could be:

```markdown
## What you will build
<!-- An automation that turns on a light before sunset. -->

## Prerequisites

## Step 1: Create the automation

## Step 2: Add the sunset trigger

## Step 3: Add the light action

## Step 4: Save and test the automation

## Next steps
```

Keep explanations close to the steps they help the reader understand.
A tutorial can combine several tasks, but each stage should serve the learning goal.
Link to full concept and reference topics rather than interrupting the exercise with them.

Avoid presenting every alternative or optional feature along the way.
Put extensions after the main exercise.
Do not call a collection of code examples a tutorial unless it guides the reader through a learning experience.

## Troubleshooting

A troubleshooting topic helps the reader identify a problem and recover from it.
It can be a section on a feature page or a dedicated page covering related problems.

### Headings for troubleshooting topics

Use a separate collapsible details block for each problem.
Use the symptom or exact error message as the block title, such as `Can't access Home Assistant in my browser` or `Stuck at "Preparing Home Assistant"`.
For a page containing several problems, use `Troubleshooting` followed by the subject, such as `Troubleshooting Assist`.

Avoid titles that require the reader to know the cause before they can find the solution.

### Content for troubleshooting topics

For the symptom, description, and resolution structure and examples, see the [troubleshooting documentation rule](/docs/core/integration-quality-scale/rules/docs-troubleshooting).
Its integration requirements, including collapsible blocks, apply to integration documentation.

Treat each distinct problem as its own topic.
Put simple checks before more involved actions, explain any consequences, and tell readers how to confirm that the problem is resolved.
If the checks do not resolve it, link to the appropriate support channel and state which diagnostic information to provide.

Avoid presenting a possible cause as certain.
Links to community support alone are not troubleshooting instructions.
Keep normal setup instructions in task topics and link to them when a missed prerequisite might explain the problem.
