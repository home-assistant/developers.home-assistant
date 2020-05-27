---
title: "Home Assistant Frontend"
sidebar_label: "Introduction"
---

The Home Assistant frontend allows users to browse and control the state of their house, manage their automations and configure integrations.

The frontend is designed as a mobile-first experience. It is a progressive web application and offers an app-like experience to our users.

The Home Assistant frontend needs to be fast. But it also needs to work on a wide range of old devices. To do this, we ship two versions of the frontend:

- **Latest:** this build is compatible with the two latest versions of evergreen browsers and is optimized to be fast.
- **ES5:** this build is compatible with browsers released in the last 5+ years and is optimized to be compatible.

A device that runs the latest technology does not also have to be fast. You can buy budget Android phones that run the latest Android version with access to the latest Firefox and Chrome browsers, but with low performance chipset and limited memory. Our latest build needs to run smooth on these devices too.

For a deep dive into our frontend and its design choices, see [this blog post](/blog/2019/05/22/internet-of-things-and-the-modern-web).

![Screenshot of the Home Assistant Frontend](/img/en/frontend/frontend-hero.png)
