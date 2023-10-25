import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ProductModule } from './product/product.module';
import { SupplierModule } from './supplier/supplier.module';
import { WalletModule } from './wallet/wallet.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { ColorModule } from './color/color.module';
import { SizeModule } from './size/size.module';
import { CategoryModule } from './category/category.module';
import { ImageModule } from './image/image.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { OrderDetailModule } from './order-detail/order-detail.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        envFilePath: '.env',
        isGlobal: true
      }
    ),
    TypeOrmModule.forRoot(
      {
        "type": 'mysql',
        "host": process.env.DB_HOST,
        "port": parseInt(process.env.DB_PORT),
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "entities": ["dist/**/*.entity{.ts,.js}"],
        "multipleStatements": true,
        "dateStrings": true
      }
    ),
    
    UsersModule,
    AuthModule,
    AdminModule,
    ProductModule,
    SupplierModule,
    WalletModule,
    OrdersModule ,
    CartModule,
    ColorModule,
    SizeModule,
    CategoryModule,
    ImageModule,
    CommentModule,
    ReportModule,
    OrderDetailModule,
  ],
  providers: []
})
export class AppModule {}
