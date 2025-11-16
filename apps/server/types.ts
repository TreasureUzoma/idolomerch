import type { Role } from "./db/services/auth";

export interface AuthType {
  id: string;
  email: string;
  name?: string;
  role: Role;
}
