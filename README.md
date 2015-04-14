# Reftest-runner [![Build Status](https://travis-ci.org/azu/reftest-runner.svg?branch=master)](https://travis-ci.org/azu/reftest-runner)

A visual testing tool for Browser(HTML).

reftest-runner is similar testing tools to [Layout Engine Visual Tests (reftest)](http://mxr.mozilla.org/mozilla-central/source/layout/tools/reftest/README.txt "Layout Engine Visual Tests (reftest)").

[Layout Engine Visual Tests (reftest)](http://mxr.mozilla.org/mozilla-central/source/layout/tools/reftest/README.txt "Layout Engine Visual Tests (reftest)") is adopted major browser Firefox, Chrome, Safari etc.

reftest-runner concept is the same, but use it with any browser that supported WebDriver API.

> A reftest is a test that compares the visual output of one file (the test case) with the output of one or more other files (the references).
> The test and the reference must be carefully written so that when the test passes they have identical rendering, but different rendering when the test fails.

- [Writing Reftests | Test the Web Forward](http://testthewebforward.org/docs/reftests.html)
- [Creating reftest-based unit tests | MDN](https://developer.mozilla.org/en-US/docs/Creating_reftest-based_unit_tests)


## Installation

- [ ] Describe the installation process

## Feature

- Compare compares the visual output of HTMLs.
    - for testing Canvas, HTML, CSS etc..
- Output diff image
    - mismatch the visual, then output diff image of these.
- `reftest.list` support
    - [azu/reftest-list-parser](https://github.com/azu/reftest-list-parser "azu/reftest-list-parser")
    - LIMIT: not support `link rel=match`
- WebDriver API support
    - This tools running on Firefox/Chrome/IE/PhantomJS and more?

## Usage

- [ ] Write usage instructions

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT