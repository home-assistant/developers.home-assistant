---
title: "SARIF Reports"
sidebar_label: "SARIF Reports"
---

## Overview

SARIF (Static Analysis Results Interchange Format) reports are used in GitHub Actions to notify about issues found by linters or code style tools. This guide explains how SARIF reports are handled in our project and how we merge multiple reports into one for compatibility with GitHub Actions.

## Why SARIF reports?

GitHub Actions supports SARIF reports for code scanning, making it easier to identify and address issues directly in pull requests or the repository's security tab. Learn more about SARIF in the [GitHub documentation](https://docs.github.com/en/code-security/code-scanning/integrating-with-code-scanning/sarif-support-for-code-scanning).

## Handling multiple SARIF reports

### The problem

In our project, we use multiple Gradle modules. When running tasks that generate SARIF reports, each module produces its own report. However, GitHub Actions no longer supports processing multiple SARIF reports in a single workflow run.

### The solution

To address this, we use a custom Python script to merge all SARIF reports into a single file. This ensures compatibility with GitHub Actions.

The script for merging SARIF reports is located at `.github/scripts/merge_sarif.py`. Follow these steps to use it:

1. **Generate SARIF reports**
2. Run `python3 .github/scripts/merge_sarif.py`

You will have a new SARIF file at the root level of the repository.
