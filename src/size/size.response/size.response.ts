import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
import { Size } from "../size.entity/size.entity"

export class SizeResponse{
    id : number
    name : string
    description : string
    status : number
    created_at : string
    updated_at : string

    constructor( size ? : Size){
        this.id = size ? size.id : 0 
        this.name = size ? size.name : ""
        this.description = size ? size.description : "" 
        this.status = size ? size.status : 0 
        this.created_at = size ?  UtilsDate.formatDateTimeVNToString(size.created_at) : '';
        this.updated_at = size ? UtilsDate.formatDateTimeVNToString(size.created_at) : ''; 
    }

    public mapToList(data: Size[]) {
        let response: SizeResponse[] = [];
        data.forEach(e => {
            response.push(new SizeResponse(e));
        })
        return response;
    }
}