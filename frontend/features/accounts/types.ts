import { Transaction } from "../transaction/types";

export type AccountStatus = "ACTIVE" | "SUSPENDED" | "CLOSED";

export type AccountType = "SAVINGS" | "CURRENT";

export type Currency = "USD" | "JPY";

export interface Account{
  id:number;
  accountNumber:string;
  balance:number;
  accountType:AccountType;
  status:AccountStatus;
  currency:Currency;
  transactions?:Transaction[];
  closedAt?:string;
  createdAt:string;
  updatedAt:string;
}
