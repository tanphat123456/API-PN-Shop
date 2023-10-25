import { OrderReportTotalAmountModel } from "../report.entity/report.order.total-amount.data.model"

export class RpOrderTotalAmountResponse{

    total_order : number
    total_order_amount: number
    total_order_pay_complete: number
    total_amount_pay_complete: number
    total_order_unpaid: number
    total_amount_unpaid: number

    constructor( orderReportTotalAmountModel ? : OrderReportTotalAmountModel){
        this.total_order  = orderReportTotalAmountModel ?  orderReportTotalAmountModel.total_order : 0 ; 
        this.total_order_amount = orderReportTotalAmountModel ? orderReportTotalAmountModel.total_order_amount : 0 ; 
        this.total_order_pay_complete = orderReportTotalAmountModel ?  orderReportTotalAmountModel.total_order_pay_complete : 0 ; 
        this.total_amount_pay_complete = orderReportTotalAmountModel ?  orderReportTotalAmountModel.total_amount_pay_complete : 0 ; 
        this.total_order_unpaid = orderReportTotalAmountModel ?  orderReportTotalAmountModel.total_order_unpaid : 0 ; 
        this.total_amount_unpaid = orderReportTotalAmountModel ? orderReportTotalAmountModel.total_amount_unpaid : 0 ; 
    }
}