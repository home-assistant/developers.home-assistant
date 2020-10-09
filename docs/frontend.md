---
title: "Home Assistant Frontend"

sidebar_label: "Introduction"
---

<p><strong>The Home Assistant frontend</strong> allows users to browse and control the state of their house, manage their automations and configure integrations.</p>

<p>The frontend is designed as a <em>mobile-first experience</em>. It is a progressive web application and offers an app-like experience to our users.</p>

</p>The Home Assistant frontend needs to be fast. But it also needs to work on a wide range of old devices. To do this, we ship two versions of the frontend:</p>
<ul>
  <li>
- <h6>Latest:</h6> This build is compatible with the two latest versions of evergreen browsers and is optimized to be fast.
  </li>
  <li>
- <h6>ES5:</h6> This build is compatible with browsers released in the last 5+ years and is optimized to be compatible.
  </li>
  </ul>

A device that runs the latest technology does not also have to be fast. You can buy budget Android phones that run the latest Android version with access to the latest <em>Firefox</em> and <em>Chrome</em> browsers, but with low performance chipset and limited memory. Our latest build needs to run smooth on these devices too.

For a deep dive into our frontend and its design choices, see <a href="(/blog/2019/05/22/internet-of-things-and-the-modern-web)">[this blog post].</a>

<a href="(/img/en/frontend/frontend-hero.png)">![Screenshot of the Home Assistant Frontend]</a>
