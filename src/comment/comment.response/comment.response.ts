import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
import { CommentDataModel } from "../comment.entity/comment.list.data.model"

export class CommentResponse{
    id : number
    product_id : number
    user_id : number 
    product_name : string
    user_name : string
    user_image_url : string
    star_rating : number 
    user_comment : string
    status : number
    created_at : string 
    updated_at : string 

    constructor(commentDataModel ? : CommentDataModel){
        this.id = commentDataModel ? commentDataModel.id : 0
        this.product_id = commentDataModel ? commentDataModel.product_id : 0
        this.user_id = commentDataModel ? commentDataModel.user_id : 0 
        this.product_name = commentDataModel ? commentDataModel.product_name : ''
        this.user_name = commentDataModel ? commentDataModel.user_name : ''
        this.user_image_url = commentDataModel ? commentDataModel.user_image_url : ''
        this.star_rating = commentDataModel ? commentDataModel.star_rating : 0 
        this.user_comment = commentDataModel ? commentDataModel.user_comment : ''
        this.status = commentDataModel ? commentDataModel.status : 0
        this.created_at =  commentDataModel ? UtilsDate.formatDateTimeVNToString(commentDataModel.created_at) : '';
        this.updated_at = commentDataModel ? UtilsDate.formatDateTimeVNToString(commentDataModel.updated_at) : '';     
    }

    public mapToList(data: CommentDataModel[]) {
        let response: CommentResponse[] = [];
        data.forEach(e => {
            response.push(new CommentResponse(e));
        })
        return response;
    }
}