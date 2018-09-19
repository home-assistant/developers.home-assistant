---
title: Adding more info dialogs
id: version-0.78.0-frontend_add_more_info
original_id: frontend_add_more_info
---

Whenever the user taps or clicks on one of the cards, a more info dialog will show. The header of this dialog will be the state card, followed by the history of this entity for the last 24 hours. Below this the more info component is rendered for that entity. The more info component can show more information or allow more ways of control.

<img
  src='/img/en/frontend/frontend-more-info-light.png'
  alt='The more info dialog for a light allows the user to control the color and the brightness.'
/>

The instructions to add a more info dialog are very similar to adding a new card type. This example will add a new more info component for the domain `camera`:

 1. Add `'camera'` to the array `DOMAINS_WITH_MORE_INFO` in the file [/common/const.js](https://github.com/home-assistant/home-assistant-polymer/blob/master/src/common/const.js).
 2. Create the files `more-info-camera.js` in the folder [/dialogs/more-info/controls](https://github.com/home-assistant/home-assistant-polymer/tree/master/src/dialogs/more-info/controls).
 3. Add `import './more-info-camera.js';` to [/dialogs/more-info/controls/more-info-content.js](https://github.com/home-assistant/home-assistant-polymer/blob/master/src/dialogs/more-info/controls/more-info-content.js)
