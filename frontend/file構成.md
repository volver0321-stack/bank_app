# Frontend File Structure Plan

## Backend Overview

Backend は機能ごとに package が分かれている。

```txt
auth_users      /api/auth, /api/users
account         /api/accounts
transactions    /api/transactions
role            /api/roles
audit_dashboard /api/audit
notification    frontend 用 API は現状なし
```

Frontend も backend の機能境界に寄せて、feature 単位で分ける。

## Proposed Structure

```txt
frontend/
  app/
    page.tsx
    login/page.tsx
    register/page.tsx
    dashboard/page.tsx
    accounts/page.tsx
    accounts/[accountNumber]/transactions/page.tsx
    transfer/page.tsx
    admin/
      users/page.tsx
      roles/page.tsx
      audit/page.tsx

  features/
    auth/
      api.ts
      types.ts
      components/
    users/
      api.ts
      types.ts
      components/
    accounts/
      api.ts
      types.ts
      components/
    transactions/
      api.ts
      types.ts
      components/
    roles/
      api.ts
      types.ts
      components/
    audit/
      api.ts
      types.ts
      components/

  lib/
    api/
      client.ts
      endpoints.ts
      types.ts
    auth/
      token.ts
    utils.ts

  components/
    layout/
    ui/
```

## API Layer

`frontend/lib/apiEndpoint.ts` に全 endpoint をまとめるより、共通処理と feature API を分ける。

```txt
lib/api/client.ts       fetch 共通処理、Authorization header、Response<T> unwrap
lib/api/endpoints.ts    URL 定数
lib/api/types.ts        backend 共通 Response<T>, PageMeta
```

## Feature API Files

```txt
features/auth/api.ts
  login()
  register()
  forgotPassword()
  resetPassword()

features/users/api.ts
  getMe()
  getUsers()
  updatePassword()
  uploadProfilePicture()

features/accounts/api.ts
  getMyAccounts()
  closeAccount()

features/transactions/api.ts
  createTransaction()
  getTransactionsByAccount()

features/roles/api.ts
  getRoles()
  createRole()
  updateRole()
  deleteRole()

features/audit/api.ts
  getSystemTotals()
  findUserByEmail()
  findAccountByNumber()
  findTransactionsByAccount()
  findTransactionById()
```

## Types

Backend DTO に対応する型を feature ごとに置く。

```txt
features/auth/types.ts
  LoginRequest
  LoginResponse
  RegistrationRequest
  ResetPasswordRequest

features/accounts/types.ts
  Account
  AccountStatus
  AccountType
  Currency

features/transactions/types.ts
  Transaction
  TransactionRequest
  TransactionType
  TransactionStatus
```

## First Step

まず UI は触らずに API 基盤と型だけ作る。

```txt
1. lib/api/client.ts
2. lib/api/endpoints.ts
3. lib/api/types.ts
4. features/*/types.ts
5. features/*/api.ts
```
