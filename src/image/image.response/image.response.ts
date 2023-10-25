import { Images } from "../image.entity/image.entity"
import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common"
export class ImageResponse{
    id : number      
    image_url : string   
    created_at : string    
    updated_at : string  

    constructor( image ? : Images){
        this.id = image ? image.id : 0
        this.image_url = image ? image.image_url : ""
        this.created_at = image ? UtilsDate.formatDateTimeVNToString(image.created_at) : '';
        this.updated_at = image ? UtilsDate.formatDateTimeVNToString(image.updated_at) : '';
    }

    public mapToList(data: Images[]) {
        let response: ImageResponse[] = [];
        data.forEach(e => {
            response.push(new ImageResponse(e));
        })
        return response;
    }
}