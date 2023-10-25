import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { IsNotEmptyString } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
export class AuthAdminLoginDTO {
    @IsNotEmptyString()
    readonly email: string;

    @IsNotEmptyString()
    readonly password: string;
}