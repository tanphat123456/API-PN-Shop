import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
import { Order } from "../orders.entity/orders.entity"

export class OrderResponse{
     
    id : number
    code : string
    user_id: number
    user_name: string
    user_email: string
    user_phone: string
    birthday: string
    address : string
    total_amount: number
    status: number
    created_at : string 
    updated_at : string 

    constructor( order ? : Order){
        this.id = order ? order.id : 0;
        this.code = order ? order.code : "";
        this.user_id = order ? order.user_id : 0;
        this.user_name = order ? order.user_name : "";
        this.user_email = order ? order.user_email : "";
        this.user_phone = order ? order.user_phone : "";
        this.birthday = order ? UtilsDate.formatDateTimeVNToString(order.birthday) : '';
        this.address = order ? order.address : "";
        this.total_amount = order ? order.total_amount : 0;
        this.status = order ? order.status : 0;
        this.created_at = order ? UtilsDate.formatDateTimeVNToString(order.created_at) : '';
        this.updated_at = order ? UtilsDate.formatDateTimeVNToString(order.updated_at) : '';     
    }

    public mapToList(data: Order[]) {
        let response: OrderResponse[] = [];
        data.forEach(e => {
            response.push(new OrderResponse(e));
        })
        return response;
    }
}