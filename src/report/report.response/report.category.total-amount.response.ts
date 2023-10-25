import { CategoryReportDataModel } from "../report.entity/report.category.data.model"

export class CategoryReportTotalAmountResponse{
    id : number                         
    name : string                      
    description : string               
    status : number                   
    total_quantity_remain : number 
    total_quantity_sell : number       
    total_quantity_amount_sell : number

    constructor(categoryReportDataModel ? : CategoryReportDataModel){
        this.id = categoryReportDataModel ? categoryReportDataModel.id : 0                       
        this.name = categoryReportDataModel ? categoryReportDataModel.name : ''                 
        this.description = categoryReportDataModel ? categoryReportDataModel.description : ''             
        this.status = categoryReportDataModel ? categoryReportDataModel.status : 0   
        this.total_quantity_remain = categoryReportDataModel ? categoryReportDataModel.total_quantity_remain : 0               
        this.total_quantity_sell = categoryReportDataModel ? categoryReportDataModel.total_quantity_sell : 0      
        this.total_quantity_amount_sell = categoryReportDataModel ? categoryReportDataModel.total_quantity_amount_sell : 0
    }


    public mapToList(data: CategoryReportDataModel[]) {
        let response: CategoryReportTotalAmountResponse[] = [];
        data.forEach(e => {
            response.push(new CategoryReportTotalAmountResponse(e));
        })
        return response;
    }
}