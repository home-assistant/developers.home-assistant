import React from 'react';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';

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
                const absoluteRulePath = `/docs/core/integration-quality-scale/rules/${id}`;
                const relatedRule = docs[`core/integration-quality-scale/rules/${id}`];
                return (
                    <li key={id}>
                        <Link to={absoluteRulePath}>{id}</Link> - {relatedRule.title}
                    </li>
                );
            })}
        </ul>
    );
}