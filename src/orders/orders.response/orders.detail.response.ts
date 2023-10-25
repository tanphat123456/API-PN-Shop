import { OrderDetail } from "../orders.entity/oders.detail.entity"
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
import { OrderDetailDataModel } from "../orders.entity/orders.detail.data.model"

export class OrderDetailResponse{
    id : number
    user_id : number
    order_id : number
    product_id : number
    color_id : number
    size_id : number
    product_name  : string   
    product_color : string   
    product_size : string
    product_quantity : number
    discount_percent : number
    discount_amount : number
    amount : number
    total_amount : number
    status : number
    created_at : string
    updated_at : string

    constructor(orderDetail ? : OrderDetailDataModel){

        this.id = orderDetail ? orderDetail.id : 0
        this.user_id = orderDetail ? orderDetail.user_id : 0
        this.order_id = orderDetail ? orderDetail.order_id : 0
        this.product_id = orderDetail ? orderDetail.product_id : 0
        this.color_id = orderDetail ? orderDetail.color_id : 0
        this.size_id = orderDetail ? orderDetail.size_id : 0
        this.product_name = orderDetail ? orderDetail.product_name : ''
        this.product_color = orderDetail ? orderDetail.product_color : ''
        this.product_size = orderDetail ? orderDetail.product_size : ''
        this.product_quantity = orderDetail ? orderDetail.product_quantity : 0
        this.discount_percent = orderDetail ? orderDetail.discount_percent : 0
        this.discount_amount = orderDetail ? orderDetail.discount_amount : 0
        this.amount = orderDetail ? orderDetail.amount : 0
        this.total_amount = orderDetail ? orderDetail.total_amount : 0
        this.status = orderDetail ? orderDetail.status : 0
        this.created_at = orderDetail ? UtilsDate.formatDateTimeVNToString(orderDetail.created_at) : '';
        this.updated_at = orderDetail ? UtilsDate.formatDateTimeVNToString(orderDetail.updated_at) : '';     
    }

    public mapToList(data: OrderDetailDataModel[]) {
        let response: OrderDetailResponse[] = [];
        data.forEach(e => {
            response.push(new OrderDetailResponse(e));
        })
        return response;
    }
}