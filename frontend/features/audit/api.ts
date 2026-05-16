import { apiClient } from "@/lib/api/client";
import { API_ENDPOINT } from "@/lib/api/endpoints";
import { AuditTotals } from "./types";
import { User } from "../users/types";
import { Transaction } from "../transaction/types";

export async function getAuditTotals() {
  const res = await apiClient.get<AuditTotals>(
    API_ENDPOINT.audit.totals
  );
  return res.data;
}

export async function getUserByEmail(email: string) {
  const res = await apiClient.get<User>(
    API_ENDPOINT.audit.userByEmail,
    {
      params: { email },
    }
  );
  return res.data;
}
export async function findTransactionByAccount(accountNumber: string) {
  const res = await apiClient.get<Transaction[]>(
    API_ENDPOINT.audit.transactionsByAccount,
    {
      params: { accountNumber },
    }
  );
  return res.data;
}


export async function findTransactionById(id: number) {
  const response = await apiClient.get<Transaction>(
    API_ENDPOINT.audit.transactionById,
    {
      params: { id },
    }
  );

  return response.data;
}
