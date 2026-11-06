export interface User {
  id: number;
  email: string;
  password?: string;  // never returned by API
  username: string;
}