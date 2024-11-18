import React from 'react';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';

const tiers = require("./tiers.json")

export default function RuleOverview({tier}) {
    const docs = useDocsVersion().docs;
    return (
        <ul>
            {tiers[tier].map((rule) => {
                const lowerCaseRule = rule.toLowerCase();
                const relatedRule = docs[`core/integration-quality-scale/rules/${lowerCaseRule}`];
                const [ruleId, ruleText] = relatedRule.title.split(": ");
                return (
                    <li key={rule}>
                        <a href={`rules/${lowerCaseRule}`}>{ruleId}</a> - {ruleText}
                    </li>
                );
            })}
        </ul>
    );
}