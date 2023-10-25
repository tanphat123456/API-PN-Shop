
import { IsNotEmptyString ,IsInt} from "src/utils.common/utils.decorators.common/utils.decorators.common";
export class ListImageDTO{
    @IsInt()
    readonly page: number = 1;

    @IsInt()
    readonly limit: number = 20;
}