import {
  EverscaleStandaloneClient,
  SimpleAccountsStorage,
  SimpleKeystore,
  EverWalletAccount,
} from 'everscale-standalone-client/nodejs';
import { ProviderProperties } from 'everscale-inpage-provider';
import { deriveBip39Phrase, KeyPair, makeBip39Path } from 'everscale-crypto';

const keystore = (keypair: KeyPair): SimpleKeystore =>
  new SimpleKeystore({ owner: keypair });

const accountsStorage = async (
  publicKey: string,
): Promise<SimpleAccountsStorage> =>
  new SimpleAccountsStorage({
    entries: [await EverWalletAccount.fromPubkey({ publicKey: publicKey })],
  });

export const getEverWallet = (
  phrase: string,
  accountId: string,
): Promise<EverWalletAccount> =>
  EverWalletAccount.fromPubkey({
    publicKey: deriveBip39Phrase(phrase, makeBip39Path(+accountId)).publicKey,
  });

export const rpcClientConfig = (
  endpoint: string,
  phrase: string,
  accountId: string,
): ProviderProperties => {
  const keypair = deriveBip39Phrase(phrase, makeBip39Path(+accountId));

  return {
    forceUseFallback: true,
    fallback: async () =>
      EverscaleStandaloneClient.create({
        connection: {
          id: 1,
          group: 'mainnet',
          type: 'jrpc',
          data: { endpoint: endpoint },
        },
        keystore: keystore(keypair),
        accountsStorage: await accountsStorage(keypair.publicKey),
      }),
  };
};
