import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Order } from 'src/orders/orders.entity/orders.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductModule } from 'src/product/product.module';
import { CategoryModule } from 'src/category/category.module';



@Module({
  imports: [TypeOrmModule.forFeature([Order]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
  }),
    OrdersModule , UsersModule , ProductModule , CategoryModule
  ],
  providers: [ReportService],
  controllers: [ReportController],
  exports : [ReportService]
})
export class ReportModule {}
