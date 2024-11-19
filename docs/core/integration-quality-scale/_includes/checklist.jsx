import React from 'react';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';
import CodeBlock from '@theme/CodeBlock';

const tiers = require("./tiers.json")

function getRule(ruleId) {
    const docs = useDocsVersion().docs;
    const rule = docs[`core/integration-quality-scale/rules/${ruleId.toLowerCase()}`];
    const [id, text] = rule.title.split(": ");
    return {id, text};
}

export default function Checklist() {
    const docs = useDocsVersion().docs;
    return (
        <CodeBlock language="markdown">
            {Object.keys(tiers).map((tier) => {
                return (
                    <div>
                        <p>## {tier.charAt(0).toUpperCase() + tier.slice(1)}</p>
                        {
                            tiers[tier].map((rule) => {
                                if (typeof rule === "string") {
                                    const {id, text} = getRule(rule);
                                    return (
                                        <p key={rule}>
                                            - [ ] {id} - {text}
                                        </p>
                                    );
                                }
                                const {id, text} = getRule(rule.id);
                                return (
                                    <p key={rule.id}>
                                        - [ ] {id} - {text}
                                        {
                                            rule.subchecks.map((subcheck) => {
                                                return (
                                                    <p key={subcheck}>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;- [ ] {subcheck}
                                                    </p>
                                                );
                                        })
                                        }
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