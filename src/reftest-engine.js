// LICENSE : MIT
"use strict";
/*
    - engine treat multiple files.
    - engine is wrapped of runner.
 */
import Promise from "bluebird"
import ObjectAssign from "object-assign"
import TestRunner from "./reftest-runner"
import defaultOptions from "./options/default-options"
import {EventEmitter} from "events"
import assert from "assert"
var debug = require("debug")("reftest-engine");
export default class ReftestEngine {
    constructor(options) {
        this.options = ObjectAssign(options, defaultOptions);
        this.serverEmitter = new EventEmitter();
    }

    _setupServer() {
        if (!this.options.server || !this.options.server.script) {
            return Promise.resolve();
        }
        if (typeof this.options.server.script !== "function") {
            throw new Error("options.server.script should be function.");
        }
        return new Promise((resolve, reject)=> {
            this.serverEmitter.once("connection", resolve);
            this.serverEmitter.once("error", reject);
            var severImplement = this.options.server.script;
            severImplement(this.serverEmitter, this.options);
            assert(this.serverEmitter.listeners("close").length > 0, `${severImplement.name} should implement emitter.on("close", function({ ... })`);
        });
    }

    /**
     *
     * @param {IReftestEngineTarget} testTargetList
     * @private
     */
    _resolveFileList(testTargetList) {
        return testTargetList.map();
    }

    _closeServer() {
        this.serverEmitter.emit("close");
        this.serverEmitter.removeAllListeners();
    }

    _computeResultOperator(result, compareOperator) {
        // reverser result
        if (compareOperator === "!=") {
            result.passed = !result.passed;
        }
        return result;
    }


    getTargetListFromFile(reftestListFilePath) {
        var parse = require("reftest-list-parser").parse;
        var fs = require("fs");
        var path = require("path");
        var data = fs.readFileSync(reftestListFilePath, "utf-8");
        var list = parse(data);
        var baseDir = path.dirname(reftestListFilePath);
        // resolve path from `rootDir`
        return list.map((item)=> {
            item.targetA = path.resolve(baseDir, item.targetA);
            item.targetB = path.resolve(baseDir, item.targetB);
            return item;
        })

    }

    /**
     * run test and return result promise which is filled with array of result.
     * @param {IReftestEngineTarget[]} testTargetList the targetList is defined URL and compareOperator for each test.
     * @returns {Promise.<IReftestCompareResult[]>}
     */
    runTests(testTargetList) {
        var close = (result)=> {
            if (result instanceof Error) {
                return Promise.reject(result);
            }
            this._closeServer();
            return result;
        };
        var resolve = require("./utils/option-utils").resolveTargetPath;
        var resolvedTargetList = testTargetList.map((target)=> {
            return resolve(target, this.options);
        });
        debug("TargetList: %o", testTargetList);
        return this._setupServer()
            .then(this._runTests.bind(this, resolvedTargetList))
            .then(close, close);
    }

    /**
     *
     * @param {IReftestEngineTarget[]} testTargetList
     * @returns {Promise.<T>}
     * @private
     */
    _runTests(testTargetList) {
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