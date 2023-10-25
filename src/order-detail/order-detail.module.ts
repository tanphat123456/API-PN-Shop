import { Module } from '@nestjs/common';
import { OrderDetailController } from './order-detail.controller';
import { OrderDetailService } from './order-detail.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { OrderDetail } from 'src/orders/orders.entity/oders.detail.entity';


@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
  }),
  OrderDetailModule , UsersModule
  ],
  providers: [OrderDetailService],
  controllers: [OrderDetailController],
  exports : [OrderDetailService]
})
export class OrderDetailModule {}
