export const API_ENDPOINT = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },

  user: {
    list: "/users",
    me: "users/me",
    updatePassword: "/users/update-password",
    profilePicture: "/users/profile-picture",
  },

  accounts: {
    me: "accounts/me",
    close: (accountNumber: string) => `/accounts/close/${accountNumber}`,
  },

  transactions: {
    create: "/transactions",
    byAccountNumber: (accountNumber: string) =>
      `/transactions/account/${accountNumber}`,
  },

  roles: {
    list: "/roles",
    create: "/roles",
    update: "roles",
    delete: (id: number) => `/roles/${id}`,
  },

  audit: {
    totals: "/audit/totals",
    userByEmail: "/audit/users",
    accountByNumber: "/audit/accounts",
    transactionsByAccount: "/audit/transactions/by-account",
    transactionById: "/audit/transactions/by-id",
  },
}as const;
