---
title: Creating Labs preview features
description: Learn how to add preview features to Home Assistant Labs
---

Home Assistant Labs provides a standardized way to ship preview features that users can opt into before they become standard. This guide explains how to add a new preview feature to Labs.

## What are Labs preview features?

Labs preview features are critical bug free features that are being refined through real-world usage and feedback before becoming standard in Home Assistant. While fully functional, their feature set may still be extended or refined based on user feedback. They differ from beta testing, which evaluates release stability.

## When to use Labs

Labs is appropriate for:

- Major UI changes or redesigns that benefit from user feedback
- New subsystems or significant architectural changes
- Features that need real-world testing to refine the user experience
- Functionality where user feedback will shape the final design

Labs is **not** appropriate for:

- Permanent configuration options (use integration options instead)
- Integration-specific settings (use the integration's config flow)
- Minor changes that can go directly into releases
- Features that can't be toggled at runtime
- Features with critical bugs or that are fundamentally incomplete (these should remain in development)

## Adding a Labs preview feature

### 1. Define the feature in manifest.json

Add your feature to the `preview_features` section in your integration's `manifest.json`:

```json
{
  "domain": "my_integration",
  "name": "My Integration",
  "preview_features": {
    "my_preview_feature": {
      "feedback_url": "https://community.home-assistant.io/t/...",
      "learn_more_url": "https://www.home-assistant.io/integrations/my_integration",
      "report_issue_url": "https://github.com/home-assistant/core/issues/new?template=bug_report.yml"
    }
  }
}
```

**Field descriptions:**

- `feedback_url`: Link to community forum thread, feedback form, or discussion for feedback
- `learn_more_url`: Link to documentation about the feature
- `report_issue_url`: Link to GitHub issues for bug reports

All fields are optional, but strongly recommended to help users provide feedback and report issues.

### 2. Add translations

Add translations to your integration's `strings.json`:

```json
{
  "preview_features": {
    "my_preview_feature": {
      "name": "My preview feature",
      "description": "Enables the new preview feature that does X, Y, and Z.\n\nThis feature is stable but may change based on user feedback."
    }
  }
}
```

Guidelines for descriptions:

- Clearly explain what the feature does
- Keep it concise but informative
- Mention if the feature set may be extended in future releases
- Use sentence case
- You can use Markdown formatting (bold, links, etc.)

#### Custom confirmation messages (optional)

You can customize the confirmation messages shown when users enable or disable your feature. This is useful if your feature has specific behaviors or consequences users should be aware of:

```json
{
  "preview_features": {
    "my_preview_feature": {
      "name": "My preview feature",
      "description": "Enables the new preview feature that does X, Y, and Z.\n\nThis feature is stable but may change based on user feedback.",
      "enable_confirmation": "Enabling this feature will migrate your existing configuration to a new format. You can disable it later, but the configuration will remain in the new format.",
      "disable_confirmation": "Disabling this feature will stop the new behavior, but your configuration will remain in the migrated format. You may need to manually adjust settings if you re-enable it."
    }
  }
}
```

**When to use custom confirmations:**

- Your feature makes persistent changes (migrations, new entities, etc.)
- There are specific consequences users should understand
- The feature interacts with other systems in non-obvious ways
- You want to set clear expectations about enable/disable behavior

**Guidelines:**

- Be specific about what will happen when enabling/disabling
- Mention if changes persist after disabling
- Keep messages concise but informative
- Use sentence case
- Don't repeat generic information (users already see standard warnings)

### 3. Implement the feature

#### Backend feature

For backend features, check the flag in your code:

```python
from homeassistant.components.labs import async_is_preview_feature_enabled
from homeassistant.core import HomeAssistant

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the integration."""
    if async_is_preview_feature_enabled(hass, DOMAIN, "my_preview_feature"):
        # Enable preview functionality
        await setup_preview_feature(hass)

    # Standard setup continues
    return True
```

#### Frontend feature

For frontend features, check the flag in TypeScript:

```typescript
import { fetchLabFeatures } from "../../../data/labs";

const features = await fetchLabFeatures(this.hass);
const featureEnabled = features.find(
  (f) => f.domain === "my_integration" && f.preview_feature === "my_preview_feature"
)?.enabled;

if (featureEnabled) {
  // Load preview UI component
}
```

#### React to feature toggles

Subscribe to the `EVENT_LABS_UPDATED` event to react when users toggle your feature:

```python
from homeassistant.components.labs import EVENT_LABS_UPDATED, EventLabsUpdatedData
from homeassistant.core import Event, callback

@callback
def _async_labs_updated(event: Event[EventLabsUpdatedData]) -> None:
    """Handle labs feature update event."""
    if (
        event.data["domain"] == DOMAIN
        and event.data["preview_feature"] == "my_preview_feature"
    ):
        _async_update_my_preview_feature(hass)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the integration."""
    # Subscribe to changes
    entry.async_on_unload(
        hass.bus.async_listen(EVENT_LABS_UPDATED, _async_labs_updated)
    )
    
    # Check current state and apply
    _async_update_my_preview_feature(hass)
    
    return True

@callback
def _async_update_my_preview_feature(hass: HomeAssistant) -> None:
    """Enable or disable the preview feature based on current state."""
    if async_is_preview_feature_enabled(hass, DOMAIN, "my_preview_feature"):
        # Enable feature
        enable_my_feature(hass)
    else:
        # Disable feature
        disable_my_feature(hass)
```

### 4. Runtime activation required

**Critical requirement**: All Labs preview features must activate and deactivate at runtime without requiring a Home Assistant restart.

Good patterns:

- Dynamically load/unload UI components
- Create/remove entities when the feature toggles
- Enable/disable background tasks
- Register/unregister event listeners

Bad patterns:

- Changing core bootstrap behavior
- Modifying integrations that only load at startup
- Features that fundamentally alter system initialization
- Requiring configuration.yaml changes

### 5. Create feedback channels

Create appropriate feedback channels before releasing your feature:

1. **Community forum**: Create a topic in the "Beta" or "Feature Requests" category
2. **GitHub**: Optionally create a discussion or designate an issue for feedback
3. **Feedback form**: Use Google Forms, Typeform, or similar to collect structured feedback
4. Link these in your feature definition's `feedback_url`

Choose the channel that best fits your needs. Community forum threads work well for open discussion, GitHub for technical feedback, and forms for structured data collection.

### 6. Update generated files

After modifying `manifest.json`, run:

```bash
python -m script.hassfest
```

This updates `homeassistant/generated/labs.py` with your feature.

### 7. Document the feature

Add documentation about your preview feature:

- Update your integration's documentation page to mention the Labs feature
- Explain what's being previewed and what feedback you're seeking
- Provide clear instructions on how to enable it

### 8. Create My Home Assistant links (optional)

You can create My Home Assistant links that navigate directly to your feature in Labs. This is especially useful for:

- Release notes announcing new preview features
- Documentation with a clear call-to-action
- Community discussions where you want users to easily test the feature

The link format is:

```text
https://my.home-assistant.io/redirect/labs/?domain=<domain>&preview_feature=<feature_id>
```

For example:

```text
https://my.home-assistant.io/redirect/labs/?domain=kitchen_sink&preview_feature=special_repair
```

When users click this link:

1. They are redirected to the Labs panel in their Home Assistant instance
2. The page automatically scrolls to your specific feature
3. The feature card is highlighted for 3 seconds to draw attention

You can use these links in:

- Release notes: "Try the new feature by visiting the Labs panel"
- Documentation: Include a My link button to make it easy for users to enable the feature
- Community forum posts: Direct users to test specific features

**Example in Markdown:**

```markdown
To try this new preview feature, visit {% my labs domain="kitchen_sink" preview_feature="special_repair" title="Labs" %} 
and enable the "Special repair" feature.
```

## Complete example: Kitchen Sink special repair

See the Kitchen Sink integration for a complete working example:

`manifest.json`:

```json
{
  "domain": "kitchen_sink",
  "preview_features": {
    "special_repair": {
      "feedback_url": "https://community.home-assistant.io",
      "learn_more_url": "https://www.home-assistant.io/integrations/kitchen_sink",
      "report_issue_url": "https://github.com/home-assistant/core/issues/new"
    }
  }
}
```

`strings.json`:

```json
{
  "preview_features": {
    "special_repair": {
      "name": "Special repair",
      "description": "Creates a **special repair issue** when enabled.\n\nThis demonstrates how lab features can interact with other Home Assistant integrations.",
      "enable_confirmation": "This will create a special repair issue to demonstrate how preview features can interact with the repairs system. The repair will be removed when you disable this feature.",
      "disable_confirmation": "This will remove the special repair issue that was created by this preview feature."
    }
  },
  "issues": {
    "special_repair": {
      "title": "Special repair feature preview",
      "description": "This is a special repair created by a preview feature! This demonstrates how lab features can interact with the Home Assistant repair system. You can disable this by turning off the kitchen sink special repair feature in Settings > System > Labs."
    }
  }
}
```

`__init__.py`:

```python
from homeassistant.components.labs import (
    EVENT_LABS_UPDATED,
    EventLabsUpdatedData,
    async_is_preview_feature_enabled,
)
from homeassistant.core import Event, callback
from homeassistant.helpers.issue_registry import (
    IssueSeverity,
    async_create_issue,
    async_delete_issue,
)

@callback
def _async_labs_updated(event: Event[EventLabsUpdatedData]) -> None:
    """Handle labs feature update event."""
    if (
        event.data["domain"] == "kitchen_sink"
        and event.data["preview_feature"] == "special_repair"
    ):
        _async_update_special_repair(hass)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the integration."""
    # Subscribe to labs feature updates
    entry.async_on_unload(
        hass.bus.async_listen(EVENT_LABS_UPDATED, _async_labs_updated)
    )
    
    # Check if lab feature is currently enabled and create repair if so
    _async_update_special_repair(hass)
    
    return True

@callback
def _async_update_special_repair(hass: HomeAssistant) -> None:
    """Create or delete the special repair issue.
    
    Creates a repair issue when the special_repair lab feature is enabled,
    and deletes it when disabled. This demonstrates how lab features can interact
    with Home Assistant's repair system.
    """
    if async_is_preview_feature_enabled(hass, DOMAIN, "special_repair"):
        async_create_issue(
            hass,
            DOMAIN,
            "kitchen_sink_special_repair_issue",
            is_fixable=False,
            severity=IssueSeverity.WARNING,
            translation_key="special_repair",
        )
    else:
        async_delete_issue(hass, DOMAIN, "kitchen_sink_special_repair_issue")
```

## Best practices

### Feature design

- Keep preview features focused and testable
- Provide clear enable/disable behavior
- Fail gracefully if something goes wrong
- Log appropriately (use debug level for non-critical info)
- Make the feature fully reversible

### Code organization

```python
# Good: Conditional logic is clear and separated
if async_is_preview_feature_enabled(hass, DOMAIN, "my_feature"):
    await preview_setup(hass)
else:
    await standard_setup(hass)

# Bad: Mixing preview and stable code without clear separation
await setup(hass, preview=async_is_preview_feature_enabled(hass, DOMAIN, "my_feature"))
```

### Testing

Test both enabled and disabled states:

```python
async def test_feature_enabled(hass, hass_storage, mock_config_entry):
    """Test with feature enabled."""
    # Enable the feature by pre-populating storage
    hass_storage["core.labs"] = {
        "version": 1,
        "data": {
            "preview_feature_status": [
                {"domain": "my_integration", "preview_feature": "my_feature"},
            ]
        },
    }
    
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    # Test preview behavior

async def test_feature_disabled(hass, mock_config_entry):
    """Test with feature disabled."""
    # Feature disabled by default (no storage entry)
    
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    # Test standard behavior

async def test_feature_toggle(hass, mock_config_entry, hass_ws_client):
    """Test toggling the feature on and off."""
    await hass.config_entries.async_setup(mock_config_entry.entry_id)
    
    client = await hass_ws_client(hass)
    
    # Enable feature
    await client.send_json_auto_id({
        "type": "labs/update",
        "domain": "my_integration",
        "preview_feature": "my_feature",
        "enabled": True,
    })
    msg = await client.receive_json()
    assert msg["success"]
    
    # Verify feature behavior
    # ...
    
    # Disable feature
    await client.send_json_auto_id({
        "type": "labs/update",
        "domain": "my_integration",
        "preview_feature": "my_feature",
        "enabled": False,
    })
    msg = await client.receive_json()
    assert msg["success"]
    
    # Verify feature disabled
    # ...
```

## Feature lifecycle

### During preview

- Monitor feedback channels regularly
- Iterate based on user feedback
- Update the feature as needed (it's a preview!)
- Keep the feature description accurate
- Respond to bug reports promptly

### Graduation to standard

When the feature is ready to become standard:

1. Remove the feature from `preview_features` in `manifest.json`
2. Remove all `async_is_preview_feature_enabled()` checks
3. Make the feature always active
4. Run `python -m script.hassfest` to update generated files
5. Update documentation to reflect it's now standard
6. Announce in release notes

### Removal

If the feature doesn't work out:

1. Remove the feature from `preview_features` in `manifest.json`
2. Remove all related code
3. Clean up translations
4. Run `python -m script.hassfest`
5. Announce removal in release notes with explanation

## Common pitfalls

❌ **Don't** use Labs for permanent settings or configuration options

❌ **Don't** create features that require restart

❌ **Don't** leave preview features indefinitely without graduating or removing them

❌ **Don't** use Labs for features with critical bugs or that are fundamentally incomplete

❌ **Don't** forget to document what feedback you need

✅ **Do** make features fully reversible at runtime

✅ **Do** provide clear, concise descriptions

✅ **Do** plan for graduation or removal from the start

✅ **Do** actively engage with user feedback

✅ **Do** ensure the feature is critical bug free before adding it to Labs

✅ **Do** communicate if the feature set may be extended based on feedback
