---
title: "Notificacions emergents"
---

El component `mobile_app` conté una plataforma de notificacions integrada que permet de manera genèrica enviar notificacions emergents a usuaris sense la necessitat d'haver d'instal·lar components externs.

## Habilitació de les notificacions emergents

Per habilitar la plataforma de notificacions a la teva aplicació, has d'establir dues claus dins l'objecte `app_data` durant el primer registre o més tard actualitzant un registre existent.

| Clau         | Tipus  | Descripció                                                                                                                               |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `push_token` | string | Testimoni (token) de notificació únic per a cada dispositiu d'usuari. Per exemple, podria ser una testimoni APNS o una instància ID FCM. |
| `push_url`   | string | Enllaç en el teu servidor on les notificacions emergents seran publicades (HTTP POST).                                                   |

Hauries d'avisar a l'usuari que reiniciï Home Assistant una vegada s'hagin establert aquestes claus perquè quedi ben configurat el destinatari de les notificacions. Tindrà el format `notify.mobile_app_<safed_device_name>`.

## Desplegament d'un component del servidor

La plataforma de notificacions no té en compte com notificar els usuaris. Simplement reenvia una notificació al teu servidor extern lloc on hauràs de gestionar la sol·licitud. D'aquesta manera pots tenir el control total sobre la infraestructura de notificacions emergents.

Consulta la següent secció del document on hi ha un exemple d'implementació d'un servidor de notificacions emergents que utilitza Cloud Functions i Cloud Messaging (FCM) de Firebase.

El teu servidor ha de poder acceptar missatges (payloads) HTTP POST similars a aquest:

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

El servidor ha de respondre amb un codi d'estat 201 sempre que la notificació s'hagi desat correctament a la cua.

### Errors

Si es produeix un error has de retornar una descripció del què ha anat malament incloent el codi d'estat *diferent que * 201 o 429. Les respostes d'error han de ser objectes JSON i contenir una de les següents claus:

| Clau           | Tipus  | Descripció                                                                                                                                                                                                                                                                          |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `errorMessage` | string | Si es proporciona, s'afegirà a un missatge d'error preestablert. Per exemple, si `errorMessage` és "No s'ha pogut connectar amb Apple" s'escriurà als diaris de registre (logs) com a "Error intern del servidor, torna-ho a intentar més tard: No s'ha pogut connectar amb Apple". |
| `message`      | string | Si es proporciona, s'escriurà als diaris de registre tal i com està i, amb nivell d’alerta (warning).                                                                                                                                                                               |

Sigui quina sigui la clau que utilitzis, hauries d'intentar descriure el millor possible què és el que ha anat malament i, si és possible, com l'usuari pot solucionar-ho.

### Límit de freqüència

La plataforma de notificacions també suporta límits de freqüència pels usuaris. La suggerència de Home Assistant és que implementis un límit conservador per mantenir els costos baixos i també perquè els usuaris no es puguin sobrecarregar amb massa notificacions. Com a referència, Home Assistant Companion té un límit de 150 notificacions enviades per cada 24 hores. El límit es reinicia per tots els usuaris a mitjanit (UTC). Per suposat ets lliure d'utilitzar la configuració que vulguis pel teu límit de freqüència.

Si tries implementar un límit de freqüència, les respostes (amb èxit) del servidor haurien de ser semblants a:

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

| Clau         | Tipus                  | Descripció                                                                                |
| ------------ | ---------------------- | ----------------------------------------------------------------------------------------- |
| `successful` | enter                  | Nombre de notificacions emergents exitoses que l'usuari ha enviat durant el període.      |
| `errors`     | enter                  | Nombre de notificacions emergents errònies que l'usuari ha enviat durant el període.      |
| `maximum`    | enter                  | Nombre màxim de notificacions emergents que l'usuari pot enviat durant el període.        |
| `resetsAt`   | marca de temps ISO8601 | Marca de temps a la qual el període s'acaba. S'ha de proporcionar en la zona horària UTC. |

Els límits de freqüència s'escriuran al diari de registre, amb nivell d’alerta, cada vegada que s'envii una notificació correctament. Home Assistant també escriurà el temps que falta perquè el període es reiniciï.

Un cop l'usuari arribi al seu màxim nombre de notificacions enviades, has de començar a respondre amb el codi d'estat 429 fins que el període s'acabi. L'objecte resposta pot contenir opcionalment una clau `message` el contingut de la qual s'escriurà al diari de registre de Home Assistant en lloc del missatge d'error per defecte.

La plataforma de notificacions no implementa cap tipus de protecció envers els límits de freqüència. Els usuaris et podrien seguir enviar notificacions indefinidament, per tant, hauries rebutjar-les amb un codi d'estat 429 tant aviat com sigui possible.

## Exemple d'implementació d'un servidor

El codi de sota és una Cloud Function de Firebase que reenvia notificacions a Firebase Cloud Messaging. Per desplegar-ho, has de crear una nova base de dades Firestore amb nom `rateLimits`. Després pots desplegar el codi a continuació. Assegura't, també, que has configurat el teu projecte amb les claus d'autenticació APNS i FCM correctes.

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