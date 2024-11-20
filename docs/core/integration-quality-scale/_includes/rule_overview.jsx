import React from 'react';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';

const tiers = require("./tiers.json")

export default function RuleOverview({tier}) {
    const docs = useDocsVersion().docs;
    return (
        <ul>
            {tiers[tier].map((rule) => {
                let id = rule;
                if (typeof rule === "object") {
                    id = rule.id;
                }
                const relatedRule = docs[`core/integration-quality-scale/rules/${id}`];
                return (
                    <li key={id}>
                        <a href={`rules/${id}`}>{id}</a> - {relatedRule.title}
                    </li>
                );
            })}
        </ul>
    );
}