// LICENSE : MIT
"use strict";
/*
    - engine treat multiple files.
    - engine is wrapped of runner.
 */
import TestRunner from "./reftest-runner"
import Promise from "bluebird"
export default class ReftestEngine {
    constructor(options) {
        this.options = options;
    }

    _setupServer() {
        return new Promise((resolve, reject)=> {
            require("./server/static-server")(this.options, (error, server)=> {
                console.log(server);
                if (error) {
                    return reject(new Error("Fail setup server"));
                }
                this.server = server;
                resolve();
            });
        });
    }

    _closeServer() {
        if (this.server) {
            this.server.close();
        }
    }

    _computeResultOperator(result, compareOperator) {
        // reverser result
        if (compareOperator === "!=") {
            result.passed = !result.passed;
        }
        return result;
    }

    /**
     * run test and return result promise which is filled with array of result.
     * @param {IReftestEngineTarget[]} testTargetList the targetList is defined URL and compareOperator for each test.
     * @returns {Promise.<IReftestCompareResult[]>}
     */
    runTests(testTargetList) {
        var close = (result)=> {
            this._closeServer();
            return result;
        };
        return this._setupServer()
            .then(this._runTest.bind(this, testTargetList))
            .then(close, close);
    }

    _runTest(testTargetList) {
        console.log(testTargetList);
        var runner = new TestRunner(this.options);
        var taskPromiseList = testTargetList.map(function (testTarget) {
            return runner.runTest(testTarget.targetA, testTarget.targetB)
        });
        return Promise.all(taskPromiseList).then((resultList) => {
            return resultList.map((result, index) => {
                var targetItem = testTargetList[index];
                return this._computeResultOperator(result, targetItem.compareOperator);
            })
        });
    }

    getReporter(reporterName) {
        // TODO: implement other reporter
        return require("./reporter/tap-formatter");
    }
}