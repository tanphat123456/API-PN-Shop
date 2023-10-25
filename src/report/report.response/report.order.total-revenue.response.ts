import { OrderReportTotalRevenueModel } from "../report.entity/report.oder.total-revenue.data.model"

export class RpOrderTotalRevenueResponse{
    total_revenue : number
    total_expense: number
    total_profit: number
    
    constructor(orderReportTotalRevenueModel ? : OrderReportTotalRevenueModel){
        this.total_revenue  = orderReportTotalRevenueModel ? orderReportTotalRevenueModel.total_revenue : 0;
        this.total_expense = orderReportTotalRevenueModel ? orderReportTotalRevenueModel.total_expense : 0;
        this.total_profit = orderReportTotalRevenueModel ? orderReportTotalRevenueModel.total_profit : 0;
    }
}