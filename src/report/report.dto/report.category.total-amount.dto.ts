import { IsNotEmptyString ,IsInt } from "src/utils.common/utils.decorators.common/utils.decorators.common";
import {  IsString, Length } from "class-validator";
export class RpCategoryTotalAmountDTO{

    readonly category_id : number = -1;

    @IsString()
    readonly from_date : string = '';

    @IsString()
    readonly to_date : string = '';

    @IsInt()
    readonly page: number = 1;

    @IsInt()
    readonly limit: number = 20;
}