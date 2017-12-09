export interface IPreprocessContainer {
    percent: number; // 0-100
    pause: Function;
    cancel: Function;
    run: Function;
}

export class PreprocessContainer implements IPreprocessContainer {
    public percent: number;
    public pause: Function;
    public cancel: Function;
    public run: Function;

    public constructor(init?: Partial<PreprocessContainer>) {
        this.percent = 0;
        this.pause = function() { };
        this.cancel = function() { };
        this.run = function() { };
        Object.assign(this, init);
    }
}
