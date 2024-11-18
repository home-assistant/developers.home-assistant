import React from 'react';
import {useDocsVersion} from "@docusaurus/plugin-content-docs/client";


export default function RelatedRules({relatedRules}) {
    return (
        <ul>
            {relatedRules.map((rule) => {
                const lowerCaseRule = rule.toLowerCase();
                const relatedRule = useDocsVersion().docs[`core/integration-quality-scale/rules/${lowerCaseRule}`];
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