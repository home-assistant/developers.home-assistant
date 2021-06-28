import React from "react";
import clsx from 'clsx';
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const recentPosts = require("../../.docusaurus/docusaurus-plugin-content-blog/default/blog-post-list-prop-default.json");
const features = [
  {
    title: <>Document Structure</>,
    imageUrl: "",
    description: (
      <>
        <p>
          <b>
            <a href="docs/architecture_index">Architecture</a>.
          </b>{" "}
          Explains various layers that make up Home Assistant.
        </p>
        <p>
          <b>
            <a href="docs/frontend">Frontend</a>.
          </b>{" "}
          Explains how to develop the user interface of Home Assistant.
        </p>
        <p>
          <b>
            <a href="docs/development_index">Backend</a>.
          </b>{" "}
          Explains how to build new integrations for Home Assistant.
        </p>
        <p>
          <b>
            <a href="docs/misc">Misc</a>.
          </b>{" "}
          External APIs, Internationalization, asyncio, Home Assistant add-ons,
          updating documentation.
        </p>
      </>
    ),
  },
  {
    title: <>Popular Topics</>,
    imageUrl: "",
    description: (
      <>
        <ul style={{ flex: "1" }}>
          <li>
            <a href="docs/development_index">Add a new integration</a>
          </li>
          <li>
            <a href="docs/internationalization">Translate Home Assistant</a>
          </li>
          <li>
            <a href="docs/frontend">Improve the frontend</a>
          </li>
          <li>
            <a href="docs/api/rest">Extract data from the Home Assistant API</a>
          </li>
        </ul>
        <h3>Source Code</h3>
        <ul>
          <li>
            <a href="https://github.com/home-assistant/home-assistant">
              Home Assistant
            </a>
          </li>
          <li>
            <a href="https://github.com/home-assistant/frontend">
              Home Assistant Frontend
            </a>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: <>Recent Blog Posts</>,
    imageUrl: "",
    description: (
      <>
        <ul>
          {recentPosts.items.slice(0, 5).map((item, index) => (
            <li key={index}>
              <a href={`${item.permalink}`}>{item.title}</a>{" "}
            </li>
          ))}
        </ul>
      </>
    )
  },
  {
    title: <>Upcoming Events</>,
    imageUrl: "",
    description: (
      <>
        <iframe
          title="Upcoming Events Calendar"
          src="https://calendar.google.com/calendar/embed?height=400&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=America%2FLos_Angeles&amp;src=cDA3bjk4Z28xMW9uYW1kMDhkMGttcTZqaHNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;color=%23039BE5&amp;title=Release%20Schedule&amp;mode=AGENDA&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;showNav=0&amp;showDate=0&amp;showTitle=0"
          style={{ borderWidth: 0, margin: "auto" }}
          width="300"
          height="200"
          frameBorder="0"
          scrolling="no"
        />
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--3", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      title={`Home Assistant Developer Docs`}
      description="Get started developing for Home Assistant"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <div className="row">
            <div className={clsx('col col--5')}>
              <img className={styles.heroLogo} alt="Home Assistant Logo" src="/img/logo-white.svg" />
            </div>
            <div className={clsx('col col--5')}>
              <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
              <p className={styles.heroTagline}>{siteConfig.tagline}</p>
              <p>
                <a className={styles.heroText} href="https://www.home-assistant.io">
                  Not a developer? Go to the normal website
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
