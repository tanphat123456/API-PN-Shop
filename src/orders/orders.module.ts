import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from 'src/cart/cart.module';
import { UsersModule } from 'src/users/users.module';
import { OrdersController } from './orders.controller';
import { Order } from './orders.entity/orders.entity';
import { OrdersService } from './orders.service';


@Module({
  imports: [TypeOrmModule.forFeature([Order]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
  }),
    OrdersModule , UsersModule , CartModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports : [OrdersService]
})
export class OrdersModule {}

