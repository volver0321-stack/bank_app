import { apiClient } from "@/lib/api/client";
import { API_ENDPOINT } from "@/lib/api/endpoints";
import { ApiResponse, SpringPage } from "@/lib/api/type";
import { UpdatePasswordRequest, User } from "./types";
import { Form } from "radix-ui";


export async function getMe(){
  const res = await apiClient.get<ApiResponse<User>>(
    API_ENDPOINT.user.me
  );
  return res.data;
}

export async function getUsers(page = 0,size =50){
  const res = await apiClient.get<ApiResponse<SpringPage<User>>>(
    API_ENDPOINT.user.list,
    {
      params:{ page, size },
    }
  );
  return res.data;
}

export async function updatePassword(payload:UpdatePasswordRequest){
  const res = await apiClient.put<ApiResponse<void>>(
    API_ENDPOINT.user.updatePassword,
    payload 
  );
  return res.data;
}

export async function uploadProfilePicture(file:File){
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.put<ApiResponse<void>>(
    API_ENDPOINT.user.profilePicture,
    formData,
    {
      headers:{
        "Content-Type": "multipart/form-data",
      }
    }
  );
  return res.data;
}