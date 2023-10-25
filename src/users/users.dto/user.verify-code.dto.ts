import { IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class UserVerifyCodeDTO
{

    @IsNotEmptyString()
    readonly email : string

    @IsNotEmptyString()
    readonly verify_code : string

}