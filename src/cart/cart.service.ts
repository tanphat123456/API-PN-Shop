import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection,Repository } from 'typeorm';
import { Cart } from './cart.entity/cart.entity';
import { ExceptionStoreProcedure } from 'src/utils.common/utils.exceptions.common/utils.store-procedure-exception.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { StoreProcedureResult } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.common';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { CreateCartDTO } from './cart.dto/create.cart.dto';
import { StoreProcedureResultInterfaceTotalAmount } from 'src/utils.common/utils.store-procedure-result.common/ultil.store-procedure-result.total-amount.common';
import { ListCartModel } from './cart.entity/list.cart.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
    private cartRepository: Repository<Cart>, 
    ){}

    async createCart(user_id : number,createCartDTO : CreateCartDTO ) : Promise<Cart>{
        let result = await this.cartRepository.query('CALL sp_create_cart(?,?,?,?,?,@status,@message); SELECT @status AS status, @message AS message',
        [
            user_id,
            createCartDTO.product_id,
            createCartDTO.color_id,
            createCartDTO.size_id,
            createCartDTO.quantity
        ])
        ExceptionStoreProcedure.validate(result);
        return result
    }

    async deleteCartByProductId(user_id : number , product_id : number) : Promise<Cart>{
        let result = await this.cartRepository.query('CALL sp_delete_product_from_cart(?,?,@status,@message); SELECT @status AS status, @message AS message',[
            user_id,
            product_id
        ])
        ExceptionStoreProcedure.validate(result);
        return result;
    }

    async clearCartByUserId(user_id : number) : Promise<Cart>{
        let result = await this.cartRepository.query('CALL sp_clear_list_cart_by_user(?,@status,@message); SELECT @status AS status, @message AS message',[
            user_id
        ])
        ExceptionStoreProcedure.validate(result);
        return result;
    }

    async getListCartByUser(user_id : number) : Promise<StoreProcedureResultInterfaceTotalAmount<ListCartModel>>{
        let result = await this.cartRepository.query('CALL sp_get_list_cart_by_user_id(?,@status,@message,@totalAmount,@totalRecord); SELECT @status AS status, @message AS message, @totalAmount AS total_amount , @totalRecord AS total_record',
        [
           user_id
        ]);
        
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterfaceTotalAmount<ListCartModel> = new StoreProcedureResult<ListCartModel>().getResultTotalAmount(result)
        return data;
    }



    async findOneById(id: number): Promise<Cart> {
        return await this.cartRepository.findOneBy({ id});
      }

    async update(cart: Cart): Promise<Cart> {
        return await this.cartRepository.save(cart);
    }
}
