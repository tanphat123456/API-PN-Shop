
import { IsString } from "class-validator";
import { IsInt, IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class ProductDTO{

    @IsInt()
    supplier_id: number = -1;

    @IsInt()
    category_id : number = -1;

    @IsString()
    key_search : string = '';

    @IsInt()
    status : number = -1;

    sort : number = -1;

    @IsInt()
    readonly page: number = 1;

    @IsInt()
    readonly limit: number = 20;

}