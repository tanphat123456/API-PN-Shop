import { IsNotEmptyString ,IsInt} from "src/utils.common/utils.decorators.common/utils.decorators.common";
export class CreateImageDTO{

    @IsNotEmptyString() 
    readonly image_url: string;
}