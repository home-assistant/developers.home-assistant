import React from 'react';
import {useDocsVersion} from "@docusaurus/plugin-content-docs/client";


export default function RelatedRules({relatedRules}) {
    const docs = useDocsVersion().docs;
    return (
        <ul>
            {relatedRules.map((rule) => {
                const lowerCaseRule = rule.toLowerCase();
                const relatedRule = docs[`core/integration-quality-scale/rules/${lowerCaseRule}`];
                const [ruleId, ruleText] = relatedRule.title.split(": ");
                return (
                    <li key={rule}>
                        <a href={lowerCaseRule}>{ruleId}</a>: {ruleText}
                    </li>
                );
            })}
        </ul>
    );
}