---
title: "푸시 알림"
---

`mobile_app` 컴포넌트는 별도의 외부 컴포넌트를 설치하지 않고도 푸시 알림을 사용자에게 보낼 수 있는 알림 플랫폼이 내장되어 있습니다.

## 푸시 알림 활성화시키기

애플리케이션에서 알림 플랫폼을 활성화하려면, 최초 등록 또는 기존 등록을 업데이트하는 동안 `app_data` 객체에 두 개의 키를 설정해야 합니다.

| 키            | 구분     | 설명                                                             |
| ------------ | ------ | -------------------------------------------------------------- |
| `push_token` | string | 사용자 기기의 고유한 푸시 알림 토큰 예를 들어 APNS 토큰이나 FCM 인스턴스 ID/토큰이 될 수 있습니다. |
| `push_url`   | string | 푸시 알림이 HTTP POSTed 될 서버의 URL 주소.                               |

이러한 키를 설정 한 후에는 알림 대상을 인식 할 수 있도록 Home Assistant 를 다시 시작하도록 사용자에게 알려주어야 합니다. 형식은 `notify.mobile_app_<safed_device_name>` 입니다.

## 서버 컴포넌트 배치하기

알림 플랫폼은 사용자에게 알리는 방법을 가리지 않습니다. 단순히 실제 요청을 처리하는 외부 서버로 알림을 전달할 뿐입니다. 이러한 접근방식은 푸시 알림 인프라를 완전하게 제어할 수 있도록 해줍니다.

Firebase Cloud Functions 와 Firebase Cloud Messaging 을 사용하는 푸시 알림 전달자의 서버 구현 예제는 이 문서의 다음 섹션을 참조해주세요.

서버는 다음과 같이 HTTP POST 페이로드를 받을수 있어야 합니다.

```json
{
  "message": "Hello World",
  "title": "Test message sent via mobile_app.notify",
  "push_token": "my-secure-token",
  "registration_info": {
    "app_id": "io.home-assistant.iOS",
    "app_version": "1.0.0",
    "os_version": "12.2"
  },
  "data": {
    "key": "value"
  }
}
```

알림이 성공적으로 전달 대기중인 것으로 가정 할 경우 201 상태 코드로 응답해야 합니다.

### 오류 관련 사항들

만약 오류가 발생하면 상태 코드 201 또는 429 *이외의* 오류에 대한 설명을 반환해야합니다. 오류 응답은 JSON 객체여야하며 다음 키 중 하나를 포함 할 수 있습니다:

| 키              | 구분     | 설명                                                                                                                                         |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `errorMessage` | string | 제공된 경우 미리 설정된 오류 메시지에 추가됩니다. 예를 들어, `errorMessage`가 "Apple 과 통신할 수 없습니다" 라면, "내부 서버 오류입니다. 나중에 다시 시도해주세요: Apple 과 통신할 수 없습니다"라는 로그가 출력됩니다. |
| `message`      | string | If provided, it will be output directly to the logs at the warning log level.                                                              |

No matter what key you use, you should try to be as descriptive as possible about what went wrong and, if possible, how the user can fix it.

### Rate limits

The notify platform also supports exposing rate limits to users. Home Assistant suggests you implement a conservative rate limit to keep your costs low and also so that users don't overload themselves with too many notifications. For reference, Home Assistant Companion has a maximum sendable notifications per 24 hours of 150 notifications. The rate limit resets for all users at midnight, UTC. You of course are free to use whatever configuration for your own rate limiting.

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

| 키            | 구분                | 설명                                                                                               |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------ |
| `successful` | integer           | The number of successful push notifications the user has sent during the rate limit period.      |
| `errors`     | integer           | The number of failed push notifications the user has sent during the rate limit period.          |
| `maximum`    | integer           | The maximum number of push notifications the user can send during the users rate limit period.   |
| `resetsAt`   | ISO8601 timestamp | The timestamp that the users rate limit period expires at. Must be provided in the UTC timezone. |

The rate limits will be output to the log at the warning log level after every notification is successfully sent. Home Assistant will also output the exact time remaining until the rate limit period resets.

Once the user hits their maximum amount of notifications sent in the rate limit period, you should start responding with a 429 status code until the rate limit period expires. The response object can optionally contain a key, `message` which will be output to the Home Assistant log instead of the standard error message.

The notify platform does not itself implement any kind of rate limit protections. Users will be able to keep sending you notifications, so you should reject them with a 429 status code as early in your logic as possible.

## Example server implementation

The below code is a Firebase Cloud Function that forwards notifications to Firebase Cloud Messaging. To deploy this, you should create a new Firestore database named `rateLimits`. Then, you can deploy the following code. Also, ensure that you have properly configured your project with the correct authentication keys for APNS and FCM.

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