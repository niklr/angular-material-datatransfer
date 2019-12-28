export interface IPaginationContainer {
    pages: number[];
    page: number;
    rpp: number;
    total: number;
    rppOptions: number[];
}

export class PaginationContainer implements IPaginationContainer {
    public pages: number[];
    public page: number;
    public rpp: number;
    public total: number;
    public rppOptions: number[];

    constructor() {
        this.pages = [];
        this.page = 1;
        this.rpp = 5;
        this.total = 0;
    }
}
