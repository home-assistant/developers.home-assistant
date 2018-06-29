---
title: Data Entry Flow
sidebar_label: Introduction
id: version-0.72-data_entry_flow_index
original_id: data_entry_flow_index
---

Data Entry Flow is a data entry framework that is part of Home Assistant. Data entry is done via data entry flows. A flow can represent a simple login form or a multi-step setup wizard for a component. A Flow Manager is managing all flows that are in progress and handles creation of new flows.

Data Entry Flow is being used in Home Assistant to create config entries.

## Flow Manager

This is the class that manages the flows that are in progress. When instantiating one, you pas in two async callbacks:

```python
async def async_create_flow(handler, source=source, data=data)
```

The manager delegates instantiating of config flow handlers to this async callback. This allows the parent of the manager to define their own way of finding handlers and preparing a handler for instantiation. For example, in the case of the config entry manager, it will make sure that the dependencies and requirements are setup.

```python
async def async_finish_flow(result)
```

This async callback is called when a flow is finished. The result is a dictionary that looks like this:

```python
{
    # Data schema version of the entry
    'version': 2,
    # The result type of the flow
    'type': RESULT_TYPE_CREATE_ENTRY,
    # the id of the flow
    'flow_id': 'abcdfgh1234,
    # handler name
    'handler': 'hue',
    # title and data as created by the handler
    'title': 'Some title',
    'data': {
        'some': 'data'
    },
    # Source that instantiated the flow
    'source': self.source,
}
```

## Config Flow Handler

Config flow handlers will handle a single flow. A flow contains 1 or more steps. When a flow is instantiated by the user, the `init` step will be called. Each step has three different possible results: "Show Form", "Abort" and "Create Entry".

At a minimum, each config flow handler will have to define a version number and a step. This doens't have to be `init`, as different steps will be called when instantiated by a non-user (ie discovery).

The bare minimum config flow:

```python
from homeassistant import data_entry_flow

class ExampleConfigFlow(data_entry_flow.FlowHandler):

    # The schema version of the entries that it creates
    # Home Assistant will call your migrate method if the version changes
    # (this is not implemented yet)
    VERSION = 1

    async def async_step_init(self, user_input=None):
        # Do something
```

### Show Form

This result type will show a form to the user to fill in. You define the current step, the schema of the data (using voluptuous) and optionally a dictionary of errors. Title and description of the step will be provided via the translation file. Where this is defined depends on the context of the data entry flow.

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_init(self, user_input=None):
        # Use OrderedDict to guarantee order of the form shown to the user
        data_schema = OrderedDict()
        data_schema[vol.Required('username')] = str
        data_schema[vol.Required('password')] = str

        return self.async_show_form(
            step_id='init',
            data_schema=vol.Schema(data_schema)
        )
```

After the user has filled in the form, the step method will be called again and the user input is passed in. Your step will only be called if the user input passes your data schema. When the user passes in data, you will have to do extra validation of the data. For example, you can verify that the passed in username and password are valid.

If something is wrong, you can return a dictionary with errors. Each key in the error dictionary refers to a field name that contains the error. Use the key `base` if you want to show an error unrelated to a specific field. The specified errors need to refer to a key in a translation file.

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_init(self, user_input=None):
        errors = {}
        if user_input is not None:
            # Validate user input
            valid = await is_valid(user_input)
            if valid:
                # See next section on create entry usage
                return self.create_entry(…)

            errors['base'] = 'auth_error'

        # Use OrderedDict to guarantee order of the form shown to the user
        data_schema = OrderedDict()
        data_schema[vol.Required('username')] = str
        data_schema[vol.Required('password')] = str

        return self.async_show_form(
            step_id='init',
            data_schema=vol.Schema(data_schema),
            errors=errors
        )
```

#### Multi-step flows

If the user input passes validation, you can again return one of the three
return values. If you want to navigate the user to the next step, return the
return value of that step:

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_init(self, user_input=None):
        errors = {}
        if user_input is not None:
            # Validate user input
            valid = await is_valid(user_input)
            if valid:
                # Store info to use in next step
                self.init_info = user_input
                # Return the form of the next step
                return await self.async_step_account()

        …
```

### Create Entry

When the result is "Create Entry", an entry will be created and passed to the parent of the flow manager. A success message is shown to the user and the flow is finished. You create an entry by passing a title and data. The title can be used in the UI to indicate to the user which entry it is. Data can be any data type, as long as it is JSON serializable.

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_init(self, user_input=None):
        return self.create_entry(
            title='Title of the entry',
            data={
                'something_special': user_input['username']
            }
        )
```

### Abort

When a flow cannot be finished, you need to abort it. This will finish the flow and inform the user that the flow has finished. Reasons for a flow to not be able to finish can be that a device is already configured or not compatible with Home Assistant.

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_init(self, user_input=None):
        return self.async_abort(
            reason='not_supported'
        )
```

## Translations

Data entry flows depend on translations for showing the text in the forms. It depends on the parent of a data entry flow manager where this is stored.

## Initializing a config flow from an external source

You might want to initialize a config flow programmatically. For example, if we discover a device on the network that requires user interaction to finish setup. To do so, pass a source parameter and optional user input when initializing a flow:

```python
await flow_mgr.async_init('hue', source=data_entry_flow.SOURCE_DISCOVERY, data=discovery_info)
```

The config flow handler will not start with the `init` step. Instead, it will be instantiated with a step name equal to the source. The step should follow the same return values as a normal step.

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_discovery(self, info):
        # Handle discovery info
```
