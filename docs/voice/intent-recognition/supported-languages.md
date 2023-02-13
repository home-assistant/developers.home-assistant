---
title: "Supported Languages"
---

import languages from '!!yaml-loader!../../../intents/languages.yaml';
import intents from '!!yaml-loader!../../../intents/intents.yaml';

If you don't see your language below, [help us translate!](./contributing)

For a full progress report per language, [click here.](https://home-assistant.github.io/intents/)

<>
  <table>
    <thead>
      <tr>
        <th>Code</th>
        <th>Language</th>
        <th>Leader</th>
        <th>Links</th>
      </tr>
    </thead>
    <tbody>
      {
        Object.entries(languages).map(
          ([language, info]) =>
            <tr>
              <td>
                <code>{language}</code>
              </td>
              <td>
                {info.nativeName}
              </td>
              <td>
                {info.leaders?.length &&
                    info.leaders.map((leader, idx) =>
                      <>
                        {!!idx && ', '}
                        <a href={`https://github.com/${leader}`}>{leader}</a>
                      </>
                    )}
              </td>
              <td>
                <a href={`https://github.com/home-assistant/intents/tree/main/sentences/${language}`}>Sentences</a>
              </td>
            </tr>
        )
      }
    </tbody>
  </table>
</>

[This page is automatically generated based on the Intents repository.](https://github.com/home-assistant/intents/blob/main/languages.yaml)
