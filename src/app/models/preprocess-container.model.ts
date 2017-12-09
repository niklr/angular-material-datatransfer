export interface IPreprocessContainer {
    percent: number; // 0-100
    pause(): void;
    isPaused(): boolean;
    cancel(): void;
    doWork(): void;
    run(): void;
}

export class PreprocessContainer implements IPreprocessContainer {
    public percent: number;

    private _isPaused: boolean;

    public constructor(init?: Partial<PreprocessContainer>) {
        this.percent = 0;
        this._isPaused = false;
        Object.assign(this, init);
    }

    public pause(): void {
        this._isPaused = true;
    }

    public isPaused(): boolean {
        return this._isPaused;
    }

    public cancel(): void {

    }

    public doWork(): void {

    }

    public run(): void {
        this._isPaused = false;
        this.doWork();
    }
}
