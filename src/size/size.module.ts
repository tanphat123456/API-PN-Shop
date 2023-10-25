import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeController } from './size.controller';
import { Size } from './size.entity/size.entity';
import { SizeService } from './size.service';

@Module({
  imports: [TypeOrmModule.forFeature([Size]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
  }),
  SizeModule
],
providers: [SizeService],
controllers: [SizeController],
exports : [SizeService]
})
export class SizeModule {}
