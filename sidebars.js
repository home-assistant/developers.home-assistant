/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  Addons: [
    "add-ons",
    "add-ons/tutorial",
    "add-ons/configuration",
    "add-ons/communication",
    "add-ons/testing",
    "add-ons/publishing",
    "add-ons/presentation",
    "add-ons/repository",
    "add-ons/security",
  ],
  API: [
    "api/rest",
    "api/websocket",
    {
      type: "category",
      label: "Native App Integration",
      items: [
        "api/native-app-integration",
        "api/native-app-integration/setup",
        "api/native-app-integration/sending-data",
        "api/native-app-integration/sensors",
        "api/native-app-integration/notifications",
        "api/native-app-integration/webview",
      ],
    },
  ],
  Documenting: [
    "documenting",
    "documenting/standards",
    "documenting/create-page",
  ],
  Frontend: [
    "frontend",
    "frontend/architecture",
    "frontend/development",
    "frontend/data",
    "frontend/external-authentication",
    "frontend/external-bus",
    {
      type: "category",
      label: "Extending the frontend",
      items: [
        "frontend/extending/adding-state-card",
        "frontend/extending/adding-more-info-dialogs",
        "frontend/extending/websocket-api",
      ],
    },
    {
      type: "category",
      label: "Custom UI",
      items: [
        "frontend/custom-ui/lovelace-custom-card",
        "frontend/custom-ui/creating-custom-panels",
        "frontend/custom-ui/registering-resources",
      ],
    },
  ],
  Internationalization: [
    "internationalization",
    "internationalization/core",
    "internationalization/custom_integration",
    "translations",
  ],
  OperatingSystem: ["operating-system", "operating-system/debugging"],
  Supervisor: ["supervisor", "supervisor/developing", "supervisor/debugging"],
  // Old structure, still to move/migrate
  Architecture: {
    Architecture: ["architecture_index", "architecture_components"],
    Authentication: [
      "auth_index",
      "auth_permissions",
      "auth_api",
      "auth_auth_provider",
      "auth_auth_module",
    ],
    "Config Entries": ["config_entries_index"],
    "Data Entry Flow": ["data_entry_flow_index"],
    "Entity Registry": ["entity_registry_index", "entity_registry_disabled_by"],
    "Device Registry": ["device_registry_index"],
    "Area Registry": ["area_registry_index"],
  },
  Core: {
    "Development Workflow": [
      "development_index",
      "development_environment",
      "development_submitting",
      "development_guidelines",
      "development_testing",
      "development_catching_up",
    ],
    "Building Integrations": [
      "creating_integration_file_structure",
      "creating_integration_manifest",
      "creating_component_index",
      "config_entries_config_flow_handler",
      "config_entries_options_flow_handler",
      "configuration_yaml_index",
      "dev_101_services",
      "creating_platform_index",
      "creating_component_generic_discovery",
      "reproduce_state_index",
      "integration_fetching_data",
    ],
    "Development Checklist": [
      "development_checklist",
      "creating_component_code_review",
      "creating_platform_code_review",
      "integration_quality_scale_index",
    ],
    "Home Assistant Core 101": [
      "dev_101_index",
      "dev_101_hass",
      "dev_101_events",
      "dev_101_states",
      "dev_101_config",
    ],
    Entities: [
      "core/entity",
      "core/entity/air-quality",
      "core/entity/alarm-control-panel",
      "core/entity/binary-sensor",
      "core/entity/climate",
      "core/entity/cover",
      "core/entity/fan",
      "core/entity/light",
      "core/entity/lock",
      "core/entity/media-player",
      "core/entity/remote",
      "core/entity/sensor",
      "core/entity/switch",
      "core/entity/vacuum",
      "core/entity/water-heater",
      "core/entity/weather",
    ],
    "Device Automations": [
      "device_automation_index",
      "device_automation_trigger",
      "device_automation_condition",
      "device_automation_action",
    ],
    Misc: ["development_validation", "development_typing", "instance_url"],
  },
  Misc: {
    Introduction: ["misc"],
    Intents: [
      "intent_index",
      "intent_firing",
      "intent_handling",
      "intent_conversation",
      "intent_builtin",
    ],
    "Building a Python library": [
      "api_lib_index",
      "api_lib_auth",
      "api_lib_data_models",
    ],
    asyncio: [
      "asyncio_index",
      "asyncio_101",
      "asyncio_categorizing_functions",
      "asyncio_working_with_async",
    ],
    "Maintainer docs": ["maintenance"],
  },
};
