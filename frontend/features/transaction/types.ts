export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";

export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Transaction {
  id:number;
  amount:number;
  transactionType:TransactionType;
  transactionDate:string;
  description?:string;
  status:TransactionStatus;
  sourceAccount?:string;
  destinationAccount?:string;
}

export interface TransactionRequest{
  transactionType:TransactionType;
  amount:number;
  accountNumber?:string;
  description?:string;
  destinationAccountNumber?:string;
} 
