import { IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class UpdateColorDTO{

    @IsNotEmptyString() 
    description : string = '';

    image_id : number = 0 ;

}