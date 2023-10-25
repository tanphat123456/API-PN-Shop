export class BaseListTotalAmountResponseData<T> {
    private list: T[];
    private total_amount: number;
    private total_record: number;

    constructor( list?: any, total_amount?: number,total_record?: number) {
        this.list = list ? list : [];
        this.total_amount = total_amount ? + total_amount : 0;
        this.total_record = total_record ? + total_record : 0;
    }
    public getData(): Object {
        return this.list;
    }

    public setData(list: T[]): void {
        this.list = list;
    }
}
