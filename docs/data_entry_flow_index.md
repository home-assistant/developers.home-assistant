---
title: Data Entry Flow
sidebar_label: Introduction
---

Data Entry Flow is a data entry framework that is part of Home Assistant. Data entry is done via data entry flows. A flow can represent a simple login form or a multi-step setup wizard for a component. A Flow Manager is managing all flows that are in progress and handles creation of new flows.

Data Entry Flow is being used in Home Assistant to create config entries.

## Flow Manager

This is the class that manages the flows that are in progress. When instantiating one, you pass in two async callbacks:

```python
async def async_create_flow(handler, context=context, data=data)
```

The manager delegates instantiating of config flow handlers to this async callback. This allows the parent of the manager to define their own way of finding handlers and preparing a handler for instantiation. For example, in the case of the config entry manager, it will make sure that the dependencies and requirements are setup.

```python
async def async_finish_flow(flow, result)
```

This async callback is called when a flow is finished or aborted. i.e. `result['type'] in [RESULT_TYPE_CREATE_ENTRY, RESULT_TYPE_ABORT]`. The callback function can modify result and return it back, if the result type changed to `RESULT_TYPE_FORM`, the flow will continue running, display another form.

If the result type is `RESULT_TYPE_FORM`, the result should like:
```python
{
    # The result type of the flow
    'type': RESULT_TYPE_FORM,
    # the id of the flow
    'flow_id': 'abcdfgh1234,
    # handler name
    'handler': 'hue',
    # name of the step, flow.async_step_[step_id] will be called when form submitted
    'step_id': 'init',
    # a voluptuous schema to build and validate user input
    'data_schema': vol.Schema(),
    # an errors dict, None if no errors
    'errors': errors,
    # a detail information about the step
    'description_placeholders': description_placeholders,
}
```

If the result type is `RESULT_TYPE_CREATE_ENTRY`, the result should like:
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
    'result': {
        'some': 'data'
    },
}
```

If the result type is `RESULT_TYPE_ABORT`, the result should like:
```python
{
    # The result type of the flow
    'type': RESULT_TYPE_ABORT,
    # the id of the flow
    'flow_id': 'abcdfgh1234,
    # handler name
    'handler': 'hue',
    # the abort reason
    'reason': 'already_configured',
}
```


## Flow Handler

Flow handlers will handle a single flow. A flow contains one or more steps. When a flow is instantiated, the `FlowHandler.init_step` step will be called. Each step has three different possible results: "Show Form", "Abort" and "Create Entry".

At a minimum, each flow handler will have to define a version number and a step. This doens't have to be `init`, as `async_create_flow` can assign `init_step` depends on diffreent workflow, for example in configuration, `context.source` will be use as `init_step`.

The bare minimum config flow:

```python
from homeassistant import data_entry_flow

@config_entries.HANDLERS.register(DOMAIN)
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    # The schema version of the entries that it creates
    # Home Assistant will call your migrate method if the version changes
    # (this is not implemented yet)
    VERSION = 1

    async def async_step_user(self, user_input=None):
        # Do something
```

### Show Form

This result type will show a form to the user to fill in. You define the current step, the schema of the data (using voluptuous) and optionally a dictionary of errors. Title and description of the step will be provided via the translation file. Where this is defined depends on the context of the data entry flow.

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_user(self, user_input=None):
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

    async def async_step_user(self, user_input=None):
        errors = {}
        if user_input is not None:
            # Validate user input
            valid = await is_valid(user_input)
            if valid:
                # See next section on create entry usage
                return self.create_entry(...)

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

If the user input passes validation, you can again return one of the three return values. If you want to navigate the user to the next step, return the return value of that step:

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

        ...
```

### Create Entry

When the result is "Create Entry", an entry will be created and passed to the parent of the flow manager. A success message is shown to the user and the flow is finished. You create an entry by passing a title and data. The title can be used in the UI to indicate to the user which entry it is. Data can be any data type, as long as it is JSON serializable.

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_user(self, user_input=None):
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

    async def async_step_user(self, user_input=None):
        return self.async_abort(
            reason='not_supported'
        )
```

### External Step & External Step Done

It is possible that a user needs to finish a config flow by doing actions on an external website. For example, setting up an integration by being redirected to an external webpage. This is commonly used by integrations that use OAuth2 to authorize a user.

_The example is about config entries, but works with other parts that use data entry flows too._

The flow works as follows:

 1. User starts config flow in Home Assistant
 2. Config flow prompts user to finish the flow on an external website
 3. User opens the external website
 4. Upon completion of the external step, the user's browser will be redirected to a Home Assistant endpoint to deliver the response.
 5. The endpoint validates the response, and upon validation, marks the external step as done and returns JavaScript code to close the window: `<script>window.close()</script>`.

    To be able to route the result of the external step to the Home Assistant endpoint, you will need to make sure the config flow ID is included. If your external step is an OAuth2 flow, you can leverage the oauth2 state for this. This is a variable that is not interpreted by the authorization page but is passed as-is to the Home Assistant endpoint.
 6. The window closes and the Home Assistant user interface with the config flow will be visible to the user again.
 7. The config flow has automatically advanced to the next step when the external step was marked as done. The user is prompted with the next step.

Example configuration flow that includes an external step.

```python
from homeassistant import config_entries

@config_entries.HANDLERS.register(DOMAIN)
class ExampleConfigFlow(data_entry_flow.FlowHandler):
    VERSION = 1
    data = None

    async def async_step_user(self, user_input=None):
        if not user_input:
            return self.async_external_step(
                step_id='user',
                url='https://example.com/?config_flow_id={}'.format(
                    self.flow_id
                ),
            )

        self.data = user_input
        return self.async_external_step_done(next_step_id='finish')

    async def async_step_finish(self, user_input=None):
        return self.async_create_entry(
            title=self.data['title'],
            data=self.data
        )
```

Example code to mark an external step as done:

```python
from homeassistant import data_entry_flow

async def handle_result(hass, flow_id, data):
  result = await hass.config_entries.async_configure(flow_id, data)

  if result['type'] == data_entry_flow.RESULT_TYPE_EXTERNAL_STEP_DONE:
      return "success!"
  else:
      return "Invalid config flow specified"
```

## Translations

Data entry flows depend on translations for showing the text in the forms. It depends on the parent of a data entry flow manager where this is stored.

## Initializing a config flow from an external source

You might want to initialize a config flow programmatically. For example, if we discover a device on the network that requires user interaction to finish setup. To do so, pass a source parameter and optional user input when initializing a flow:

```python
await flow_mgr.async_init('hue', context={'source': data_entry_flow.SOURCE_DISCOVERY}, data=discovery_info)
```

The config flow handler will not start with the `init` step. Instead, it will be instantiated with a step name equal to the source. The step should follow the same return values as a normal step.

```python
class ExampleConfigFlow(data_entry_flow.FlowHandler):

    async def async_step_discovery(self, info):
        # Handle discovery info
```
