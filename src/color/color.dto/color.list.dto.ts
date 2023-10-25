 
import { IsNotEmptyString ,IsInt} from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class ListColorDTO{
    key_search : string = '';

    @IsInt()
    status : number = -1;

    @IsInt()
    readonly page: number = 1;

    @IsInt()
    readonly limit: number = 20;
}