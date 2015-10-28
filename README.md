# Reftest-runner [![Build Status](https://travis-ci.org/azu/reftest-runner.svg?branch=master)](https://travis-ci.org/azu/reftest-runner)

A visual testing tool for Browser(HTML).

![overview](./docs/reftest-runner-overview-image.png)

from [reftest-runner-overview.pdf](./docs/reftest-runner-overview.pdf).


reftest-runner is similar testing tools to [Layout Engine Visual Tests (reftest)](http://mxr.mozilla.org/mozilla-central/source/layout/tools/reftest/README.txt "Layout Engine Visual Tests (reftest)").

[Layout Engine Visual Tests (reftest)](http://mxr.mozilla.org/mozilla-central/source/layout/tools/reftest/README.txt "Layout Engine Visual Tests (reftest)") is adopted major browser Firefox, Chrome, Safari etc.

reftest-runner concept is the same, but use it with any browser that supported WebDriver API.

> A reftest is a test that compares the visual output of one file (the test case) with the output of one or more other files (the references).
> The test and the reference must be carefully written so that when the test passes they have identical rendering, but different rendering when the test fails.

- [Writing Reftests | Test the Web Forward](http://testthewebforward.org/docs/reftests.html)
- [Creating reftest-based unit tests | MDN](https://developer.mozilla.org/en-US/docs/Creating_reftest-based_unit_tests)
- [Reftest Overview](http://adobe.github.io/web-platform/presentations/testtwf-how-to-write-a-reftest/#/1 "Reftest Overview")

## Installation

    npm install reftest-runner

Require Node.js v4 >=

## Feature

- Compare the visual output of HTMLs.
    - for testing Canvas, HTML, CSS etc..
- Compare the visual output of browsers.
    - e.g.) Firefox vs Chrome.
- Output diff image
    - mismatch the visual, then output diff image of these.
- Output test result as TAP format.
- `reftest.list` support
    - [azu/reftest-list-parser](https://github.com/azu/reftest-list-parser "azu/reftest-list-parser")
- WebDriver API support
    - This tools running on Firefox/Chrome/IE/PhantomJS and more?

## Usage

### Command line

    npm install reftest-runner -g

If you want to compare `path/to/fileA.html` and `path/to/fileB.html` using phantomjs.

```sh
$ reftest-runner --browser "phantomjs" --targetA path/to/fileA.html --targetB path/to/fileB.html
```

also use `reftest.lit` file for test.

```
$ reftest-runner --list path/to/reftest.list
```

You can view about `reftest.list` format on [azu/reftest-list-parser](https://github.com/azu/reftest-list-parser "azu/reftest-list-parser").


#### Command line help

```sh
reftest-runner [options]

Options:
  -h, --help                Show help
  -l, --list path::String   Use reftest list from this file
  --targetA path::String    Use a specific test html file
  --targetB path::String    Use a specific test html file
  -v, --version             Outputs the version number
  -b, --browser String      Specify Browser - default: phantomjs
  --compareOperator String  Specify compareOperator. == OR != - default: ==
  --useExternalServer       Use external server url
```


Command line interface is limited.

if you want to flexibility, please suggestion to issue or use it as node modules.

### Node modules

Please see the [Examples](example/). :bulb:

`reftest-runner` export `Engine` and `Runner`.

- `Engine` is wrapper of `Runner` for treating multiple files and using local server...
- `Runner` is core module.

```js
module.exports = {
    Engine: require("./reftest-engine"),
    Runner: require("./reftest-runner")
};
```

Example: Programmatic run test with reftest.list

```js
var path = require("path");
var Promise = require("bluebird");
var ReftestEngine = require("reftest-runner").Engine;
// options
// see https://github.com/azu/reftest-runner/blob/master/typings/reftest-runner/reftest-runner.d.ts
//     https://github.com/azu/reftest-runner/blob/master/src/options/default-options.js
var testEngine = new ReftestEngine({
    server: {
        port: 8989
    },
    rootDir: __dirname
});
function allPassed(resultList) {
    return resultList.every(function (result) {
        return result.passed;
    });
}

// run test with reftest.list
function reftestWithList(reftestListPath) {
    var list = testEngine.getTargetListFromFile(reftestListPath);
    return testEngine.runTests(list).then(function (resultList) {
        var formatter = testEngine.getReporter();
        var output = formatter(resultList);
        console.log(output);
        if (!allPassed(resultList)) {
            return Promise.reject(new Error("FAIL"));
        }
    });
}

var reftestListPath = path.join(__dirname, "reftest.list");
reftestWithList(reftestListPath).catch(function (error) {
    console.error(error.message);
    console.error(error.stack);
});
```



### Programmatic usage document

Please see the [docs/](docs/) :bulb:

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
