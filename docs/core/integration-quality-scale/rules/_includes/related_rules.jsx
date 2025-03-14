import React from 'react';
import {useDocsVersion} from "@docusaurus/plugin-content-docs/client";
import Link from '@docusaurus/Link';


export default function RelatedRules({relatedRules}) {
    const docs = useDocsVersion().docs;
    return (
        <ul>
            {relatedRules.map((rule) => {
                const absoluteRulePath = `/docs/core/integration-quality-scale/rules/${rule}`;
                const relatedRule = docs[`core/integration-quality-scale/rules/${rule}`].title;
                return (
                    <li key={rule}>
                        <Link to={absoluteRulePath}>{rule}</Link>: {relatedRule}
                    </li>
                );
            })}
        </ul>
    );
}