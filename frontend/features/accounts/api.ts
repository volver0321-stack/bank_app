import { apiClient } from "@/lib/api/client";
import { API_ENDPOINT } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/type";
import { Account } from "./types";


export async function getMyAccounts(){
  const res = await apiClient.get<ApiResponse<Account[]>>(
    API_ENDPOINT.accounts.me
  );
  return res.data;
}

export async function closeAccount(accountNumber:string){
  const res = await apiClient.post<ApiResponse<void>>(
    API_ENDPOINT.accounts.close(accountNumber)
  );
  return res.data;
}