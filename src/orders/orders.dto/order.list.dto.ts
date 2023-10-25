import {  IsString, Length } from "class-validator";
import { IsNotEmptyString ,IsInt } from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class ListOrderDTO{

    @IsInt()
    status : number = -1;

    @IsInt()
    readonly page: number = 1;

    @IsInt()
    readonly limit: number = 20;
}