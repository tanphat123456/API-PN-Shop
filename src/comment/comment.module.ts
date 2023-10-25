import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailModule } from 'src/order-detail/order-detail.module';
import { UsersModule } from 'src/users/users.module';
import { CommentController } from './comment.controller';
import { Comments } from './comment.entity/conmment.entity';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comments]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
  }),
    CommentModule , UsersModule , OrderDetailModule
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports : [CommentService]
})
export class CommentModule {}

