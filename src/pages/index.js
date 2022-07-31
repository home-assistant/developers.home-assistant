import React from "react";
import clsx from 'clsx';
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

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
      <FullCalendar
        plugins={[ listPlugin, googleCalendarPlugin ]}
        // TODO: PLEASE REPLACE ME
        googleCalendarApiKey="AIzaSyBY2X9aH08tNRNZYHCJ5LiR7PQk79799EQ"
        events={{ googleCalendarId: "p07n98go11onamd08d0kmq6jhs@group.calendar.google.com" }}
        initialView="list"
        displayEventTime={false}
        headerToolbar={false}
        visibleRange={{
          start: new Date(),
          end: new Date().setDate(new Date().getDate() + 365 * 2)
        }}
        eventDidMount={function(arg) {
          console.log(arg.el.firstChild)
        }}
      />
      <ul style={{marginTop: '8px'}}>
        <li>
          <a href="https://calendar.google.com/calendar?cid=p07n98go11onamd08d0kmq6jhs@group.calendar.google.com">
            Add to Google Calendar
          </a>
        </li>
      </ul>
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
