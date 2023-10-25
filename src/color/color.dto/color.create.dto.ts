import { IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class CreateColorDTO{

    @IsNotEmptyString() 
    name : string ;

    @IsNotEmptyString() 
    description : string = '';

    image_id : number = 0 ;

}