import { apiClient } from "@/lib/api/client";
import { API_ENDPOINT } from "@/lib/api/endpoints";
import { ApiResponse } from "@/lib/api/type";
import { Role } from "./types";


export async function getRoles(){
  const res = await apiClient.get<ApiResponse<Role[]>>(
    API_ENDPOINT.roles.list
  );
  return res.data;
}

export async function createRole(payload: Omit<Role, "id">){
  const res = await apiClient.post<ApiResponse<Role>>(
    API_ENDPOINT.roles.create,
    payload
  );
  return res.data;
}

export async function updateRole(payload:Role){
  const res = await apiClient.put<ApiResponse<Role>>(
    API_ENDPOINT.roles.update,
    payload
  );
  return res.data;
}
export async function deleteRole(id:number){
  const res = await apiClient.delete<ApiResponse<void>>(
    API_ENDPOINT.roles.delete(id)
  );
  return res.data;
}