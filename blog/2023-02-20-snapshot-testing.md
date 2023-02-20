---
author: Franck Nijhof
authorURL: https://twitter.com/frenck
authorImageURL: /img/profile/frenck.png
authorTwitter: frenck
title: Added support for snapshot testing
---

Home Assistant [now supports snapshot testing](https://github.com/home-assistant/core/pull/88323)
for our Python codebase.

Snapshot testing (also known as approval tests) are tests that assert values
against a stored reference value (the snapshot); ensuring the output of code
remains the same over time.

Snapshot tests are different from regular (functional) tests and do not replace
functional tests, but they can be very useful for testing larger test outputs.
Within Home Assistant they could, for example, be used to test entity states, device
or entity registry items, or the output of a diagnostic dump.

Take, for example, this diagnostic test, which uses a snapshot to assert the
output of a diagnostic dump:

```python
# tests/components/example/test_diagnostics.py
async def test_diagnostics(
    hass: HomeAssistant,
    hass_client: ClientSessionGenerator,
    init_integration: MockConfigEntry,
    snapshot: SnapshotAssertion,
) -> None:
    """Test diagnostics."""
    assert (
        await get_diagnostics_for_config_entry(hass, hass_client, init_integration)
        == snapshot
    )
```

When this test is run for the first time, it will fail, as no snapshot exists.
To create (or update) a snapshot, run pytest with the `--snapshot-update` flag,
which will create a snapshot file in the `snapshots` directory of this component.

The snapshot file is named after the test file, in this case:
`tests/components/example/snapshots/test_diagnostics.ambr`. The snapshot files
are human-readable and must be committed to the repository.

Any sequential runs of the tests will then compare the results against the
snapshot. If the results are different, the test will fail.

Snapshots are an easy way to ensure the output of code remains the same over
time and can greatly reduce the amount of testing code needed (while providing)
a full assert against a complete output.

Snapshot testing in Home Assistant is build on top of [Syrupy](https://github.com/tophat/syrupy),
which has been extended to handle Home Assistant-specific data structures.

More information on testing integrations,
can be found [in our documentation](/docs/development_testing).

