import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
import { ListCartModel } from "../cart.entity/list.cart.entity"

export class ListCartResponse{
     id : number
     product_id : number
     product_name : string
     color_id : number
     color_name : string
     color_code : string
     size_id : number
     size_name : string
     quantity : number
     amount : number
     discount_amount : number
     total_amount : number
     status : number
     created_at : string
     updated_at : string

     constructor( listCartModel? : ListCartModel){
        this.id  = listCartModel ? listCartModel.id : 0;
        this.product_id  = listCartModel? listCartModel.product_id : 0;
        this.product_name = listCartModel ? listCartModel.product_name : ""
        this.color_id  = listCartModel ? listCartModel.color_id : 0;
        this.color_name = listCartModel ? listCartModel.color_name : ""
        this.color_code = listCartModel ? listCartModel.color_code : ""
        this.size_id  = listCartModel? listCartModel.size_id : 0;
        this.size_name = listCartModel ? listCartModel.size_name : ""
        this.quantity  = listCartModel ? listCartModel.quantity : 0;
        this.amount  = listCartModel ? listCartModel.amount : 0;
        this.discount_amount  = listCartModel ? listCartModel.discount_amount : 0;
        this.total_amount  = listCartModel ? listCartModel.total_amount : 0;
        this.status  = listCartModel ? listCartModel.status : 0;
        this.created_at = listCartModel ? UtilsDate.formatDateTimeVNToString(listCartModel.updated_at) : '';    
        this.updated_at = listCartModel ? UtilsDate.formatDateTimeVNToString(listCartModel.updated_at) : '';   
     }

     public mapToList(data: ListCartModel[]) {
        let response: ListCartResponse[] = [];
        data.forEach(e => {
            response.push(new ListCartResponse(e));
        })
        return response;
    }
}