---
title: "Supported Intents"
---

import intents from '!!yaml-loader!../../../intents/intents.yaml';

The following intents are supported by Home Assistant:

<>
{
  Object.entries(intents).map(
    ([intent, info]) =>
      <>
        <h3>{intent}</h3>
        <p>{info.description}</p>
        <b>Slots</b>
        {info.slots && (
          <ul>
            {Object.entries(info.slots).map(([slot, slotInfo]) => (
              <li>
                <b>{slot}</b> - {slotInfo.description}
              </li>
            ))}
          </ul>
        )}
        <p><small>
          <a href={`https://www.home-assistant.io/integrations/${info.domain}`}>Provided by the <code>{info.domain}</code> integration.</a>
        </small></p>
      </>
  )
}
</>

[This page is automatically generated based on the Intents repository.](https://github.com/home-assistant/intents/blob/main/intents.yaml)
