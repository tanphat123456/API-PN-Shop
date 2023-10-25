
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './cart.entity/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
  }),
    CartModule
  ],
  providers: [CartService],
  controllers: [CartController],
  exports : [CartService]
})
export class CartModule {}
