import React from 'react';
import {useDocsVersion} from "@docusaurus/plugin-content-docs/client";


export default function RelatedRules({relatedRules}) {
    const docs = useDocsVersion().docs;
    return (
        <ul>
            {relatedRules.map((rule) => {
                const relatedRule = docs[`core/integration-quality-scale/rules/${rule}`];
                const [ruleText, ruleId] = relatedRule.title.split(" (");
                return (
                    <li key={rule}>
                        <a href={`./${rule}`}>{rule}</a>: {ruleText} ({ruleId.slice(0, -1)})
                    </li>
                );
            })}
        </ul>
    );
}