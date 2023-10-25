import { ProductDetailReportDataModel } from "../report.entity/report.product.detail.data.model"

export class ProductDetailReportResponse{
    product_id : number     
    color_id : number         
    size_id : number          
    color_name : string    
    color_code : string       
    size_name: string      
    total_quantity: number      
    total_amount : number       
    quantity_remain : number    
    total_amount_remain : number 
    quantity_sell : number      
    total_amount_sell : number   

    constructor(productDetailReportDataModel ? : ProductDetailReportDataModel ){
        this.product_id = productDetailReportDataModel ?  productDetailReportDataModel.product_id : 0
        this.color_id = productDetailReportDataModel ?  productDetailReportDataModel.color_id : 0       
        this.size_id = productDetailReportDataModel ?  productDetailReportDataModel.size_id : 0        
        this.color_name = productDetailReportDataModel ?  productDetailReportDataModel.color_name : ''     
        this.color_code = productDetailReportDataModel ?  productDetailReportDataModel.color_code : ''       
        this.size_name = productDetailReportDataModel ?  productDetailReportDataModel.size_name : ''        
        this.total_quantity = productDetailReportDataModel ?  productDetailReportDataModel.total_quantity : 0           
        this.total_amount = productDetailReportDataModel ?  productDetailReportDataModel.total_amount : 0            
        this.quantity_remain = productDetailReportDataModel ?  productDetailReportDataModel.quantity_remain : 0         
        this.total_amount_remain = productDetailReportDataModel ?  productDetailReportDataModel.total_amount_remain : 0      
        this.quantity_sell = productDetailReportDataModel ?  productDetailReportDataModel.quantity_sell : 0           
        this.total_amount_sell = productDetailReportDataModel ?  productDetailReportDataModel.total_amount_sell : 0       
    }

    public mapToList(data: ProductDetailReportDataModel[]) {
        let response: ProductDetailReportResponse[] = [];
        data.forEach(e => {
            response.push(new ProductDetailReportResponse(e));
        })
        return response;
    }
}