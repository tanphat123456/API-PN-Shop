import { ProductListDetailModel } from "../product.entity/product.list.detail.entity"
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"

export class ProductListDataResponse{
    id : number       
    supplier_name : string   
    category_name : string   
    name : string    
    code : string             
    description  : string    
    product_image  : string 
    amount : number         
    discount_amount  : number
    discount_percent : number
    product_detail : string  
    status : number   
    created_at : string    
    updated_at : string   
    
    constructor( product ? : ProductListDetailModel){
        this.id = product ? product.id : 0;          
        this.supplier_name = product ? product.supplier_name : "";
        this.category_name = product ? product.category_name : "";   
        this.name = product ? product.name : ""; 
        this.code = product ? product.code : "";     
        this.description = product ? product.description : "";   
        this.product_image = product ? JSON.parse(`${product.product_image}`) : "[]";        
        this.amount = product ? product.amount : 0;            
        this.discount_amount = product ? product.discount_amount : 0;      
        this.discount_percent = product ? product.discount_percent : 0;    
        this.product_detail = product ? JSON.parse(`${product.product_detail}`) : "[]";     
        this.status = product ? product.status   : 0; 
        this.created_at = product ? UtilsDate.formatDateTimeVNToString(product.created_at) : '';
        this.updated_at = product ? UtilsDate.formatDateTimeVNToString(product.updated_at) : '';     
    }

    public mapToList(data: ProductListDetailModel[]) {
        let response: ProductListDataResponse[] = [];
        data.forEach(e => {
            response.push(new ProductListDataResponse(e));
        })
        return response;
    }
}