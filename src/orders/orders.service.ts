import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection,Repository } from 'typeorm';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { ExceptionStoreProcedure } from 'src/utils.common/utils.exceptions.common/utils.store-procedure-exception.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { StoreProcedureResult } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.common';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { Order } from './orders.entity/orders.entity';
import { CreateOrderDTO } from './orders.dto/order.create.dto';
import { OrderDetail } from './orders.entity/oders.detail.entity';
import { OrderDetailDataModel } from './orders.entity/orders.detail.data.model';
import { OrderReportTotalAmountModel } from 'src/report/report.entity/report.order.total-amount.data.model';
import { OrderReportTotalRevenueModel } from 'src/report/report.entity/report.oder.total-revenue.data.model';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>
    ){ }

    async createOrder(user_id : number,createOrderDTO : CreateOrderDTO, user_name : string , user_email : string , user_phone : string , birthday : string) : Promise<Order>{
        let result = await this.orderRepository.query('CALL sp_create_order(?,?,?,?,?,?,@status,@message); SELECT @status AS status, @message AS message',
        [
            user_id,
            createOrderDTO.address,
            user_name,
            user_email,
            user_phone,
            birthday
        ]);
        ExceptionStoreProcedure.validate(result);

        let data : Order = new StoreProcedureResult<Order>().getResultDetail(result)
        return data;
    }


    async getListOrder( user_id : number , status : number , pagination : Pagination) :  Promise<StoreProcedureResultInterface<Order>>{
        let result = await this.orderRepository.query('CALL sp_get_list_order(?,?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            user_id,
            status,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterface<Order> = new StoreProcedureResult<Order>().getResultPagination(result)
        return data;
    }

    async getListOrderForAdmin( status : number , pagination : Pagination) :  Promise<StoreProcedureResultInterface<Order>>{
        let result = await this.orderRepository.query('CALL sp_get_list_order_for_admin(?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            status,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterface<Order> = new StoreProcedureResult<Order>().getResultPagination(result)
        return data;
    }

    async getListOrderDetail(order_id : number , pagination : Pagination) : Promise<StoreProcedureResultInterface<OrderDetailDataModel>>{
        let result = await this.orderRepository.query('CALL sp_get_list_order_detail(?,?,?,@status,@message,@totalRecord); SELECT @status AS status, @message AS message, @totalRecord AS total_record',
        [
            order_id,
            pagination.getLimit(),
            pagination.getOffset()
        ]);
        ExceptionStoreProcedure.validate(result);
        let data: StoreProcedureResultInterface<OrderDetailDataModel> = new StoreProcedureResult<OrderDetailDataModel>().getResultPagination(result)
        return data;
    }

    async confirmPaymentOrder(order_id : number) : Promise<Order>{
        let result = await this.orderRepository.query('CALL sp_comfim_payment(?,@status,@message); SELECT @status AS status, @message AS message',
        [
            order_id
        ]);
        ExceptionStoreProcedure.validate(result);

        let data : Order = new StoreProcedureResult<Order>().getResultDetail(result)
        return data;
    }

    async cancelPaymentOrder(order_id : number) : Promise<Order>{
        let result = await this.orderRepository.query('CALL sp_update_order_cancel_payment(?,@status,@message); SELECT @status AS status, @message AS message',
        [
            order_id
        ]);
        ExceptionStoreProcedure.validate(result);

        let data : Order = new StoreProcedureResult<Order>().getResultDetail(result)
        return data;
    }

    async getRpOrderTotalAmount(from_date : string ,  to_date : string) : Promise<OrderReportTotalAmountModel>{
        let result = await this.orderRepository.query('CALL sp_get_rp_order_total_amount(?,?,@status,@message); SELECT @status AS status, @message AS message',
        [
            from_date,
            to_date
        ]);
        ExceptionStoreProcedure.validate(result);
        let data : OrderReportTotalAmountModel = new StoreProcedureResult<OrderReportTotalAmountModel>().getResultDetail(result)
        return data;
    }

    async getRpOrderTotalRevenue(from_date : string ,  to_date : string) : Promise<OrderReportTotalRevenueModel>{
        let result = await this.orderRepository.query('CALL sp_get_rp_total_revenue(?,?,@status,@message); SELECT @status AS status, @message AS message',
        [
            from_date,
            to_date
        ]);
        ExceptionStoreProcedure.validate(result);
        let data : OrderReportTotalRevenueModel = new StoreProcedureResult<OrderReportTotalRevenueModel>().getResultDetail(result)
        return data;
    }

    async findOneById(id: number): Promise<Order> {
        return await this.orderRepository.findOneBy({ id});
      }

    async update(order: Order): Promise<Order> {
        return await this.orderRepository.save(order);
    }
}
