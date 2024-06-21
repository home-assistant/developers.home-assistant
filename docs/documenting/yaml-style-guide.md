---
title: "YAML Style Guide"
---

In addition to our general [documentation standards](/documenting/standards.md),
we also have a set of standards for documenting snippets of YAML. The standards
described on this page, apply to all our YAML based code across the project,
with the main focus on documentation.

Our YAML standards provide our end-users with a consistent look, the best
practices and a uniform approach for solving problems in YAML.

## YAML

This section is about basic YAML usage, and thus not Home Assistant specific.

### Indentation

An indentation of 2 spaces must be used.

```yaml
# Good
example:
  one: 1

# Bad
example:
    bad: 2
```

### Booleans

We should avoid the use of truthy boolean values in YAML. They often throw
off people new to YAML. Therefore, we only allow the use of `true` and `false`
as boolean values, in lower case.

This keeps it compatible with the YAML 1.2 specifications as well, since that
version dropped support for several unquoted truthy booleans (e.g., `y`, `n`,
`yes`, `no`, `on`, `off` and similar).

  ```yaml
# Good
one: true
two: false

# Bad
one: True
two: on
three: yes
```

### Comments

Adding comments to blocks of YAML can really help the reader understand the
example better.

The indentation level of the comment must match the current indentation level. Preferably the comment is written above the line the comment applies to, otherwise lines
may become hard to read on smaller displays.

Comments should start with a capital letter and have a space between the
comment hash `#` and the start of the comment.

```yaml
# Good
example:
  # Comment
  one: true

# Acceptable, but prefer the above
example:
  one: true # Comment

# Bad
example:
# Comment
  one: false
  #Comment
  two: false
  # comment
  three: false
```

### Sequences

Sequences in YAML are also known as lists or arrays. In the Home Assistant
world, we refer to them as lists in end-user documentation. This originates
from the Python language the Home Assistant core is developed in.

Sequences can be written in two different styles; block and flow style. We
prefer the use of block style sequences.

#### Block style sequences

Block style sequences need to be indented under the key they belong to.

```yaml
# Good
example:
  - 1
  - 2
  - 3

# Bad
example:
- 1
- 2
- 3
```

#### Flow style sequences

The use of flow style should be avoided. While simple, short and clean,
with longer data in it, it becomes harder to read.

If used, flow style sequences have space after each comma `,` and no white
space before opening and closing:

```yaml
# Good
example: [1, 2, 3]

# Bad
example: [ 1,2,3 ]
example: [ 1, 2, 3 ]
example: [1,2,3]
example: ["light.living_room_window", "light.living_room_corner", "light.living_room_table"]
```

### Mappings

Mappings in YAML are also known as associative arrays, hash tables,
key/value pairs, collections or dictionaries. In the Home Assistant world,
we refer to them as mappings in end-user documentation.

Mappings can be written in different styles, however, we only allow the use
of block style mappings. Flow style (that looks like JSON) is not allowed.

```yaml
# Good
example:
  one: 1
  two: 2

# Bad
example: { one: 1, two: 2 }
```

### Null values

Null values should be implicitly marked. The use of explicit null values should
be avoided (`~` and `null`).

```yaml
# Good
example:

# Bad
example: ~
example: null
```

### Strings

Strings are preferably quoted with double quotes (`"`).


```yaml
# Good
example: "Hi there!"

# Avoid
example: Hi there!

# Bad
example: 'Hi there!'
```

#### Multi-line strings

Avoid the use of `\n` or other new line indicators in YAML configuration when
possible. The same applies to avoiding long, single line, strings.

Instead, make use of the literal style (preserves new lines) and folded style
(does not preserve new lines) strings.

```yaml
# Good
literal_example: |
  This example is an example of literal block scalar style in YAML.
  It allows you to split a string into multiple lines.
folded_example: >
  This example is an example of a folded block scalar style in YAML.
  It allows you to split a string into multi lines, however, it magically
  removes all the new lines placed in your YAML.

# Bad
literal_example: "This example is an example of literal block scalar style in YAML.\nIt allows you to split a string into multiple lines.\n"
folded_example_same_as: "This example is an example of a folded block scalar style in YAML. It allows you to split a string into multi lines, however, it magically removes all the new lines placed in your YAML.\n"
```

In the examples above the no chomping operators are used (`|`, `>`). This is
preferred, unless the example requires a different handling of the ending new
line. In those cases the use of the strip operator (`|-`, `>-`: no trailing new
line, any additional new lines are removed from the end) or keep operator
(`|+`, `>+`: trailing new line, and keep all additional new lines from the end)
is allowed.

### Additional string guidance

The Home Assistant YAML section, provides additional guidelines on how
to handle strings in Home Assistant configuration examples.

## Home Assistant YAML

Within Home Assistant, we also have some things that can be done in different
ways, while still adhering to the above set styling. This part is here to take
care of that.

### Default values

A configuration option using a default value, should not be part of the example.
Unless, the example is specifically for educating about that option.

For example, our `condition` options in automations, is optional and an empty
list `[]` by default.

```yaml
# Good
- alias: "Test"
    trigger:
      -  platform: state
         entity_id: binary_sensor.motion

# Bad
- alias: "Test"
    trigger:
      -  platform: state
         entity_id: binary_sensor.motion
    condition: []
```

### Strings (continued)

As written in the first chapter, strings are preferably enquoted with double
quotes. However, the following value types are exempted from this rule,
as is makes our examples more readable:

- Entity IDs (e.g., `binary_sensor.motion`)
- Entity attributes (e.g., `temperature`)
- Device IDs
- Area IDs
- Platform types (e.g., `light`, `switch`)
- Condition types (e.g., `numeric_state`, `state`)
- Trigger platforms (e.g., `state`, `time`)
- Service names (e.g., `light.turn_on`)
- Device classes (e.g., `problem`, `motion`)
- Event names
- Values that accept a limited set of possible, hardcoded values.
  For example, `mode` in automations.

```yaml
# Good
action:
  - service: notify.frenck
    data:
      message: "Hi there!"
  - service: light.turn_on
    target:
      entity_id: light.office_desk
      area_id: living_room
    data:
      transition: 10

# Bad
action:
  - service: "notify.frenck"
    data:
      message: Hi there!
```

### Service targets

If you want to fire a service call for an entity ID (for example, to turn
on a light), you can do so in three different ways.

The entity ID can be specified as a property of the service level, part of the
data that is sent in the service call or as an entity in a service target.

Service targets is the most modern way and allows one to target a service call
for an entity, device or area. Therefore, the target is the most flexible of the options
available and is the one that should be used.

```yaml
# Good
action:
  - service: light.turn_on
    target:
      entity_id: light.living_room
  - service: light.turn_on
    target:
      area_id: light.living_room
  - service: light.turn_on
    target:
      area_id: living_room
      entity_id: light.office_desk
      device_id: 21349287492398472398

# Bad
action:
  - service: light.turn_on
    entity_id: light.living_room
  - service: light.turn_on
     data:
       entity_id: light.living_room
```

### Properties that accept a scalar or a list of scalars

Home Assistant has a lot of places that access both a scalar value or a list
of scalar values. Additionally, sometimes, it even accepts a comma-separated
string value as a list.

The following applies in case a single value or a list of scalar values
is accepted:

- Putting multiple values in a single scalar value (comma separated string)
  must not be used.
- If a list is used, it must be block style.
- A list with a single scalar value should not be used.
- The use of a single scalar value is allowed.

```yaml
# Good
entity_id: light.living_room
entity_id:
  - light.living_room
  - light.office

# Bad
entity_id: light.living_room, light.office
entity_id: [light.living_room, light.office]
entity_id:
  - light.living_room
```

### Properties that accept a mapping or a list of mappings

Home Assistant has properties that accept both a mapping or a list of mappings.
Well known examples are: `condition`, `action`, `sequence`.

In case a property accepts a single mapping or a list of mappings, a list of
mappings must be used, even when a single mapping is passed in.

This makes it easier to understand that one can add more items to it and also easier to
copy and paste a single item into your own code.

```yaml
# Good
action:
  - service: light.turn_on
    target:
      entity_id: light.living_room

# Bad
action:
  service: light.turn_on
  target:
    entity_id: light.living_room
```

### Templates

Home Assistant templates are powerful, but they can be really confusing or hard
to understand for a less experienced user. Therefore, the use of templates
should be avoided if a pure YAML version is available.

Additionally, the use of templates requires additional escaping in our
documentation to avoid our website code to confuse it for the Liquid syntax.
Avoiding templates in general removes the need of additional escaping.

```yaml
# Good
condition:
  - condition: numeric_state
    entity_id: sun.sun
    attribute: elevation
    below: 4

# Bad
condition:
  - condition: template
    value_template: "{{ state_attr('sun.sun', 'elevation') < 4 }}"
```

#### Quoting style

Templates are strings, and thus are double-quoted. As a result of that,
single quotes should be used inside the template.

```yaml
# Good
example: "{{ 'some_value' == some_other_value }}" 

# Bad
example: '{{ "some_value" == some_other_value }}'
```

#### Template string length

Long lines in templates should be avoided and split across multiple lines to
make more clear what happens and keep them readable.

See the chapters on strings above for additional information on multi-line
string formatting.

```yaml
# Good
value_template: >-
  {{
    is_state('sensor.bedroom_co_status', 'Ok')
    and is_state('sensor.kitchen_co_status', 'Ok')
    and is_state('sensor.wardrobe_co_status', 'Ok')
  }}

# Bad
value_template: "{{ is_state('sensor.bedroom_co_status', 'Ok') and is_state('sensor.kitchen_co_status', 'Ok') and is_state('sensor.wardrobe_co_status', 'Ok') }}"
```

#### Short style condition syntax

Prefer shorthand style templates over-expressive format, as they provide a
cleaner syntax.

```yaml
# Good
condition: "{{ some_value == some_other_value }}" 

# Bad
condition:
  - condition: template
    value_template: "{{ some_value == some_other_value }}"
```

#### Filters

Spacing around the filter pipe marker ` | ` is required. If this makes
readability unclear, the use of additional parentheses is recommended.

```yaml
# Good
condition:
  - "{{ some_value | float }}" 
  - "{{ some_value == (some_other_value | some_filter) }}" 

# Bad
condition:
  - "{{ some_value == some_other_value|some_filter }}" 
  - "{{ some_value == (some_other_value|some_filter) }}"
```

#### Accessing states & state attributes

We do not allow the use of the states object directly if a helper method is
available.

For example; don't use `states.sensor.temperature.state`, instead use
`states('sensor.temperature')`.

```yaml
# Good
one: "{{ states('sensor.temperature') }}"
two: "{{ state_attr('climate.living_room', 'temperature') }}"

# Bad
one: "{{ states.sensor.temperature.state }}"
two: "{{ states.climate.living_room.attributes.temperature }}"
```

This applies to  `states()`, `is_state()`, `state_attr()` and `is_state_attr()`,
to avoid errors and error messages when the entity isn’t ready yet
(e.g., during Home Assistant startup).
