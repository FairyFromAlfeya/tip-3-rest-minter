import { IsNumberString } from 'class-validator';

import { IsTVMAddress } from './validation/is-tvm-address.validation';

export class CreateMintDto {
  @IsNumberString(
    { no_symbols: true },
    { message: 'amount must be a positive integer string' },
  )
  amount: string;

  @IsTVMAddress()
  recipient: string;
}
