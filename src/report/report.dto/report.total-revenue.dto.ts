import { IsNotEmptyString ,IsInt } from "src/utils.common/utils.decorators.common/utils.decorators.common";
import {  IsString, Length } from "class-validator";
export class RpTotalRevenueDTO{

    @IsString()
    readonly from_date : string = '';

    @IsString()
    readonly to_date : string = '';
}