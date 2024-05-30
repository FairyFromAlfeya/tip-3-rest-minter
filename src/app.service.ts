import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  Address,
  ProviderRpcClient,
  Transaction,
} from 'everscale-inpage-provider';
import { Account } from 'everscale-standalone-client';
import { BigNumber } from 'bignumber.js';

import { tokenRootAbi } from './configs/token-root.abi';
import { getEverWallet, rpcClientConfig } from './configs/rpc-client.config';

const toNano = (amount: number | string): string =>
  new BigNumber(amount).shiftedBy(9).toFixed(0);

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger('AppService');

  private readonly client = new ProviderRpcClient(
    rpcClientConfig(
      this.configService.getOrThrow('NETWORK_JRPC_ENDPOINT'),
      this.configService.getOrThrow('TOKEN_OWNER_PHRASE'),
      this.configService.getOrThrow('TOKEN_OWNER_ACCOUNT_ID'),
    ),
  );

  private readonly token = new this.client.Contract(
    tokenRootAbi,
    new Address(this.configService.getOrThrow('TOKEN_ADDRESS')),
  );

  private owner: Account;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.owner = await getEverWallet(
      this.configService.getOrThrow('TOKEN_OWNER_PHRASE'),
      this.configService.getOrThrow('TOKEN_OWNER_ACCOUNT_ID'),
    );
  }

  mint(amount: string, recipient: string): Promise<Transaction> {
    this.logger.log(`Minting ${amount} to ${recipient}`);

    return this.token.methods
      .mint({
        amount: amount,
        recipient: new Address(recipient),
        deployWalletValue: toNano(0.1),
        notify: false,
        payload: '',
        remainingGasTo: this.owner.address,
      })
      .send({ from: this.owner.address, amount: toNano(0.5), bounce: true });
  }
}
