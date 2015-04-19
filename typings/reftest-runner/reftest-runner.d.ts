/// <reference path="../bluebird/bluebird.d.ts"/>
/// <reference path="../selenium-webdriver/selenium-webdriver.d.ts"/>

declare module "reftest-runner" {
    interface IReftestServerOption {
        script: Function;
        port : number;
    }
    interface IReftestOption {
        browser: string;
        port?: number;
        rootDir:string;
        server : IReftestServerOption;
        screenshotDir?: string;
        blinkDiff?: Object;
    }
    interface IReftestURLResult {
        URL : string;
        screenshotBase64: string;
    }
    interface IReftestCompareResult {
        passed : boolean;
        compareOperator: string;
        differencePoints : number;
        comparedImagePath? : string;
        targetA: IReftestURLResult;
        targetB: IReftestURLResult;
    }
    interface IReftestEngineTarget {
        targetA: string|IReftestForRunningTarget;
        targetB: string|IReftestForRunningTarget;
        compareOperator: string;
    }
    interface IReftestForRunningTarget {
        URL : string;
        capabilities?: webdriver.Capabilities|Object;
    }
    export class ReftestRunner {
        constructor(options:IReftestOption);

        runTest<T>(URL_A:string, URL_B:string):Promise<T>;

        runTestWithTargets<T>(targetA:IReftestForRunningTarget, targetB:IReftestForRunningTarget):Promise<T>;
    }

}