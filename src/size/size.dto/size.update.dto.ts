import { IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class UpdateSizeDTO{
    @IsNotEmptyString() 
    name : string ;

    @IsNotEmptyString() 
    description : string = '';
}