import { apiClient } from "@/lib/api/client";
import { Transaction, TransactionRequest } from "./types";
import { ApiResponse } from "@/lib/api/type";
import { API_ENDPOINT } from "@/lib/api/endpoints";


export async function createTransaction(payload: TransactionRequest){
  const res = await apiClient.post<ApiResponse<void>>(
    API_ENDPOINT.transactions.create,
    payload
  );
  return res.data;

}

export async function getTransactionsByAccount(
  accountNumber:string,
  page = 0,
  size = 50
){
  const res = await apiClient.get<ApiResponse<Transaction[]>>(
    API_ENDPOINT.transactions.byAccountNumber(accountNumber),
    {
      params:{ page, size },
    }
  );
  return res.data;
}