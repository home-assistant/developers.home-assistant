/**
 * Swizzled from @docusaurus/theme-classic to group the blog sidebar by year
 * and month. Each year is collapsible; the latest year and the year of the
 * post being viewed start expanded.
 */
import React, { memo } from "react";
import { useLocation } from "@docusaurus/router";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  timeZone: "UTC",
});

// Items arrive sorted newest first, so insertion order is already descending.
function groupByYearAndMonth(items) {
  const years = new Map();
  for (const item of items) {
    const date = new Date(item.date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    if (!years.has(year)) {
      years.set(year, new Map());
    }
    const months = years.get(year);
    if (!months.has(month)) {
      months.set(month, { label: monthFormatter.format(date), items: [] });
    }
    months.get(month).items.push(item);
  }
  // Array.from instead of spread: the client Babel config compiles spread in
  // loose mode, which does not support iterators.
  return Array.from(years, ([year, months]) => {
    const monthGroups = Array.from(months.values());
    return {
      year,
      months: monthGroups,
      count: monthGroups.reduce((sum, m) => sum + m.items.length, 0),
    };
  });
}

function BlogSidebarContent({ items, yearGroupHeadingClassName, ListComponent }) {
  const { pathname } = useLocation();
  const groups = groupByYearAndMonth(items);
  return (
    <>
      {groups.map(({ year, months, count }, index) => {
        const containsActive = months.some((m) =>
          m.items.some((item) => item.permalink === pathname)
        );
        return (
          <details
            key={year}
            className={styles.yearGroup}
            open={index === 0 || containsActive}
          >
            <summary className={styles.yearSummary}>
              <Heading as="h3" className={yearGroupHeadingClassName}>
                {year}
              </Heading>
              <span className={styles.count}>{count}</span>
            </summary>
            {months.map(({ label, items: monthItems }) => (
              <div role="group" key={label} className={styles.monthGroup}>
                <Heading as="h4" className={styles.monthHeading}>
                  {label}
                </Heading>
                <ListComponent items={monthItems} />
              </div>
            ))}
          </details>
        );
      })}
    </>
  );
}

export default memo(BlogSidebarContent);
