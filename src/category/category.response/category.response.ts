import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
import { Category } from "../category.entity/category.entity"

export class CategoryResponse{

    id : number
    name : string
    description  : string   
    status : number   
    created_at : string    
    updated_at : string 


    constructor(category ? : Category){
        this.id = category ? category.id : 0
        this.name = category ? category.name : " "
        this.description = category ? category.description : " "
        this.status = category ? category.status : 0
        this.created_at = category ? UtilsDate.formatDateTimeVNToString(category.created_at) : '';
        this.updated_at = category ? UtilsDate.formatDateTimeVNToString(category.updated_at) : '';     
    }


    public mapToList(data: Category[]) {
        let response: CategoryResponse[] = [];
        data.forEach(e => {
            response.push(new CategoryResponse(e));
        })
        return response;
    }
}