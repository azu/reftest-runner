declare module "reftest-runner" {
    interface IReftestOption {
        browser: string;
        port?: number;
        root
        server?: string;
        logDir?: string;
        screenshotDir?: string;
    }
    interface IReftestURLResult {
        URL : string;
        screenshotBase64: string;
    }
    interface IReftestCompareResult {
        passed : boolean;
        differencePoints : number;
        comparedImagePath? : string;
        targetA: IReftestURLResult;
        targetB: IReftestURLResult;
    }
    interface IReftestEngineTarget {
        targetA: string;
        targetB: string;
        compareOperator: string;
    }
    export class ReftestRunner {
        constructor(options:IReftestOption);
    }
}