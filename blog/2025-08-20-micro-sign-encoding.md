---
author: Jan Bouwhuis
authorURL: https://github.com/jbouwh
authorImageURL: https://avatars.githubusercontent.com/u/7188918?s=96&v=4
title: Standardize encoding of μ in units of measurement
---

## One preferred encoding to represent μ in units of measurement

The unit prefix μ is used by unit of measurement constants like μV and μS.
There are however two different Unicode encodings of μ:

1. The [MICRO SIGN](https://www.compart.com/en/unicode/U+00B5)
2. The [Greek Small Letter Mu](https://www.compart.com/en/unicode/U+03BC)

Home Assistant previously mixed the two encodings, which caused issues because string comparisons between the two encodings would fail causing unit of measurement validations to fail.

We chose the "Greek Small Letter Mu" because the "MICRO SIGN" encoding is there for compatibility with old 8-bit western European character sets, and the unicode consortium recommends against using it.

With [#144853](https://github.com/home-assistant/core/pull/144853) we have fixed this in the core of Home Assistant by consequently using the Greek Small Letter Mu version to encode μ. In Python literal strings this variant is encoded as `"\u03bc"`.

Developers should check if their code and libraries have a dependency with the the ambiguous MICRO SIGN (μ) `"\u00b5"`, and migrate their code to use the Greek Small Letter Mu `"\u03bc"` instead to avoid issues.

The `sensor` and `number` entity platforms now include a built-in feature to automatically convert units that use the ambiguous MICRO SIGN (μ) encoding.

## Finding implementations in Visual Studio Code

To be able find the correct instances in your code using Visual Studio Code, it is important to enable the "Match case" option, or else it will search for all variants. Use the information above to copy a char with desired encoding. Note that this search only works correctly with the global search feature. The page search will still show all cases.

## New linter
	
To avoid issues with new or changed code, [#144853](https://github.com/home-assistant/core/pull/144853) adds a linter that warns about incorrect literal assignments using the non-preferred encoding of μ.
