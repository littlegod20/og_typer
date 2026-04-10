import type { User as AppUser } from "../entities/user.entity";

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}

export {};
