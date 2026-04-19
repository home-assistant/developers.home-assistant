---
title: "External bus"
---

The frontend is able to set up a message bus with an external app that is embedding the Home Assistant frontend. This system is a generalization of the [external authentication](frontend/external-authentication.md), making it easier to add more commands in the future without extensive plumbing on either the app or frontend side.

## Message exchange

Just like external auth, message exchange is achieved by the external app making a JavaScript method available.

Messages are passed to the external app as serialized JSON objects. The function that will be called takes a single parameter: a string. The external app will have to process the message and deal with it accordingly (or ignore it).

On Android, the implementation depends on the WebView features:

**V2 (recommended)**: Uses [`WebViewFeature.WEB_MESSAGE_LISTENER`][web-message-listener] for secure origin validation. The frontend sends messages using the injected V2 object:

**V1 (fallback)**: Used when the WebView doesn't support [`WebViewFeature.WEB_MESSAGE_LISTENER`][web-message-listener]. Your app needs to define:

```ts
window.externalApp.externalBus(message: string)
```

On iOS, your app needs to define the following method:

```ts
window.webkit.messageHandlers.externalBus.postMessage(message: string);
```

To send messages to the frontend, serialize your message to JSON and call the following function from the external app:

```ts
window.externalBus(message: string)
```

## Message format

The message describes an action or a piece of information that the sender wants the receiver to do or know about. If it's an action, the sender will expect a response with the result of that action. A response to a command can either be successful or failed.

### Action and info message format

The format of a message that contains or provides information is the same. It contains an identifier, a type and an optional payload (depending on the type).

A result message will reuse the identifier in the response, to indicate to which action the response is related.

The basic format of a message is the following:

```ts
{
  id: number;
  type: string;
  payload?: unknown;
}
```

An example message:

```json
{
  "id": 5,
  "type": "config/get"
}
```

### Result message format

If the message was an action, the sender will expect a response with the result. The response is either success or failure.

The type of result depends on the type of the message that it is responding to. For example, if it is responding to `config/get`, the result should be an object describing the configuration.

Message formats:

```ts
interface SuccessResult {
  id: number;
  type: "result";
  success: true;
  result: unknown;
}

interface ErrorResult {
  id: number;
  type: "result";
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

## Supported messages

Messages are organized by direction: from frontend to app, and from app to frontend.

### Messages from frontend to app

These messages are sent from the Home Assistant frontend to the external app.

#### Messages expecting a response

##### `config/get`

Query the external app for the external configuration. The external configuration is used to customize the experience in the frontend.

Payload: None

Expected response:

```ts
{
  hasSettingsScreen?: boolean;
  hasSidebar?: boolean;
  canWriteTag?: boolean;
  hasExoPlayer?: boolean;
  canCommissionMatter?: boolean;
  canImportThreadCredentials?: boolean;
  canTransferThreadCredentialsToKeychain?: boolean;
  hasAssist?: boolean;
  hasBarCodeScanner?: number;
  canSetupImprov?: boolean;
  appVersion?: string;
  hasEntityAddTo?: boolean;
  hasAssistSettings?: boolean;
}
```

- `hasSettingsScreen`: Set to true if the external app will show a configuration screen when it receives `config_screen/show`
- `hasSidebar`: Set to true if the external app has a sidebar
- `canWriteTag`: Set to true if the external app can write NFC tags (i.e., the device has NFC hardware)
- `hasExoPlayer`: Set to true if the app supports HLS video playback via ExoPlayer
- `canCommissionMatter`: Set to true if the app can commission Matter devices
- `canImportThreadCredentials`: Set to true if the app can import Thread credentials
- `canTransferThreadCredentialsToKeychain`: Set to true if the app can transfer Thread credentials to the keychain (Apple only)
- `hasAssist`: Set to true if the app has a native Assist interface, replacing the frontend implementation
- `hasBarCodeScanner`: Set to `1` if the app has bar code scanning capability, `0` otherwise
- `canSetupImprov`: Set to true if the app can set up Improv Wi-Fi devices
- `appVersion`: The version string of the native app
- `hasEntityAddTo`: Set to true if the app supports adding entities to platform-specific locations (e.g., homescreen widget)
- `hasAssistSettings`: Set to true if the app has an Assist settings screen

##### `entity/add_to/get_actions`

Get available actions for adding an entity to the device (e.g., homescreen, watch face).

Payload:

```ts
{
  entity_id: string;
}
```

Expected response:

```ts
{
  actions: Array<{
    enabled: boolean;
    name: string;
    details?: string;
    mdi_icon: string;
    app_payload: string;
  }>;
}
```

- `enabled`: Whether the action is currently available
- `name`: Display name of the action
- `details`: Optional additional details about the action
- `mdi_icon`: Material Design Icon identifier for the action (e.g., "mdi:car")
- `app_payload`: Opaque string to be sent back in `entity/add_to` to execute the action

#### Messages not expecting a response

##### `assist/settings`

Open the Assist settings screen.

Payload: None

##### `assist/show`

Show the native Assist interface.

Payload (optional):

```ts
{
  pipeline_id: "preferred" | "last_used" | string;
  start_listening: boolean;
}
```

- `pipeline_id`: The pipeline to use, or "preferred"/"last_used" for automatic selection
- `start_listening`: Whether to start listening immediately

##### `bar_code/close`

Close the bar code scanner.

Payload: None

##### `bar_code/notify`

Show a notification message in the bar code scanner.

Payload:

```ts
{
  message: string;
}
```

##### `bar_code/scan`

Start scanning a bar code.

Payload:

```ts
{
  title: string;
  description: string;
  alternative_option_label?: string;
}
```

- `title`: Title to show in the scanner UI (required)
- `description`: Description text to show in the scanner UI (required)
- `alternative_option_label`: Optional label for an alternative action button, if not included the alternative action button should be hidden

##### `config_screen/show`

Show the configuration screen of the external app.

Payload: None

##### `connection-status`

Notify the external app if the frontend is connected to Home Assistant.

Payload:

```ts
{
  event: "connected" | "auth-invalid" | "disconnected";
}
```

##### `entity/add_to`

Add an entity to a platform-specific location (e.g., homescreen widget).

Payload:

```ts
{
  entity_id: string;
  app_payload: string;
}
```

- `entity_id`: The entity to add
- `app_payload`: Opaque string received from `entity/add_to/get_actions`

##### `exoplayer/play_hls`

Play an HLS video stream.

Payload:

```ts
{
  url: string;
  muted: boolean;
}
```

- `url`: The HLS stream URL
- `muted`: Whether to start playback muted

##### `exoplayer/resize`

Resize the HLS video player.

Payload:

```ts
{
  left: number;
  top: number;
  right: number;
  bottom: number;
}
```

- `left`: Left coordinate of the player
- `top`: Top coordinate of the player
- `right`: Right coordinate of the player
- `bottom`: Bottom coordinate of the player

##### `exoplayer/stop`

Stop HLS video playback.

Payload: None

##### `focus_element`

Focus a specific element in the frontend.

Payload:

```ts
{
  element_id: string;
}
```

- `element_id`: The ID of the element to focus

##### `haptic`

Notify the external app to trigger haptic feedback.

Payload:

```ts
{
  hapticType:
    | "success"
    | "warning"
    | "failure"
    | "light"
    | "medium"
    | "heavy"
    | "selection";
}
```

##### `improv/configure_device`

Configure a discovered Improv Wi-Fi device.

Payload:

```ts
{
  name: string;
}
```

- `name`: The name of the device to configure

##### `improv/scan`

Start scanning for Improv Wi-Fi devices.

Payload: None

##### `matter/commission`

Start the Matter device commissioning flow.

Payload (optional):

```ts
{
  mac_extended_address: string | null;
  extended_pan_id: string | null;
  border_agent_id: string | null;
  active_operational_dataset: string | null;
}
```

All payload properties describe the preferred Thread network which should be used when commissioning a Matter over Thread device.

- `mac_extended_address`: The MAC extended address
- `extended_pan_id`: The extended PAN ID
- `border_agent_id`: The border agent ID
- `active_operational_dataset`: The active operational dataset (TLV)

##### `sidebar/show`

Show the sidebar.

Payload: None

##### `tag/write`

Tell the external app to open the UI to write to a tag.

Payload:

```ts
{
  tag: string;
  name: string | null;
}
```

- `tag`: The tag ID to write
- `name`: The name of the tag as entered by the user, or `null` if no name has been set

##### `theme-update`

Notify the app that the theme has been updated. The app should refresh its status bar and navigation bar colors.

Payload: None

##### `thread/import_credentials`

Import Thread network credentials from the device. Credentials should be sent using the [WebSocket API](/docs/api/websocket)

Payload: None

##### `thread/store_in_platform_keychain`

Store Thread credentials in the platform keychain.

Payload:

```ts
{
  mac_extended_address: string | null;
  border_agent_id: string | null;
  active_operational_dataset: string;
  extended_pan_id: string;
}
```

- `mac_extended_address`: The MAC extended address
- `border_agent_id`: The border agent ID
- `active_operational_dataset`: The active operational dataset (TLV)
- `extended_pan_id`: The extended PAN ID

### Messages from app to frontend

These messages are sent from the external app to the Home Assistant frontend.

#### Messages expecting a response

All commands in this section receive a result message back from the frontend:

```ts
{
  id: number;
  type: "result";
  success: boolean;
  result: null;
  error?: { code: string; message: string };
}
```

##### `automation/editor/show`

Open the automation editor to create a new automation. The config can be used to pre-fill the editor with specific triggers, conditions, and actions.

Payload (optional):

```ts
{
  config?: {
    alias?: string;
    description?: string;
    triggers?: Trigger | Trigger[];
    conditions?: Condition | Condition[];
    actions?: Action | Action[];
    mode?: "single" | "restart" | "queued" | "parallel";
    max?: number;
  };
}
```

- `config.alias`: Pre-filled name for the automation
- `config.description`: Pre-filled description
- `config.triggers`: One or more triggers to pre-populate
- `config.conditions`: One or more conditions to pre-populate
- `config.actions`: One or more actions to pre-populate
- `config.mode`: Execution mode for the automation
- `config.max`: Maximum number of concurrent runs (only applies to `queued` and `parallel` modes)

##### `bar_code/aborted`

Notify that barcode scanning was aborted.

Payload:

```ts
{
  reason: "canceled" | "alternative_options";
}
```

##### `bar_code/scan_result`

Send a bar code scanner result to the frontend.

Payload:

```ts
{
  rawValue: string;
  format:
    | "aztec"
    | "code_128"
    | "code_39"
    | "code_93"
    | "codabar"
    | "data_matrix"
    | "ean_13"
    | "ean_8"
    | "itf"
    | "pdf417"
    | "qr_code"
    | "upc_a"
    | "upc_e"
    | "unknown";
}
```

- `rawValue`: A string decoded from the barcode data
- `format`: The barcode format as defined by the [Barcode Detection API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API#supported_barcode_formats)

##### `improv/device_setup_done`

Notify that Improv Wi-Fi device setup is complete.

Payload: None

##### `improv/discovered_device`

Notify that an Improv Wi-Fi device was discovered.

Payload:

```ts
{
  name: string;
}
```

##### `kiosk_mode/set`

Enable or disable kiosk mode.

##### `navigate`

Navigate to a specific path in the frontend.

Payload:

```ts
{
  path: string;
  options?: {
    replace?: boolean;
    data?: any;
  };
}
```

- `path`: Absolute path to navigate to (for example, `/config/voice-assistants/assistants`). The path is passed directly to `history.pushState` or `history.replaceState`, so it must start with `/`
- `options.replace`: If true, replaces the current browser history entry instead of pushing a new one.
- `options.data`: Optional data to store in the browser history state, accessible via `history.state`

##### `notifications/show`

Show the notifications panel.

Payload: None

##### `restart`

Request the frontend to restart.

Payload: None

##### `sidebar/show`

Show the sidebar. Returns an error response with code `not_allowed` if a dialog is currently open.

Payload: None

##### `sidebar/toggle`

Toggle the sidebar open/closed. Returns an error response with code `not_allowed` if a dialog is currently open.

Payload: None

Payload:

```ts
{
  enable: boolean;
}
```

[web-message-listener]: https://developer.android.com/reference/androidx/webkit/WebViewCompat.WebMessageListener
