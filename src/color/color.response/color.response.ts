import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
import { Color } from "../color.entity/color.entity"

export class ColorResponse{
    id : number
    name : string
    description : string
    image_id : number
    status : number
    created_at : string
    updated_at : string

    constructor ( color ? : Color){
        this.id = color ? color.id : 0
        this.name = color ? color.name : ""
        this.description =color ? color.description : ""
        this.image_id = color ? color.image_id : 0
        this.status = color ? color.status : 0
        this.created_at = color ? UtilsDate.formatDateTimeVNToString(color.created_at) : '';
        this.updated_at = color ? UtilsDate.formatDateTimeVNToString(color.created_at) : '';
    }


    public mapToList(data: Color[]) {
        let response: ColorResponse[] = [];
        data.forEach(e => {
            response.push(new ColorResponse(e));
        })
        return response;
    }


}