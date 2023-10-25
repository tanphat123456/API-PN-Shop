import { ProductDetailByIdDataModel } from "../product.entity/product.by.id.entity";

export class ProductDetailDataResponse{
    color_id : number
    color_name : string
    color_code : string
    size_detail : string
    product_image_color : string

    constructor( product ? : ProductDetailByIdDataModel){
        this.color_id = product ? product.color_id : 0;          
        this.color_name = product ? product.color_name : "";
        this.color_code = product ? product.color_code : "";
        this.size_detail = product ? JSON.parse(`${product.size_detail}`) : "[]";   
        this.product_image_color = product ? JSON.parse(`${product.product_image_color}`) : "[]";   
       
    }

    public mapToList(data: ProductDetailByIdDataModel[]) {
        let response: ProductDetailDataResponse[] = [];
        data.forEach(e => {
            response.push(new ProductDetailDataResponse(e));
        })
        return response;
    }
}