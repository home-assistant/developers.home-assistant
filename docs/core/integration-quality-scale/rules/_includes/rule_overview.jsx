import React from 'react';
import {useDocById, useDocsVersion} from '@docusaurus/plugin-content-docs/client';

const tiers = require("./tiers.json")

export default function RuleOverview({tier}) {
    return (
        <ul>
            {tiers[tier].map((rule) => {
                const lowerCaseRule = rule.toLowerCase();
                const relatedRule = useDocsVersion().docs[`core/integration-quality-scale/rules/${lowerCaseRule}`];
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