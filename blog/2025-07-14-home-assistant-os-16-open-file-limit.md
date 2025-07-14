---
author: Jan Čermák
authorURL: https://github.com/sairon
title: Handling open file limit in add-ons since OS 16
date: 2025-07-14
---

With the release of Home Assistant OS 16, the default limit for open file descriptors in Docker containers (and, by extension, all add-ons and the processes within them) has changed. Home Assistant OS now uses the default values provided by Systemd: a soft limit of **1024** and a hard limit of **524288** open files.

This is a change from previous OS versions, where the limit was set to "infinity" (effectively a value over 1 billion) — also introduced as an upstream change — [since Home Assistant OS 10](/blog/2023/04/13/new_limits_for_add_ons). The new limits are consistent with common practices on modern Linux systems and follow changes gradually being adopted across other Linux distributions.

For more details on these limits and best practices, see Lennart Poettering's explanation on [File Descriptor Limits](https://0pointer.net/blog/file-descriptor-limits.html). In summary, applications that require more than the default soft limit of 1024 file descriptors should explicitly raise their own limit at startup, up to the hard limit imposed by the system (in our case, 524288). This approach ensures each application only requests the resources it needs and avoids system-wide high limits that may lead to unexpected resource exhaustion.

### What does this mean for add-on developers?

- If your application running as an add-on needs to open more than 1024 files (sockets, pipes, etc.), you should adjust the limit yourself, for example using `ulimit -Sn <value>`, as long as `<value>` does not exceed the hard limit (which can be checked with `ulimit -Hn`).
- Most add-ons will likely not be affected by this change, but some — such as those handling many network connections or accessing numerous files (e.g., databases or file sharing applications) — may need to adapt their startup routines.

### What happens if the limit is too low?

If an add-on or its application requires more file descriptors than the default soft limit (1024) and does not raise the limit itself, it may fail to open additional files, sockets, or network connections once the limit is reached. This typically results in errors such as "Too many open files" (`EMFILE`), failing network connections, or malfunctioning services.

If you have any questions or encounter issues, please refer to [this GitHub discussion](https://github.com/home-assistant/operating-system/discussions/4166), which also contains more details and background information about this topic.
