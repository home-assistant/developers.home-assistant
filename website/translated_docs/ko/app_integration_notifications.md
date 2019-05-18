---
title: "푸시 알림"
---

`mobile_app` 컴포넌트는 별도의 외부 컴포넌트를 설치하지 않고도 푸시 알림을 사용자에게 보낼 수 있는 알림 플랫폼이 내장되어 있습니다.

## 푸시 알림 활성화시키기

애플리케이션에서 알림 플랫폼을 활성화하려면, 최초 등록 또는 기존 등록을 업데이트하는 동안 `app_data` 객체에 두 개의 키를 설정해야 합니다.

| 키            | 구분     | 설명                                                              |
| ------------ | ------ | --------------------------------------------------------------- |
| `push_token` | string | 사용자 기기의 고유한 푸시 알림 토큰. 예를 들어 APNS 토큰이나 FCM 인스턴스 ID/토큰이 될 수 있습니다. |
| `push_url`   | string | 푸시 알림이 HTTP POSTed 될 서버의 URL 주소.                                |

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
| `message`      | string | 제공된 경우, 경고 로그 수준(warning log level) 의 로그로 직접 출력됩니다.                                                                                        |

어떤 키를 사용하든 상관없이 무엇이 잘못되었는지, 가능하다면 사용자가 어떻게 고칠 수 있는지에 대해 가능한 한 서술적으로 작성해야 합니다.

### 빈도 제한

알림 플랫폼은 사용자에게 노출 빈도 제한을 지원합니다. Home Assistant 는 비용을 낮게 유지하고 또한 사용자가 지나치게 많은 알림으로 과부하가 걸리지 않도록 보수적인 빈도 제한을 제공하는 것을 제안합니다. 참고로, Home Assistant Companion 이 가지고 있는 보낼 수 있는 최대 알림은 24시간 동안 150개 입니다. 빈도 제한은 모든 사용자에 대해 UTC 자정에 재설정됩니다. 물론, 자신의 빈도 제한에 대한 구성은 자유롭게 사용할 수 있습니다.

빈도 제한을 구현하도록 선택한 경우 성공적인 서버 응답은 다음과 같아야 합니다:

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

| 키            | 구분                | 설명                                        |
| ------------ | ----------------- | ----------------------------------------- |
| `successful` | integer           | 빈도 제한 기간 동안 사용자가 보낸 성공한 푸시 알림의 개수.        |
| `errors`     | integer           | 빈도 제한 기간 동안 사용자가 보낸 실패한 푸시 알림의 개수.        |
| `maximum`    | integer           | 빈도 제한 기간 동안 사용자가 보낼 수 있는 푸시 알림의 최대 개수.    |
| `resetsAt`   | ISO8601 timestamp | 사용자의 빈도 제한 기간이 만료되는 시간. UTC 시간대로 제공되어야 함. |

빈도 제한은 매 알림이 성공적으로 보내진 후에 경고 로그 수준의 로그에 출력됩니다. Home Assistant 는 또한 빈도 제한 기간이 재설정되기 까지 남은 정확한 시간을 출력합니다.

사용자가 빈도 제한 기간에 최대 알림수에 도달하면, 빈도 제한 기간이 만료 될 때까지 429 상태 코드로 응답을 시작해야합니다. 응답 객체는 부수적으로, 출력되는 표준 오류 메시지 대신 Home Assistant 로그에 키, `message` 를 포함할 수 있습니다.

알림 플랫폼은 어떤 종류의 빈도 제한 보호도 자체적으로 구현하지 않습니다. 사용자는 계속 알림을 보낼 수 있으므로 최대한 논리적으로 빨리 429 상태 코드를 사용하여 알림을 거부해야 합니다.

## 서버 구현 예시

아래의 코드는 Firebase Cloud Messaging 에 알림을 전달하는 Firebase Cloud Function 입니다. 배치하려면 `rateLimits ` 라는 Firestore 데이터베이스를 새로 만들어야 합니다. 그런 다음, 다음의 코드를 배치할 수 있습니다. 또한, APNS 및 FCM 에 대해 올바른 인증키로 프로젝트를 올바르게 구성했는지 확인해주세요.

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