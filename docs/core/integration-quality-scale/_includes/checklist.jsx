import React from 'react';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';
import CodeBlock from '@theme/CodeBlock';

const tiers = require("./tiers.json")

export default function Checklist() {
    const docs = useDocsVersion().docs;
    return (
        <CodeBlock language="markdown">
            {Object.keys(tiers).map((tier) => {
                return (
                    <div>
                        <p>{tier.charAt(0).toUpperCase() + tier.slice(1)}</p>
                        {
                            tiers[tier].map((rule) => {
                                const lowerCaseRule = rule.toLowerCase();
                                const relatedRule = docs[`core/integration-quality-scale/rules/${lowerCaseRule}`];
                                const [ruleId, ruleText] = relatedRule.title.split(": ");
                                return (
                                    <p key={rule}>
                                        - [ ] {ruleId} - {ruleText}
                                    </p>
                                );
                            })
                        }
                    </div>
                )
            })}
        </CodeBlock>
    );
}