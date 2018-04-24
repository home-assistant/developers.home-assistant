---
layout: page
title: "Creating components"
---

Alright, you're ready to make your first component. AWESOME. Don't worry, we've tried hard to keep it as easy as possible.

### Example component

Add `hello_state:` to your `configuration.yaml` file and create a file `<config_dir>/custom_components/hello_state.py` with the below code to test it locally.

```python
DOMAIN = 'hello_state'

def setup(hass, config):
    hass.states.set('hello.world', 'Paulus')

    return True
```

For more examples, see the [Custom Python Component Examples](/cookbook/#custom-python-component-examples) on our examples page.
