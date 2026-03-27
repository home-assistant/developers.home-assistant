---
author: Wendelin Peleska
authorURL: https://github.com/wendevlin
title: "Frontend new way of dialogs"
---

## The Problem

Each dialog managed by the dialog manager was only opened once and stayed in the DOM for the lifetime of the application. This causes:

- **More memory usage**: Dialogs accumulate in the DOM even when not visible
- **More bugs because of missing state reset**: Dialog state persists between opens, leading to stale data or unexpected behavior

## The Solution: DialogMixin

We implemented a new way of handling dialogs using `DialogMixin`. With this approach:

- **Dialogs are created when opened and destroyed when closed**: No need to manually reset the state of the dialog when it is closed
- **Closed events are automatically handled**: The dialog mixin takes care of cleanup
- **Subscribe mixin can now be used in dialogs**: Since dialogs are properly destroyed, subscriptions are cleaned up automatically
- **Use normal Lit lifecycle methods**: Use `connectedCallback` to initialize when the dialog is opened instead of relying on the `showDialog` method

## Example

Check out `ha-dialog-date-picker` for a reference implementation. `DialogMixin` adds dialog params to `this.params` if available.