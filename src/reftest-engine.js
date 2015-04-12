// LICENSE : MIT
"use strict";
/*
    - engine treat multiple files.
    - engine is wrapped of runner.
 */
import TestRunner from "./reftest-runner"
import Promise from "bluebird"
export default class ReftestEngine {
    constructor() {

    }

    _computeResultOperator(result, compareOperator) {
        // reverser result
        if (compareOperator === "!=") {
            result.passed = !result.passed;
        }
        return result;
    }

    runTests(testList) {
        var runner = new TestRunner({
            screenshotDirectory: process.cwd() + "/"
        });
        var taskPromiseList = testList.map(function (testTarget) {
            return runner.runTest(testTarget.targetA, testTarget.targetB)
        });
        return Promise.all(taskPromiseList).then((resultList) => {
            return resultList.map((result, index) => {
                var targetItem = testList[index];
                return this._computeResultOperator(result, targetItem.compareOperator);
            })
        });
    }

    getFormatter(formatterName) {
        return require("./formmater/tap-formatter");
    }
}