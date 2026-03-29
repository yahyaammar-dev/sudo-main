export const accountKeyFactory = {
  account: 'account',
  login: 'account-login',
  logout: 'account-logout',
  session: 'account-session',
  accountVerification: (accountId: string) => ['account-verification', accountId],
} as const;
