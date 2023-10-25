import { IsString } from "class-validator";
import { IsInt, IsNotEmptyString } from "src/utils.common/utils.decorators.common/utils.decorators.common";
import { ProductSizeColorDataModel } from "../product.entity/product.size.quantity.data.model";
    export class CreateProductDetailDTO{

        @IsInt()
        color_id : number;

        image_ids : string[]

        product_size_quantity_data : ProductSizeColorDataModel[]
    }