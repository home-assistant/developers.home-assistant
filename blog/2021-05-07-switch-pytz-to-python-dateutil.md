---
author: Paulus Schoutsen
authorURL: https://twitter.com/balloob
authorImageURL: /img/profile/paulus.jpg
authorTwitter: balloob
title: Replacing pytz with python-dateutil
---

Three years ago Paul Ganssle wrote [a comparison](https://blog.ganssle.io/articles/2018/03/pytz-fastest-footgun.html) about time zone handling between `pytz` and `python-dateutil`. In this article he shows how it's easy to use `pytz` in an incorrect way that is hard to spot because it's almost correct:

```python
import pytz
from datetime import datetime, timedelta

NYC = pytz.timezone('America/New_York')
dt = datetime(2018, 2, 14, 12, tzinfo=NYC)
print(dt)
# 2018-02-14 12:00:00-04:56
```

_[(link to part of the article explaining why it's -4:56)](https://blog.ganssle.io/articles/2018/03/pytz-fastest-footgun.html#pytz-s-time-zone-model)_

In Home Assistant 2021.6 we're going to switch to `python-dateutil`. You will need to upgrade your custom integration if it relies on the unofficial interface `my_time_zone.localize(my_dt)`. Use Python's official method `my_dt.astimezone(my_time_zone)` instead.

The property `hass.config.time_zone` will also change to a string instead of a time zone object.

Thanks to [@bdraco] for helping revive this effort and push this change [past the finish line](https://github.com/home-assistant/core/pull/49643). We actually found a couple of bugs during the migration! Also thanks to Paul Ganssle for maintaining `python-dateutil` and the excellent write up.

[@bdraco]: https://github.com/bdraco

## Update May 10

Wow, time flies! Paul, the author of `python-dateutil` and also the author of the blog post that inspired us, pointed us to the fact that Python 3.9 includes upgraded timezone handling and that we should use that instead. With the help of Nick and Paul `python-dateutil` has been removed again and `zoneinfo` is used instead ([PR](https://github.com/home-assistant/core/pull/50387)).
