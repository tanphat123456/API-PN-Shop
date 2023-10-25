import { IsNotEmptyString ,IsInt} from "src/utils.common/utils.decorators.common/utils.decorators.common";


export class CreateOrderDTO{

    @IsNotEmptyString()
    readonly address : string
}