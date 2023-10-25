import { IsNotEmptyString ,IsInt} from "src/utils.common/utils.decorators.common/utils.decorators.common";
export class CreateProductDTO
{
    @IsInt()
    readonly supplier_id: number;

    @IsInt()
    readonly category_id: number;

    @IsNotEmptyString() 
    readonly name : string ;

    @IsInt()
    readonly amount: number;

    @IsNotEmptyString() 
    readonly description : string ;
    
    @IsInt()
    readonly discount_percent : number;
    
    @IsInt()
    readonly discount_amount : number;

}