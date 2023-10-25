import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorController } from './color.controller';
import { Color } from './color.entity/color.entity';
import { ColorService } from './color.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Color]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
      secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
      })
  ],
  providers: [ColorService],
  controllers: [ColorController],
  exports : [ColorService]
})
export class ColorModule {}
