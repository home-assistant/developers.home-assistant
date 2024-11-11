import React from 'react';
import {useDocsVersion} from "@docusaurus/plugin-content-docs/client";


export default function RelatedRules({relatedRules}) {
    const docs = useDocsVersion().docs;
    const rules = {}
    for (const [key, value] of Object.entries(docs)) {
        if (key.startsWith("core/integration-quality-scale/rules/")) {
            const [tier, rule] = key.split("/").slice(-2);
            rules[rule] = {
                rule,
                tier,
                title: value.title.split(": ")[1],
            }
        }
    }
    return (
        <ul>
            {relatedRules.map((ruleId) => {
                const rule = rules[ruleId.toLowerCase()];
                return (
                    <li key={rule.rule}>
                        <a href={`../${rule.tier}/${rule.rule}`}>{rule.rule.toUpperCase()}</a>: {rule.title}
                    </li>
                );
            })}
        </ul>
    );
}