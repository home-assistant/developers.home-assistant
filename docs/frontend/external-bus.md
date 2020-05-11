---
title: "External Bus"
---

The frontend is able to set up a message bus with an external app that is embedding the Home Assistant frontend. This system is a generalization of the [external auth](frontend_external_auth.md), making it easier to add more commands in the future without extensive plumbing on either the app or frontend side.

## Message exchange

Just like external auth, message exchange is achieved by the external app making a JavaScript method available.

Messages are passed to the external app as serialized JSON objects. The function that will be called takes a single parameter: a string. The external app will have to process the message and deal with it accordingly (or ignore it).

On Android, your app needs to define the following method:

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

### Action and Info Message format

The format of a message that contains or provides information is the same. It contains an identifier, a type and an optional payload (depending on the type).

A result message will re-use the identifier in the response, to indicate to which action the response is related.

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

### Result Message Format

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

### Get External Config

Available in: Home Assistant 0.92
Type: `config/get`
Direction: frontend to external app.
Expects answer: yes

Query the external app for the external configuration. The external configuration is used to customize the experience in the frontend.

Expected response payload:

```ts
{
  hasSettingsScreen: boolean;
}
```

- `hasSettingsScreen` set to true if the external app will show a configuration screen when it receives the command `config_screen/show`. If so, a new option will be added to the sidebar to trigger the configuration screen.

### Show Config Screen `config_screen/show`

Available in: Home Assistant 0.92
Type: `config_screen/show`
Direction: frontend to external app.
Expect answer: no

Show the configuration screen of the external app.

### Connection Status update `connection-status`

Available in: Home Assistant 0.92
Type: `connection-status`
Direction: frontend to external app.
Expect answer: no

Notify the external app if the frontend is connected to Home Assistant.

Payload structure:

```ts
{
  event: "connected" | "auth-invalid" | "disconnected";
}
```

### Trigger Haptic `haptic`

Available in: Home Assistant 0.92
Type: `haptic`
Direction: frontend to external app.
Expect answer: no

Notify the external app to trigger haptic feedback.

Payload structure:

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
