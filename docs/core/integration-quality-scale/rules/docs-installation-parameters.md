---
title: "The documentation describes all integration installation parameters"
---

## Reasoning

When setting up an integration, there's nothing more frustrating than not knowing what information is asked for.
To improve the user experience, the documentation should describe all the parameters that are required during the installation process.
This should help the user to gather all the necessary information before starting the installation process.

## Example implementation

```markdown showLineNumbers
{% configuration_basic %}
Host:
    description: "The IP address of your bridge. You can find it in your router or in the Integration app under **Bridge Settings** -> **Local API**."
    required: false
    type: string
Local access token:
    description: "The local access token for your bridge. You can find it in the Integration app under **Bridge Settings** -> **Local API**."
    required: false
    type: string
{% endconfiguration_basic %}
```

## Exceptions

There are no exceptions to this rule.