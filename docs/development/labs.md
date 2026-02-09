---
title: Creating Labs preview features
description: Learn how to add preview features to Home Assistant Labs
---

Home Assistant Labs provides a standardized way to ship preview features that users can opt into before they become standard. This guide explains how to add a new preview feature to Labs.

## What are Labs preview features?

Labs preview features are fully tested and functional features whose user interface and design are being refined through real-world usage and feedback before becoming standard in Home Assistant. These features are:

- **Optional**: Disabled by default, users must explicitly enable them
- **Fully tested**: Production-ready code, not experimental or incomplete implementations
- **Subject to change**: May have breaking changes, be extended with new functionality, or be removed based on feedback
- **Reversible**: Can be disabled at any time without requiring a restart

Labs is about refining user interfaces and design, not about testing for bugs. This differs from beta testing, which evaluates the stability of upcoming Home Assistant releases.

## When to use Labs

Labs is appropriate for:

- Major UI changes or redesigns
- Significant architectural changes
- Features where user feedback will shape the final design and implementation

Labs is **not** appropriate for:

- Configuration options that should be standard functionality (use integration options or config flow instead)
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
- You can use Markdown formatting (bold, links, etc.)

#### Custom confirmation messages (optional)

You can customize the confirmation messages shown when users enable or disable your feature. This is useful if your feature has specific behaviors or consequences users should be aware of:

```json
{
  "preview_features": {
    "my_preview_feature": {
      "name": "My preview feature",
      "description": "Enables the new preview feature that does X, Y, and Z.\n\n**Note:** Enabling this feature will migrate your configuration to a new format. The configuration will remain in the new format even if you disable the feature later.\n\nThis feature is stable but may change based on user feedback.",
      "enable_confirmation": "This will migrate your existing configuration to the new format. You can disable the feature later, but the configuration will remain migrated.",
      "disable_confirmation": "This will stop the new behavior, but your configuration will remain in the migrated format."
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

- **Include important consequences in the description**: Users should be able to understand what happens by reading the description, not just the confirmation
- Use confirmations to remind users of key points at the moment of action
- Be specific about what will happen when enabling/disabling
- Keep messages concise but informative
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

Use the `async_subscribe_preview_feature()` helper to subscribe to feature toggle events. The listener receives the event data as an argument and supports async functions:

```python
from homeassistant.components.labs import (
    EventLabsUpdatedData,
    async_subscribe_preview_feature,
)
from homeassistant.core import HomeAssistant

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the integration."""

    async def _async_update_my_preview_feature(
        event_data: EventLabsUpdatedData,
    ) -> None:
        """Enable or disable the preview feature based on current state."""
        if event_data["enabled"]:
            # Enable feature
            await async_enable_my_feature(hass)
        else:
            # Disable feature
            await async_disable_my_feature(hass)

    # Subscribe to changes for this specific feature
    entry.async_on_unload(
        async_subscribe_preview_feature(
            hass,
            DOMAIN,
            "my_preview_feature",
            _async_update_my_preview_feature,
        )
    )

    return True
```

The `async_subscribe_preview_feature()` helper automatically filters events for your domain and feature, and passes the event data (including the `enabled` state) directly to your listener.

:::info
For more complex scenarios or multiple preview features, you can still use the lower-level `EVENT_LABS_UPDATED` event directly. The `async_subscribe_preview_feature()` helper is recommended for most use cases as it reduces boilerplate and improves code readability.
:::

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
3. Link these in your feature definition's `feedback_url`

Choose the channel that best fits your needs. Community forum threads work well for open discussion, while GitHub is better suited for technical feedback and issue tracking.

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
    EventLabsUpdatedData,
    async_is_preview_feature_enabled,
    async_subscribe_preview_feature,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.issue_registry import (
    IssueSeverity,
    async_create_issue,
    async_delete_issue,
)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the integration."""

    @callback
    def _async_update_special_repair(enabled: bool) -> None:
        """Create or delete the special repair issue.

        Creates a repair issue when the special_repair lab feature is enabled,
        and deletes it when disabled. This demonstrates how lab features can interact
        with Home Assistant's repair system.
        """
        if enabled:
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

    async def _async_handle_special_repair_update(
        event_data: EventLabsUpdatedData,
    ) -> None:
        """Handle special_repair lab feature toggle."""
        _async_update_special_repair(event_data["enabled"])

    # Subscribe to labs feature updates
    entry.async_on_unload(
        async_subscribe_preview_feature(
            hass,
            DOMAIN,
            "special_repair",
            _async_handle_special_repair_update,
        )
    )

    # Check if lab feature is currently enabled and create repair if so
    _async_update_special_repair(
        async_is_preview_feature_enabled(hass, DOMAIN, "special_repair")
    )

    return True
```

## Best practices

### Feature design

- Keep preview features focused and testable
- Provide clear enable/disable behavior
- Fail gracefully if something goes wrong
- Log appropriately (use debug level for non-critical info)
- Make the feature fully reversible

### Handling changes

While Labs features can have breaking changes:

- **Avoid breaking changes when possible**: Even in preview, try to maintain compatibility
- **Provide automatic migration when possible**: When breaking changes are necessary, migrate user data and settings automatically if feasible
- **Communicate changes**: Update the feature description and notify users through appropriate channels
- **Take care of users**: Even though it's a preview, users are relying on these features in their homes

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
- Breaking changes are acceptable if they improve the feature, but avoid them when possible
- When breaking changes are necessary, provide automatic migration for users when possible
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

✅ **Do** ensure the feature is fully tested and production-ready before adding it to Labs

✅ **Do** communicate if the feature set may be extended based on feedback
