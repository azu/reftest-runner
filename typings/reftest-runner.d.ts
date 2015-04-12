declare module "reftest-runner" {
    interface IReftestOption {
        browser: string;
        port: number;
        logDirectory: string;
        screenshotDirectory: string;
    }
    interface IReftestURLResult {
        URL : string;
        screenshotBase64: string;
    }
    interface IReftestCompareResult {
        passed : boolean;
        differencePoints : number;
        targetA: IReftestURLResult;
        targetB: IReftestURLResult;
    }
    export class ReftestRunner {
        constructor(options:IReftestOption);
    }
}