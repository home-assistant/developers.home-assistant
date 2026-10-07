/**
 * Swizzled from @docusaurus/theme-classic to group the archive by year and
 * month, matching the blog sidebar.
 */
import React from "react";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { PageMetadata } from "@docusaurus/theme-common";
import { useDateTimeFormat } from "@docusaurus/theme-common/internal";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  timeZone: "UTC",
});

function Year({ year, months }) {
  const dateTimeFormat = useDateTimeFormat({
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  const formatDate = (date) => dateTimeFormat.format(new Date(date));
  return (
    <>
      <Heading as="h3" id={year}>
        {year}
      </Heading>
      {months.map(({ label, posts }) => (
        <div role="group" key={label} className={styles.monthGroup}>
          <Heading as="h4" className={styles.monthHeading}>
            {label}
          </Heading>
          <ul>
            {posts.map((post) => (
              <li key={post.metadata.permalink}>
                <Link to={post.metadata.permalink}>
                  {formatDate(post.metadata.date)} - {post.metadata.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function YearsSection({ years }) {
  return (
    <section className="margin-vert--lg">
      <div className="container">
        <div className="row">
          {years.map((props) => (
            <div key={props.year} className="col col--4 margin-vert--lg">
              <Year {...props} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Posts arrive sorted newest first, so insertion order is already descending.
// Array.from instead of spread: the client Babel config compiles spread in
// loose mode, which does not support iterators.
function listPostsByYearAndMonth(blogPosts) {
  const years = new Map();
  for (const post of blogPosts) {
    const date = new Date(post.metadata.date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    if (!years.has(year)) {
      years.set(year, new Map());
    }
    const months = years.get(year);
    if (!months.has(month)) {
      months.set(month, { label: monthFormatter.format(date), posts: [] });
    }
    months.get(month).posts.push(post);
  }
  return Array.from(years, ([year, months]) => ({
    year,
    months: Array.from(months.values()),
  }));
}

export default function BlogArchive({ archive }) {
  const title = translate({
    id: "theme.blog.archive.title",
    message: "Archive",
    description: "The page & hero title of the blog archive page",
  });
  const description = translate({
    id: "theme.blog.archive.description",
    message: "Archive",
    description: "The page & hero description of the blog archive page",
  });
  const years = listPostsByYearAndMonth(archive.blogPosts);
  return (
    <>
      <PageMetadata title={title} description={description} />
      <Layout>
        <header className="hero hero--primary">
          <div className="container">
            <Heading as="h1" className="hero__title">
              {title}
            </Heading>
            <p className="hero__subtitle">{description}</p>
          </div>
        </header>
        <main>{years.length > 0 && <YearsSection years={years} />}</main>
      </Layout>
    </>
  );
}
