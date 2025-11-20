---
author: Frenck
authorURL: https://github.com/frenck
authorImageURL: https://avatars.githubusercontent.com/u/195327?v=4
title: "Introducing Labs: Preview features before they become standard"
---

We're excited to announce a new system for shipping preview features in Home Assistant: **Labs**. Labs provides a standardized way for integrations to offer critical bug-free features that users can opt into before they become standard.

## What are Labs preview features?

Labs preview features are different from beta testing. While beta testing evaluates release stability, Labs features are already critical bug-free and fully functional. However, their feature set may still be extended or refined as we gather real-world usage and feedback before graduating them to standard.

Think of it this way:

- **Beta**: Testing for stability and bugs
- **Labs**: Critical bug free features with potentially incomplete feature sets, gathering feedback to refine user experience and extend functionality

## How it works

Labs features are defined in an integration's `manifest.json`:

```json
{
  "domain": "my_integration",
  "preview_features": {
    "my_preview_feature": {
      "feedback_url": "https://community.home-assistant.io/t/...",
      "learn_more_url": "https://www.home-assistant.io/integrations/my_integration",
      "report_issue_url": "https://github.com/home-assistant/core/issues/new"
    }
  }
}
```

Users can enable preview features in **Settings** → **System** → **Labs**, and the features activate immediately without requiring a restart.

## Why Labs?

Many of our most significant improvements benefit from real-world testing before becoming standard. Labs provides:

1. **Structured feedback channels**: Each feature has dedicated URLs for feedback, documentation, and issue reporting
2. **Runtime activation**: Features enable and disable instantly, no configuration updates or restart required
3. **Clear expectations**: Users know they're trying a critical bug free preview feature that may have its feature set extended or refined
4. **Iterative development**: Integrate user feedback directly into the development process

## Example: Kitchen Sink special repair

The [Kitchen Sink](https://www.home-assistant.io/integrations/kitchen_sink/) demo integration includes a working example. When enabled, the "special repair" feature creates a repair issue to demonstrate how Labs features can interact with other Home Assistant components.

Here's how it's implemented:

**manifest.json**:
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

**strings.json**:
```json
{
  "preview_features": {
    "special_repair": {
      "name": "Special repair",
      "description": "Creates a **special repair issue** when enabled.\n\nThis demonstrates how lab features can interact with other Home Assistant integrations."
    }
  }
}
```

**__init__.py** (excerpt):

```python
from homeassistant.components.labs import (
    EVENT_LABS_UPDATED,
    EventLabsUpdatedData,
    async_is_preview_feature_enabled,
)
from homeassistant.core import Event
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

@callback
def _async_update_special_repair(hass: HomeAssistant) -> None:
    """Update special repair based on feature state."""
    if async_is_preview_feature_enabled(hass, DOMAIN, "special_repair"):
        # Feature is enabled - create the repair issue
        async_create_issue(
            hass,
            DOMAIN,
            "kitchen_sink_special_repair_issue",
            is_fixable=False,
            severity=IssueSeverity.WARNING,
            translation_key="special_repair",
        )
    else:
        # Feature is disabled - remove the repair issue
        async_delete_issue(hass, DOMAIN, "kitchen_sink_special_repair_issue")

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up the integration."""
    # Subscribe to labs feature updates for runtime toggling
    entry.async_on_unload(
        hass.bus.async_listen(EVENT_LABS_UPDATED, _async_labs_updated)
    )
    
    # Check current state and apply
    _async_update_special_repair(hass)
    
    return True
```

The feature listens for `EVENT_LABS_UPDATED` to react when users toggle it, and creates or removes a repair issue accordingly.

## Getting started

Ready to add a Labs preview feature to your integration? Check out our [comprehensive guide](/docs/development/labs) which covers:

- When to use Labs (and when not to)
- How to define features in your manifest
- Implementation patterns for backend and frontend features
- Runtime activation requirements
- Testing approaches
- Feature lifecycle (preview → standard or removal)

## What's next?

We encourage integration developers to consider Labs for:

- Major UI changes or redesigns
- New subsystems that benefit from real-world testing
- Features where user feedback will shape the final design

Labs is **not** for:

- Permanent configuration options (use integration options instead)
- Minor changes that can go directly into releases
- Features with critical bugs or that are fundamentally incomplete

## Try it yourself

Want to see Labs in action? Install the Kitchen Sink demo integration and enable the "Special repair" feature in Settings → System → Labs. You'll see firsthand how preview features work.
