import { IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class UserResetPasswordDTO
{
    // Người dùng xác thực mật khẩu qua gmail

    @IsNotEmptyString()
    readonly email : string 

    // @IsNotEmptyString()
    // readonly phone_number : string 

}