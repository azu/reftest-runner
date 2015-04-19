# Example

## How to define the target for testing?

Write [reftest.list](reftest.list)

```
# implementation is difference, but visual is the same
== ./equal/smile-canvas.html ./equal/smile-img.html
# ◀ != ▶
!= ./non-equal/canvas-left.html ./non-equal/canvas-right.html
# async test support
== ./async/reftest-async-xhr.html ./async/reftest-sync.html
```

## How to write async test?

See [async](async/) example

## How to test between Firefox and Chrome?

See `reftestPhantomJSAndFirefox` of example

```js
function reftestPhantomJSAndFirefox() {
    var listWithBrowserCapabilities = [
        {
            compareOperator: "==",
            targetA: {
                URL: "./equal/smile-canvas.html",
                capabilities: {// <= selenium-webdriver options
                    browserName: "chrome"
                }
            },
            targetB: {
                URL: "./equal/smile-canvas.html",
                capabilities: {
                    browserName: "firefox"
                }
            }
        }
    ];
    return testEngine.runTests(listWithBrowserCapabilities).then(function (resultList) {
        var formatter = testEngine.getReporter();
        var output = formatter(resultList);
        console.log(output);
        if (!allPassed(resultList)) {
            return Promise.reject(new Error("FAIL"));
        }
    });
}
```

`runTestWithTargets` method of `reftest-runner.js` is the core.