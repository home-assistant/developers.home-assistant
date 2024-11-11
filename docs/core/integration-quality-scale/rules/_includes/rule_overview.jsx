import React from 'react';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';

export default function RuleOverview({tier}) {
    const docs = useDocsVersion().docs;
    const ruleTiers = {
        "bronze": [],
        "silver": [],
        "gold": [],
        "platinum": [],
    }
    for (const [key, value] of Object.entries(docs)) {
        if (key.startsWith("core/integration-quality-scale/rules/")) {
            const [tier, rule] = key.split("/").slice(-2);
            ruleTiers[tier].push({
                rule,
                title: value.title.split(": ")[1],
            })
        }
    }
    return (
        <ul>
            {ruleTiers[tier].map((rule) => {
                return (
                    <li key={rule.rule}>
                        <a href={`rules/${tier}/${rule.rule}`}>{rule.rule.toUpperCase()}</a> - {rule.title}
                    </li>
                );
            })}
        </ul>
    );
}