---
title: "카테고리화 기능"
---

Home Assistant 내에서 작업은 호출 될 함수로 표현됩니다. 비동기 안전성에 따라 Home Assistant 의 내부에서 이벤트 루프 또는 내부 스레드 풀에서 실행됩니다.

Home Assistant 는 이벤트 루프 내에서 실행해야 할 모든 기능 앞에 `async_` 접두어가 붙는 규칙을 사용합니다.

## 코루틴 함수

코루틴은 결과를 기다리는 동안 실행을 일시 중단 할 수있는 Python 의 생성자 구문을 기반으로하는 특수 함수입니다.

코루틴 함수를 호출하면 생성자 객체가 다시 반환되지만 실제로 실행되지는 않습니다. 이 객체는 작업이 (다른 코루틴 내로 부터) 파생되거나 이벤트 루프에서 예약될 때 작업을 실행합니다.

함수를 코루틴으로 선언하려면 비동기 패키지에서 코루틴 어노테이션을 가져 와서 함수에 어노테이션을 달아주면 됩니다.

```python
async def async_look_my_coroutine(target):
    result = await entity.async_turn_on()
    if result:
        print("hello {}".format(target))

hass.loop.create_task(async_look_my_coroutine("world"))
```

이 예제에서는, `hass.loop.create_task` 를 호출해서 코루틴을 예약했습니다. 이는 실행 될 작업 큐에 코루틴을 추가합니다. 이벤트 루프가 `async_look_my_coroutine` 을 실행중이면 `await entity.async_turn_on()` 이 호출 될 때 작업을 일시 중단합니다. 이 시점에서 `entity.async_turn_on()` 을 실행할 새 작업이 예약됩니다. 해당 작업이 실행되면, `async_look_my_coroutine` 이 다시 재개됩니다.

## 콜백 함수

콜백 함수는 이벤트 루프 내에서 실행되는 것이 안전하다고 간주되는 일반 함수입니다. 콜백은 콜백 자신을 일시 중단 할 수 없으므로 I/O를 수행하거나 코루틴을 호출 할 수 없습니다. 콜백은 새 작업을 예약 할 수는 있지만 결과를 기다릴 수는 없습니다.

To declare a function as a callback, import the callback annotation from the core package and annotate your function.

A common use case for a callback in Home Assistant is as a listener for an event or a service call. It can process the incoming information and then schedule the right calls to be made. Example from the automation component.

```python
from homeassistant.core import callback

@callback
def async_trigger_service_handler(service_call):
    """Handle automation trigger service calls."""
    vars = service_call.data.get(ATTR_VARIABLES)
    for entity in component.async_extract_from_service(service_call):
        hass.loop.create_task(entity.async_trigger(vars, True))
```

In this example, `entity.async_trigger` is a coroutine function. Invoking the coroutine function will return a coroutine task. The passed in parameters will be used when the task gets executed.

To execute the task we have to schedule it for execution on the event loop. This is done by calling `hass.loop.create_task`.

### Why even have callbacks?

You might wonder, if a coroutine can do everything a callback can do, why even have a callback. The reason is performance and better state consistency of the core API objects.

When coroutine A waits for coroutine B, it will suspend itself and schedule a new task to run B. This means that the event loop is now running A, B and then A again. If B is a callback, A will never have to suspend itself and thus the event loop is just running A. The consistency implication is that other events queued to run on the event loop continue to wait until callbacks complete, but will be interleaved when yielding to another coroutine.

## Event loop and thread safe

These are functions that are safe to run both in a thread and inside the event loop. These functions are usually performing a computation or transform data in memory. Anything that does I/O does not fall under this category. Many standard library functions fall in this category. For example generating the sum of a set of numbers using sum or merging two dictionaries.

There is no special annotation to mark functions as part of this category and care should be taken when using these functions from inside the event loop. When in doubt, look at their implementation.

## Other functions

These are all the functions that did not fit in the previous categories. These functions are either thread-safe or not considered safe to be run within the event loop. These are functions that use sleep, or perform I/O.

There is no special annotation necessary to be considered part of this category.