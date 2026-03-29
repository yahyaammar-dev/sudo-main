export const addressKeyFactory = {
  address: (id: string) => ['address', id],
  addresses: (accountId: string) => ['addresses', accountId],
  allAddresses: 'addresses',
} as const;
