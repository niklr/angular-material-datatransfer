export interface IPreprocessContainer {
    percent: number; // 0-100
    pause(pause: boolean): void;
    isPaused(): boolean;
    cancel(cancel: boolean): void;
    isCancelled(): boolean;
    doWork(): void;
    run(): void;
}

export class PreprocessContainer implements IPreprocessContainer {
    public percent: number;

    private _isPaused: boolean;
    private _isCancelled: boolean;

    public constructor(init?: Partial<PreprocessContainer>) {
        this.percent = 0;
        this._isPaused = false;
        this._isCancelled = false;
        Object.assign(this, init);
    }

    public pause(pause: boolean): void {
        this._isPaused = pause;
    }

    public isPaused(): boolean {
        return this._isPaused;
    }

    public cancel(cancel: boolean): void {
        this._isCancelled = cancel;
    }

    public isCancelled(): boolean {
        return this._isCancelled;
    }

    public doWork(): void {

    }

    public run(): void {
        this._isPaused = false;
        this.doWork();
    }
}
