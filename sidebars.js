/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const iqs_rules_by_tier = require('./docs/core/integration-quality-scale/_includes/tiers.json');
const iqs_rules = Object.values(iqs_rules_by_tier).flat().map((rule) => {
    if (typeof rule === "string") {
        return rule;
    }
    return rule.id;
});



module.exports = {
  Apps: [
    "apps",
    "apps/tutorial",
    "apps/configuration",
    "apps/communication",
    "apps/testing",
    "apps/publishing",
    "apps/presentation",
    "apps/repository",
    "apps/security",
  ],
  Overview: [
    "architecture_index",
    "setup_devcontainer_environment"
  ],
  Frontend: [
    "frontend",
    "frontend/architecture",
    "frontend/design",
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
        "frontend/custom-ui/custom-card",
        "frontend/custom-ui/custom-card-feature",
        "frontend/custom-ui/custom-badge",
        "frontend/custom-ui/custom-strategy",
        "frontend/custom-ui/custom-view",
        "frontend/custom-ui/creating-custom-panels",
        "frontend/custom-ui/registering-resources",
      ],
    },
  ],
  Internationalization: [
    "translations",
    "internationalization",
    "internationalization/core",
    "internationalization/custom_integration",
  ],
  OperatingSystem: [
    "operating-system",
    "operating-system/getting-started",
    "operating-system/configuration",
    "operating-system/debugging",
    "operating-system/partition",
    "operating-system/board-metadata",
    "operating-system/network",
    "operating-system/deployment",
    "operating-system/update-system",
    {
      type: "category",
      label: "Board support",
      items: [
        "operating-system/boards/overview",
        "operating-system/boards/asus",
        "operating-system/boards/generic-aarch64",
        "operating-system/boards/generic-x86-64",
        "operating-system/boards/hardkernel",
        "operating-system/boards/odroid-c2",
        "operating-system/boards/odroid-c4",
        "operating-system/boards/odroid-m1",
        "operating-system/boards/odroid-m1s",
        "operating-system/boards/odroid-n2",
        "operating-system/boards/odroid-xu4",
        "operating-system/boards/raspberrypi",
        "operating-system/boards/ova",
      ],
    },
  ],
  Supervisor: [
    "supervisor",
    "supervisor/development",
    "supervisor/debugging",
    {
      type: "category",
      label: "Supervisor API",
      items: [
        "api/supervisor/endpoints",
        "api/supervisor/models",
        "api/supervisor/examples",
      ],
    },
  ],
  Core: [
    "development_index",
    {
      type: "category",
      label: "Architecture",
      items: ["architecture/core", "architecture_components"],
    },
    {
      type: "category",
      label: "Development Workflow",
      items: [
        "development_environment",
        "development_submitting",
        "development_guidelines",
        "development_testing",
        "development_catching_up",
        "development_tips",
      ],
    },
    {
      type: "category",
      label: "Building Integrations",
      items: [
        "creating_component_index",
        "creating_integration_file_structure",
        "creating_integration_tests_file_structure",
        "creating_integration_manifest",
        "config_entries_config_flow_handler",
        "config_entries_options_flow_handler",
        "core/integration_diagnostics",
        "core/integration_system_health",
        "configuration_yaml_index",
        "dev_101_services",
        "creating_platform_index",
        "creating_component_generic_discovery",
        "integration_fetching_data",
        "integration_setup_failures",
        "integration_events",
        "integration_listen_events",
        "network_discovery",
        {
          type: "category",
          label: "Bluetooth",
          items: [
            "bluetooth",
            "core/bluetooth/bluetooth_fetching_data",
            "core/bluetooth/api",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Development Checklist",
      items: [
        "development_checklist",
        "creating_component_code_review",
        "creating_platform_code_review",
      ],
    },
    {
      type: "category",
      label: "Integration Quality Scale",
      link: {type: 'doc', id: 'core/integration-quality-scale/index'},
      items: [
        {type: 'doc', id: 'core/integration-quality-scale/checklist'},
        {
          type: 'category',
          label: 'Rules',
          link: {type: 'doc', id: 'core/integration-quality-scale/rules'},
          items: iqs_rules.map(rule => ({
            type: 'doc',
            id: `core/integration-quality-scale/rules/${rule.toLowerCase()}`
          }))}
      ]
    },
    {
      type: "category",
      label: "The `hass` object",
      items: [
        "dev_101_hass",
        "dev_101_events",
        "dev_101_states",
        "dev_101_config",
      ],
    },
    {
      type: "category",
      label: "Entities",
      items: [
        "core/entity",
        {
          type: "autogenerated",
          dirName: "core/entity",
        },
      ],
    },
    {
      type: "category",
      label: "Areas, Devices and Entities",
      items: [
        "architecture/devices-and-services",
        "entity_registry_index",
        "entity_registry_disabled_by",
        "device_registry_index",
        "area_registry_index",
      ],
    },
    {
      type: "category",
      label: "Authentication",
      items: [
        "auth_index",
        "auth_permissions",
        "auth_api",
        "auth_auth_provider",
        "auth_auth_module",
      ],
    },
    "config_entries_index",
    "data_entry_flow_index",
    "development/labs",
    "automations",
    {
      type: "category",
      label: "Device Automations",
      items: [
        "device_automation_index",
        "device_automation_trigger",
        "device_automation_condition",
        "device_automation_action",
      ],
    },
    {
      type: "category",
      label: "Intents",
      items: [
        "intent_index",
        "intent_firing",
        "intent_handling",
        "intent_builtin",
      ],
    },
    {
      type: "category",
      label: "Conversation",
      items: ["intent_conversation_api"],
    },
    "core/llm/index",
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
    "creating_integration_brand",
    "core/platform/application_credentials",
    "core/platform/backup",
    "core/platform/raising_exceptions",
    "core/platform/repairs",
    "core/platform/reproduce_state",
    "core/platform/significant_change",
    {
      type: "category",
      label: "External APIs",
      items: ["api/websocket", "api/rest"],
    },
    {
      type: "category",
      label: "Misc",
      items: ["development_validation", "development_typing", "instance_url"],
    },
  ],
  Voice: [
    "voice/overview",
    "voice/intents/index",

    {
      type: "category",
      label: "Intent Recognition",
      items: [
        "voice/intent-recognition/index",
        "voice/intent-recognition/template-sentence-syntax",
        "voice/intent-recognition/test-syntax",
        "voice/intent-recognition/supported-languages",
        "voice/intent-recognition/contributing",
        "voice/intent-recognition/style-guide",
      ],
    },

    "voice/pipelines/index",
    "voice/language-leaders",
    "voice/contributing-your-voice",
  ],

  Misc: [
    "misc",
    "review-process",
    // Documenting as a category
    {
      type: "category",
      label: "Documenting",
      items: [
        "documenting",
        "documenting/standards",
        "documenting/general-style-guide",
        "documenting/yaml-style-guide",
        "documenting/create-page",
        "documenting/remove-page",
        "documenting/integration-docs-examples",
      ],
    },

    {
      type: "category",
      label: "Building a Python library",
      items: ["api_lib_index", "api_lib_auth", "api_lib_data_models"],
    },
    {
      type: "category",
      label: "asyncio",
      items: [
        "asyncio_index",
        "asyncio_101",
        "asyncio_categorizing_functions",
        "asyncio_working_with_async",
        "asyncio_thread_safety",
        "asyncio_blocking_operations",
        "asyncio_imports",
      ],
    },
  ],
  Android: [
    "android",
    "android/get_started",
    "android/architecture",
    "android/targets",
    "android/app_flavors",
    {
      type: "category",
      label: "Testing",
      items: [
        "android/testing/introduction",
        "android/testing/unit_testing",
        "android/testing/screenshot_testing",
        "android/testing/integration_testing",
      ],
    },
    {
      type: "category",
      label: "Tips",
      items: [
        "android/tips/compose_101",
        "android/tips/dependencies",
        "android/tips/leak_canary",
        "android/tips/lollipop_emulator",
        "android/tips/fcm_push_notification",
        "android/tips/sarif_reports",
        "android/tips/release",
        "android/tips/dev_playground",
        "android/tips/strict_mode",
        "android/tips/testing_pr_builds",
      ],
    },
    "android/best_practices",
    "android/ci",
    "android/codestyle",
    "android/linter",
    "android/submit",
    "android/release",
  ]
};
