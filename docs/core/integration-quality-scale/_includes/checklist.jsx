import React from 'react';
import {useDocsVersion} from '@docusaurus/plugin-content-docs/client';
import CodeBlock from '@theme/CodeBlock';

const tiers = require("./tiers.json")

function getRule(ruleId, docs) {
    const rule = docs[`core/integration-quality-scale/rules/${ruleId.toLowerCase()}`];
    const [id, text] = rule.title.split(" (");
    return {id, text};
}

export default function Checklist() {
    const docs = useDocsVersion().docs;
    const getRuleWithDocs = (ruleId) => getRule(ruleId, docs);
    return (
        <CodeBlock language="markdown">
            {Object.keys(tiers).map((tier) => {
                return (
                    <div key={tier}>
                        {`## ${tier.charAt(0).toUpperCase() + tier.slice(1)}\n`}
                        {tiers[tier].map((rule) => {
                            if (typeof rule === "string") {
                                const text = docs[`core/integration-quality-scale/rules/${rule}`].title;
                                return `- [ ] \`${rule}\` - ${text}\n`;
                            }
                            const text = docs[`core/integration-quality-scale/rules/${rule.id}`].title;
                            return [
                                `- [ ] \`${rule.id}\` - ${text}\n`,
                                ...rule.subchecks.map(subcheck => `    - [ ] ${subcheck}\n`)
                            ].join('');
                        }).join('')}
                        {`\n`}
                    </div>
                )
            })}
        </CodeBlock>
    );
}