import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/orders.entity/orders.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>
    ){ }
}
