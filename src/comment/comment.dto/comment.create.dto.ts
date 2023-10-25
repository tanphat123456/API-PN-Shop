import { IsNotEmptyString ,IsInt} from "src/utils.common/utils.decorators.common/utils.decorators.common";

export class CreateCommentDTO{

    @IsInt()
    readonly product_id : number

    @IsInt()
    readonly star_rating : number

    
    readonly user_comment : string
}

