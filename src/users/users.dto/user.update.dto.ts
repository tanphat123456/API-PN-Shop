import { IsString, Length } from 'class-validator';
import { IsNotEmptyString } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
export class UserUpdateProfileDTO{


    @Length(1, 70)
    @IsNotEmptyString()
    readonly full_name: string;

    @Length(1, 70)
    @IsNotEmptyString()
    readonly birthday: string;

    readonly image_url: string = '';

}