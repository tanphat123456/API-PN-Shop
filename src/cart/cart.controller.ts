import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from 'src/users/users.entity/users.entity';
import { GetUserFromToken } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { StoreProcedureResultInterfaceTotalAmount } from 'src/utils.common/utils.store-procedure-result.common/ultil.store-procedure-result.total-amount.common';
import { ListCartModel } from './cart.entity/list.cart.entity';
import { Response } from 'express';
import { CartService } from './cart.service';
import { BaseListResponseData } from 'src/utils.common/utils.response.common/utils.base-list-response.common';
import { BaseListTotalAmountResponseData } from 'src/utils.common/utils.response.common/utils.total-amount.response.common';
import { ListCartResponse } from './cart.response/cart.list.response';
import { AuthGuard } from '@nestjs/passport';
import { CreateCartDTO } from './cart.dto/create.cart.dto';
import { Cart } from './cart.entity/cart.entity';

@Controller('api/cart')
export class CartController {
    constructor( 
        private cartService : CartService
        ){}

    @Get("")
    @UseGuards(AuthGuard())
    @UsePipes()
    async spGetListCart(@GetUserFromToken() user: User ,@Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(user == null){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Khách hàng Không hợp lệ!`), HttpStatus.OK);
        }
        let cartModel: StoreProcedureResultInterfaceTotalAmount<ListCartModel> = await this.cartService.getListCartByUser(user.id);

        response.setData(new BaseListTotalAmountResponseData<ListCartModel>(new ListCartResponse().mapToList(cartModel.data),cartModel.total_amount ,cartModel.total_record));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/add")
    @UseGuards(AuthGuard())
    @UsePipes()
    async add(@Body(new ValidationPipe()) createCartDTO: CreateCartDTO, @GetUserFromToken() user: User, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!user){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Khách hàng Không hợp lệ!`), HttpStatus.OK);
        }
        let cart : Cart = await this.cartService.createCart(user.id,createCartDTO);
        if(!cart){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không thể thêm sản phẩm vào giỏ hàng !`), HttpStatus.OK);
        }
        let cartModel: StoreProcedureResultInterfaceTotalAmount<ListCartModel> = await this.cartService.getListCartByUser(user.id);
        
        response.setData(new BaseListTotalAmountResponseData<ListCartModel>(new ListCartResponse().mapToList(cartModel.data),cartModel.total_amount,cartModel.total_record));
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/:id/delete")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async delete(@Param('id', ParseIntPipe) cart_id : number,  @GetUserFromToken() user: User, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!user){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Khách hàng Không hợp lệ!`), HttpStatus.OK);
        }
        let cart : Cart = await this.cartService.deleteCartByProductId(user.id,cart_id);
        let cartModel: StoreProcedureResultInterfaceTotalAmount<ListCartModel> = await this.cartService.getListCartByUser(user.id);

        response.setData(new BaseListTotalAmountResponseData<ListCartModel>(new ListCartResponse().mapToList(cartModel.data),cartModel.total_amount));
        return res.status(HttpStatus.OK).send(response);
    }
}
