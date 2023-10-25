import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admin/admin.entity/admin.entity';
import { AdminModule } from 'src/admin/admin.module';
import { AdminService } from 'src/admin/admin.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { SupplierController } from './supplier.controller';
import { Supplier } from './supplier.entity/supplier.entity';
import { SupplierService } from './supplier.service';


@Module({
  imports: [TypeOrmModule.forFeature([Supplier]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
  }),
    SupplierModule , UsersModule , AdminModule , AuthModule
  ],
  providers: [SupplierService ,UsersModule , AdminModule],
  controllers: [SupplierController],
  exports : [SupplierService]
})
export class SupplierModule {}