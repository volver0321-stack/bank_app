import { Account } from "../accounts/types";
import { Role } from "../role/types";


export interface User {
  id: number;
  firstName:string;
  lastName?:string;
  phoneNumber?:string;
  email:string;
  profilePictureUrl?:string;
  active:boolean;
  role?:Role[];
  account?:Account[];
  createdAt?:string;
  updatedAt?:string;
}

export interface UpdatePasswordRequest {
  oldPassword:string;
  newPassword:string;
}
