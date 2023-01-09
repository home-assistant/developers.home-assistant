import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import BrowserOnly from "@docusaurus/BrowserOnly";
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
            <a href="docs/architecture_index">Overview</a>.
          </b>{" "}
          Explains various layers that make up Home Assistant.
        </p>
        <p>
          <b>
            <a href="docs/development_index">Core</a>.
          </b>{" "}
          Explains how to build new integrations for Home Assistant.
        </p>
        <p>
          <b>
            <a href="docs/frontend">Frontend</a>.
          </b>{" "}
          Explains how to develop the user interface of Home Assistant.
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
            <a href="docs/api/websocket">Home Assistant API</a>
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
    ),
  },
  {
    title: <>Upcoming Events</>,
    imageUrl: "",
    description: UpcomingEvents(),
  },
];

function UpcomingEvents() {
  return (
    <BrowserOnly>
      {() => (
        <iframe
          title="Upcoming Events Calendar"
          src={`https://calendar.google.com/calendar/embed?height=400&wkst=2&bgcolor=%23ffffff&ctz=${
            Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
          }&src=cDA3bjk4Z28xMW9uYW1kMDhkMGttcTZqaHNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23039BE5&title=Release%20Schedule&mode=AGENDA&showPrint=0&showTabs=0&showCalendars=0&showTz=1&showNav=0&showDate=0&showTitle=0`}
          style={{ borderWidth: 0, margin: "auto" }}
          width="300"
          height="200"
          frameBorder="0"
          scrolling="no"
        />
      )}
    </BrowserOnly>
  );
}

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
            <div className={clsx("col col--5")}>
              <img
                className={styles.heroLogo}
                alt="Home Assistant Logo"
                src="/img/logo-white.svg"
              />
            </div>
            <div className={clsx("col col--5")}>
              <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
              <p className={styles.heroTagline}>{siteConfig.tagline}</p>
              <p>
                <a
                  className={styles.heroText}
                  href="https://www.home-assistant.io"
                >
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
