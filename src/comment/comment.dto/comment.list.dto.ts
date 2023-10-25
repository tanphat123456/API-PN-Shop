import { IsNotEmptyString ,IsInt} from "src/utils.common/utils.decorators.common/utils.decorators.common";
export class CommentListDTO{

    @IsInt()
    readonly product_id : number = -1

    @IsInt()
    readonly status : number = -1

    @IsInt()
    readonly page: number = 1;

    @IsInt()
    readonly limit: number = 20;
}