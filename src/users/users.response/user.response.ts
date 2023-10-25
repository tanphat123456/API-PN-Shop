import { UtilsDate } from "src/utils.common/utils.format-time.common/utils.formar-time.common";
import { User } from "../users.entity/users.entity";

export class UserResponse{
 
    
    id : number;
    full_name : string;
    email : string;
    birthday : string;
    password : string;
    phone_number : string
    image_url : string
    address : string
    verify_code : string
    token : string
    created_at : string;
    updated_at : string;

    constructor(user ? :  User) {
        this.id = user ?  user.id : 0
        this.full_name = user ?  user.full_name : "";
        this.email = user ?  user.email : "";
        this.token = user ?  user.token : "";
        this.birthday = user ?  UtilsDate.formatDateVNToString(user.birthday) : "";
        this.password = user ?  user.password : "";
        this.phone_number = user ?  user.phone_number : "";
        this.image_url = user ?  user.image_url : "";
        this.address = user ?  user.address : "";
        this.verify_code = user ?  user.verify_code : "";
        this.created_at = user ?  UtilsDate.formatDateTimeVNToString(user.created_at) : "";
        this.updated_at = user ?  UtilsDate.formatDateTimeVNToString(user.updated_at) : "";
    }

    public mapToList(data: User[]) {
        let response: UserResponse[] = [];
        data.forEach(e => {
            response.push(new UserResponse(e));
        })
        return response;
    }
}