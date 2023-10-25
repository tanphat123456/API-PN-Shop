import { ProductReportDataModel } from "../report.entity/report.product.list.data.model"

export class RpProductTotalAmountResponse{
    id : number
    supplier_id :number
    supplier_name : string
    category_id : number
    category_name :string
    product_name :string
    code  :string
    description  :string
    amount  :number
    discount_amount  :number
    total_amount  :number
    total_quantity :number
    total_quantity_amount :number
    total_quantity_sell :number
    total_quantity_amount_sell :number

    constructor( productReportDataModel ? : ProductReportDataModel){
        this.id = productReportDataModel ? productReportDataModel.id : 0
        this.supplier_id = productReportDataModel ? productReportDataModel.supplier_id : 0
        this.supplier_name = productReportDataModel ? productReportDataModel.supplier_name : ''
        this.category_id = productReportDataModel ? productReportDataModel.category_id : 0
        this.category_name = productReportDataModel ? productReportDataModel.category_name : ''
        this.product_name = productReportDataModel ? productReportDataModel.product_name : ''
        this.code = productReportDataModel ? productReportDataModel.code : ''
        this.description = productReportDataModel ? productReportDataModel.description : ''
        this.amount = productReportDataModel ? productReportDataModel.amount : 0
        this.discount_amount = productReportDataModel ? productReportDataModel.discount_amount : 0
        this.total_amount = productReportDataModel ? productReportDataModel.total_amount : 0
        this.total_quantity = productReportDataModel ? productReportDataModel.total_quantity : 0
        this.total_quantity_amount = productReportDataModel ? productReportDataModel.total_quantity_amount : 0
        this.total_quantity_sell = productReportDataModel ? productReportDataModel.total_quantity_sell : 0
        this.total_quantity_amount_sell = productReportDataModel ? productReportDataModel.total_quantity_amount_sell : 0
    }

    public mapToList(data: ProductReportDataModel[]) {
        let response: RpProductTotalAmountResponse[] = [];
        data.forEach(e => {
            response.push(new RpProductTotalAmountResponse(e));
        })
        return response;
    }
}