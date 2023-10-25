import { IsNotEmptyString,IsInt } from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class CreateCartDTO{
    @IsInt()
    readonly product_id: number;

    @IsInt()
    readonly color_id: number;

    @IsInt()
    readonly size_id: number;

    @IsInt()
    readonly quantity: number;

}