import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from 'src/orders/orders.entity/oders.detail.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderDetailService {
    constructor(
        @InjectRepository(OrderDetail)
        private orderDetailRepository: Repository<OrderDetail>
    ){ }

    async findOneById(id: number): Promise<OrderDetail> {
        return await this.orderDetailRepository.findOneBy({ id});
    }

    async getOrderDetailCountByUserAndProductId(user_id: number, product_id: number): Promise<number> {
        const query = this.orderDetailRepository.createQueryBuilder('order_detail')
          .where('order_detail.user_id = :user_id', { user_id })
          .andWhere('order_detail.product_id = :product_id', { product_id })
          .andWhere('order_detail.status = 1');
        return await query.getCount();
      }
}
