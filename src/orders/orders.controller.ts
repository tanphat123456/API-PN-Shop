import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { BaseListResponseData } from 'src/utils.common/utils.response.common/utils.base-list-response.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetAdminFromToken, GetUserFromToken } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { User } from 'src/users/users.entity/users.entity';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './orders.dto/order.create.dto';
import { Order } from './orders.entity/orders.entity';
import { OrderResponse } from './orders.response/orders.response';
import { ListOrderDTO } from './orders.dto/order.list.dto';
import { OrderDetail } from './orders.entity/oders.detail.entity';
import { OrderDetailResponse } from './orders.response/orders.detail.response';
import { OrderDetailDataModel } from './orders.entity/orders.detail.data.model';
import { ListOrderDetailDTO } from './orders.dto/oder.detail.list.dto';
import { UtilsDate } from 'src/utils.common/utils.format-time.common/utils.formar-time.common';
import { Admin } from 'src/admin/admin.entity/admin.entity';
import { CartService } from 'src/cart/cart.service';
import { Cart } from 'src/cart/cart.entity/cart.entity';
import { OrderStatusEnum } from './orders.enum/orders.status.enum';

@Controller('api/order')
export class OrdersController {
    constructor(
        private orderService : OrdersService,
        private cartService : CartService,
    ){}
    @Get("")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetListOrder(@Query() listOrderDTO: ListOrderDTO,@GetUserFromToken() user: User, @Res() res: Response): Promise<any> {
        
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(listOrderDTO.page, listOrderDTO.limit);
        if(!user){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Người dùng không hợp lệ !`), HttpStatus.OK);
        }
        let order: StoreProcedureResultInterface<Order> = await this.orderService.getListOrder(
            user.id,
            listOrderDTO.status,
            pagination
        )
        response.setData(new BaseListResponseData<Order>(new OrderResponse().mapToList(order.data), pagination.limit, order.total_record))
        return res.status(HttpStatus.OK).send(response);
    }


    // Lấy danh sách hóa đơn cho admin
    @Get("/for-admin")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetListOrderForAdmin(@Query() listOrderDTO: ListOrderDTO,@GetAdminFromToken() admin: Admin, @Res() res: Response): Promise<any> {
        
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(listOrderDTO.page, listOrderDTO.limit);
        if(!admin){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let order: StoreProcedureResultInterface<Order> = await this.orderService.getListOrderForAdmin(
            listOrderDTO.status,
            pagination
        )
        response.setData(new BaseListResponseData<Order>(new OrderResponse().mapToList(order.data), pagination.limit, order.total_record))
        return res.status(HttpStatus.OK).send(response);
    }

    // Lấy hóa đơn theo id truyền vào cho admin

    @Get("/:id/for-admin")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetOrderByIdForAdmin(@Param('id', ParseIntPipe) order_id : number,@GetAdminFromToken() admin: Admin, @Res() res: Response): Promise<any> {
        
        let response: ResponseData = new ResponseData();
        if(!admin){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let order : Order = await this.orderService.findOneById(order_id)
        if(!order){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Không tìm thấy hóa đơn !`), HttpStatus.OK);
        }
        response.setData(new OrderResponse(order));
        return res.status(HttpStatus.OK).send(response);
    }
    
    // lấy hóa đơn theo id truyền vào

    @Get("/:id")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetOrderById(@Param('id', ParseIntPipe) order_id : number,@GetUserFromToken() user: User, @Res() res: Response): Promise<any> {
        
        let response: ResponseData = new ResponseData();
        if(!user){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Người dùng không hợp lệ !`), HttpStatus.OK);
        }
        let order : Order = await this.orderService.findOneById(order_id)
        if(!order){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Không tìm thấy hóa đơn !`), HttpStatus.OK);
        }
        response.setData(new OrderResponse(order));
        return res.status(HttpStatus.OK).send(response);
    }


    @Get("/:id/detail/for-admin")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetOrderDetailForAdmin(@Param('id', ParseIntPipe) order_id : number,@Query() listOrderDetailDTO: ListOrderDetailDTO,@GetAdminFromToken() admin: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(listOrderDetailDTO.page, listOrderDetailDTO.limit);
        if(!admin){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let order: StoreProcedureResultInterface<OrderDetailDataModel> = await this.orderService.getListOrderDetail(
            order_id,
            pagination
        )
        response.setData(new BaseListResponseData<OrderDetailDataModel>(new OrderDetailResponse().mapToList(order.data), pagination.limit, order.total_record))
        return res.status(HttpStatus.OK).send(response);
    }

    // Chi tiết hóa đơn cho người dùng

    @Get("/:id/detail")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetOrderDetail(@Param('id', ParseIntPipe) order_id : number,@Query() listOrderDetailDTO: ListOrderDetailDTO,@GetUserFromToken() user: User, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(listOrderDetailDTO.page, listOrderDetailDTO.limit);
        if(!user){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Người dùng không hợp lệ !`), HttpStatus.OK);
        }
        let order: StoreProcedureResultInterface<OrderDetailDataModel> = await this.orderService.getListOrderDetail(
            order_id,
            pagination
        )
        response.setData(new BaseListResponseData<OrderDetailDataModel>(new OrderDetailResponse().mapToList(order.data), pagination.limit, order.total_record))
        return res.status(HttpStatus.OK).send(response);
    }

    @Post("/create")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body(new ValidationPipe()) createOrderDTO: CreateOrderDTO,  @GetUserFromToken() user: User, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!user){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Người dùng không hợp lệ !`), HttpStatus.OK);
        }
        let userBirthday : string = UtilsDate.formatDateVNToString(user.birthday)
        let order : Order = await this.orderService.createOrder(user.id,
            createOrderDTO,
            user.full_name,
            user.email,
            user.phone_number,
            userBirthday
            )
        if(!order){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không tạo được hóa đơn , vui lòng thử lại !`), HttpStatus.OK);
        }else{
            let cart : Cart = await this.cartService.clearCartByUserId(user.id);
            response.setData(new OrderResponse(order));
            return res.status(HttpStatus.OK).send(response);
        }
    }  

    @Post("/:id/confim-payment")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async confirmPayment(@Param('id', ParseIntPipe) order_id : number, @GetAdminFromToken() admin: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!admin){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }else{
            let order : Order = await this.orderService.findOneById(order_id);
            if(!order){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Đơn hàng không tồn tại !`), HttpStatus.OK);
            }
            if(order.status == OrderStatusEnum.PAYMENT_CONFIRM){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Đơn hàng đã được thanh toán rồi !`), HttpStatus.OK);
            }
            if(order.status == OrderStatusEnum.PAYMENT_DENIED){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Đơn hàng này đã bị hủy , không thể thanh toán !`), HttpStatus.OK);
            }
            let orderPayment : Order = await this.orderService.confirmPaymentOrder(order_id);
            if(!orderPayment){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Thanh toán thất bại , vui lòng thử lại `), HttpStatus.OK);
            }
            response.setData(new OrderResponse(orderPayment));
            return res.status(HttpStatus.OK).send(response);
        }
            
    }

    @Post("/:id/cancel-payment")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async cancelOrder(@Param('id', ParseIntPipe) order_id : number, @GetUserFromToken() user: User, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        if(!user){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Người dùng không hợp lệ !`), HttpStatus.OK);
        }else{
            let order : Order = await this.orderService.findOneById(order_id);
            if(!order || order.user_id != user.id){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Bạn không có quyền hủy đơn hàng này !`), HttpStatus.OK);
            }
            if(order.status == OrderStatusEnum.PAYMENT_CONFIRM){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Đơn hàng đã được thanh toán rồi !`), HttpStatus.OK);
            }
            if(order.status == OrderStatusEnum.PAYMENT_DENIED){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Đơn hàng này đã bị hủy !`), HttpStatus.OK);
            }
            let orderPayment : Order = await this.orderService.cancelPaymentOrder(order_id);
            if(!orderPayment){
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Hủy đơn hàng thất bại , vui lòng thử lại `), HttpStatus.OK);
            }
            response.setData(new OrderResponse(orderPayment));
            return res.status(HttpStatus.OK).send(response);
        }   
    }
}
