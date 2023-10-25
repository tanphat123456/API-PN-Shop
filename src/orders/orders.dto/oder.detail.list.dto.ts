import { IsInt, IsString, Length } from "class-validator";
import { IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";
export class ListOrderDetailDTO{
    @IsInt()
    readonly page: number = 1;

    @IsInt()
    readonly limit: number = 20;
}