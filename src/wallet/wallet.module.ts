import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { Wallet } from './wallet.entity/wallet.entity';
import { WalletService } from './wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: "1235sd-5656sdf-@dfkdf-sdsjfdj",
  }),
    WalletModule
  ],
  controllers: [WalletController],
  providers: [WalletService]
})
export class WalletModule {}
