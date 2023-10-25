import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { Images } from './image.entity/image.entity';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Images]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
  }),
    UsersModule, ImageModule
  ],
  controllers: [ImageController],
  providers: [ImageService]
})
export class ImageModule {}
