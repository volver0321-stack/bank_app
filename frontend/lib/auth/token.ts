const TOKEN_KEY = "token";
const ROLES_KEY = "roles";

export function getToken(){
  if( typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token:string){
  localStorage.setItem(TOKEN_KEY,token);
}

export function removeToken(){
  localStorage.removeItem(TOKEN_KEY);
}

export function getRole(){
  if ( typeof window === 'undefined') return [];
  const roles = localStorage.getItem(ROLES_KEY);
  return roles ? (JSON.parse(roles) as string[]) : [];
}

export function setRole(roles:string[]){
  localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
}

export function clearAuth(){
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLES_KEY);
}