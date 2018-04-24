---
title: "Miscellaneous Async"
---

## What about ‘async’ and ‘await’ syntax?
Python 3.5 introduced new syntax to formalize the asynchronous pattern. This is however not compatible with Python 3.4. The minimum required Python version for Home Assistant is based on the Python version shipped with Debian stable, which is currently 3.5.3.

For more information, Brett Cannon wrote [an excellent breakdown][brett] on 'async' and 'await' syntax and how asynchronous programming works.

## Acknowledgements

Huge thanks to [Ben Bangert][ben] for starting the conversion of the core to async, guiding other contributors while taking their first steps with async programming and peer reviewing this documentation.

[brett]: http://www.snarky.ca/how-the-heck-does-async-await-work-in-python-3-5
[ben]: https://github.com/bbangert/
