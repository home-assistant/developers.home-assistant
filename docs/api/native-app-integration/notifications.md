---
title: "Push Notifications"
---

The `mobile_app` integration has a notify platform built in that allows for a generic way to send push notifications to your users without requiring installation of an external custom component. Push notifications can either be delivered via a websocket connection or via a cloud service.

## Enabling websocket push notifications

Your app can connect via the WebSocket API to Home Assistant to subscribe to push notifications. To enable this your app needs to either subscribe to cloud push notifications or add the `push_websocket_channel: true` to the `app_data` object in your registration.

To create a websocket channel create a push notification subscription:

```json
{
  "id": 2,
  "type": "mobile_app/push_notification_channel",
  "webhook_id": "abcdefghkj",
  "support_confirm": true // optional
}
```

All push notifications will be delivered as an event over the websocket connection:

```json
{
  "id": 2,
  "type": "event",
  "event": {
    "message": "Hello world",
    "hass_confirm_id": "12345" // if confirm = true
  },
}
```

If confirmation is enabled, you have to send a websocket command to confirm:

```json
{
  "id": 3,
  "type": "mobile_app/push_notification_confirm",
  "webhook_id": "abcdefghkj",
  "confirm_id": "12345"
}
```

If a registration supports cloud push notifications and is connected to receive local push notifications, notifications will be delivered locally first and fallback to cloud if the application doesn't confirm the notification.

## Enabling cloud push notifications

To enable the notify platform for your application, you must set two keys in the `app_data` object during the initial registration or later update of an existing registration.

| Key | Type | Description
| --- | ---- | -----------
| `push_token` | string | A push notification token unique to your users device. For example, this could be an APNS token or an FCM Instance ID/token.
| `push_url` | string | The URL on your server that push notifications will be HTTP POSTed to.

You should advise the user to restart Home Assistant after you set these keys in order for them to see the notify target. It will have the format `notify.mobile_app_<saved_device_name>`.

### Deploying a server component

The notify platform doesn't concern itself with how to notify your users. It simply forwards a notification to your external server where you should actually handle the request.
This approach allows you to maintain full control over your push notification infrastructure.

See the next section of this document for an example server implementation of a push notification forwarder that uses Firebase Cloud Functions and Firebase Cloud Messaging.

Your server should accept a HTTP POST payload like this:

```json
{
  "message": "Hello World",
  "title": "Test message sent via mobile_app.notify",
  "push_token": "my-secure-token",
  "registration_info": {
    "app_id": "io.home-assistant.iOS",
    "app_version": "1.0.0",
    "os_version": "12.2",
    "webhook_id": "webhook_id_from_registration"
  },
  "data": {
    "key": "value"
  }
}
```

:::info
`webhook_id` will only be included from core-2021.11 or later.
:::

It should respond with a 201 status code assuming the notification was queued for delivery successfully.

### Errors

If an error occurs you should return a description of what went wrong with a status code _other than_ 201 or 429. An error response must be a JSON object and can contain one of the following keys:

| Key | Type | Description
| --- | ---- | -----------
| `errorMessage` | string | If provided, it will be appended to a preset error message. For example, if `errorMessage` is "Could not communicate with Apple" it will be output in the log like "Internal server error, please try again later: Could not communicate with Apple"
| `message` | string | If provided, it will be output directly to the logs at the warning log level.

No matter what key you use, you should try to be as descriptive as possible about what went wrong and, if possible, how the user can fix it.

### Rate limits

The notify platform also supports exposing rate limits to users. Home Assistant suggests you implement a conservative rate limit to keep your costs low and also so that users don't overload themselves with too many notifications.
For reference, Home Assistant Companion has a maximum sendable notifications per 24 hours of 150 notifications. The rate limit resets for all users at midnight, UTC. You of course are free to use whatever configuration for your own rate limiting.

If you choose to implement rate limiting, your successful server response should look like the following:

```json
{
  "rateLimits": {
    "successful": 1,
    "errors": 5,
    "maximum": 150,
    "resetsAt": "2019-04-08T00:00:00.000Z"
  }
}
```

| Key | Type | Description
| --- | ---- | -----------
| `successful` | integer | The number of successful push notifications the user has sent during the rate limit period.
| `errors` | integer | The number of failed push notifications the user has sent during the rate limit period.
| `maximum` | integer | The maximum number of push notifications the user can send during the users rate limit period.
| `resetsAt` | ISO8601 timestamp | The timestamp that the users rate limit period expires at. Must be provided in the UTC timezone.

The rate limits will be output to the log at the warning log level after every notification is successfully sent. Home Assistant will also output the exact time remaining until the rate limit period resets.

Once the user hits their maximum amount of notifications sent in the rate limit period, you should start responding with a 429 status code until the rate limit period expires. The response object can optionally contain a key, `message` which will be output to the Home Assistant log instead of the standard error message.

The notify platform does not itself implement any kind of rate limit protections. Users will be able to keep sending you notifications, so you should reject them with a 429 status code as early in your logic as possible.

### Example server implementation

The below code is a Firebase Cloud Function that forwards notifications to Firebase Cloud Messaging. To deploy this, you should create a new Firestore database named `rateLimits`. Then, you can deploy the following code.
Also, ensure that you have properly configured your project with the correct authentication keys for APNS and FCM.

```javascript
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

var db = admin.firestore();

const MAX_NOTIFICATIONS_PER_DAY = 150;

exports.sendPushNotification = functions.https.onRequest(async (req, res) => {
  console.log('Received payload', req.body);
  var today = getToday();
  var token = req.body.push_token;
  var ref = db.collection('rateLimits').doc(today).collection('tokens').doc(token);

  var payload = {
    notification: {
      body: req.body.message,
    },
    token: token,
  };

  if(req.body.title) {
    payload.notification.title = req.body.title;
  }

  if(req.body.data) {
    if(req.body.data.android) {
      payload.android = req.body.data.android;
    }
    if(req.body.data.apns) {
      payload.apns = req.body.data.apns;
    }
    if(req.body.data.data) {
      payload.data = req.body.data.data;
    }
    if(req.body.data.webpush) {
      payload.webpush = req.body.data.webpush;
    }
  }

  console.log('Notification payload', JSON.stringify(payload));

  var docExists = false;
  var docData = {
    deliveredCount: 0,
    errorCount: 0,
    totalCount: 0,
  };

  try {
    let currentDoc = await ref.get();
    docExists = currentDoc.exists;
    if(currentDoc.exists) {
      docData = currentDoc.data();
    }
  } catch(err) {
    console.error('Error getting document!', err);
    return handleError(res, 'getDoc', err);
  }

  if(docData.deliveredCount > MAX_NOTIFICATIONS_PER_DAY) {
    return res.status(429).send({
      errorType: 'RateLimited',
      message: 'The given target has reached the maximum number of notifications allowed per day. Please try again later.',
      target: token,
      rateLimits: getRateLimitsObject(docData),
    });
  }

  docData.totalCount = docData.totalCount + 1;

  var messageId;
  try {
    messageId = await admin.messaging().send(payload);
    docData.deliveredCount = docData.deliveredCount + 1;
  } catch(err) {
    docData.errorCount = docData.errorCount + 1;
    await setRateLimitDoc(ref, docExists, docData, res);
    return handleError(res, 'sendNotification', err);
  }

  console.log('Successfully sent message:', messageId);

  await setRateLimitDoc(ref, docExists, docData, res);

  return res.status(201).send({
    messageId: messageId,
    sentPayload: payload,
    target: token,
    rateLimits: getRateLimitsObject(docData),
  });

});

async function setRateLimitDoc(ref, docExists, docData, res) {
  try {
    if(docExists) {
      console.log('Updating existing doc!');
      await ref.update(docData);
    } else {
      console.log('Creating new doc!');
      await ref.set(docData);
    }
  } catch(err) {
    if(docExists) {
      console.error('Error updating document!', err);
    } else {
      console.error('Error creating document!', err);
    }
    return handleError(res, 'setDocument', err);
  }
  return true;
}

function handleError(res, step, incomingError) {
  if (!incomingError) return null;
  console.error('InternalError during', step, incomingError);
  return res.status(500).send({
    errorType: 'InternalError',
    errorStep: step,
    message: incomingError.message,
  });
}

function getToday() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  return yyyy + mm + dd;
}

function getRateLimitsObject(doc) {
  var d = new Date();
  return {
    successful: (doc.deliveredCount || 0),
    errors: (doc.errorCount || 0),
    total: (doc.totalCount || 0),
    maximum: MAX_NOTIFICATIONS_PER_DAY,
    remaining: (MAX_NOTIFICATIONS_PER_DAY - doc.deliveredCount),
    resetsAt: new Date(d.getFullYear(), d.getMonth(), d.getDate()+1)
  };
}
```
