import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSession } from "@/lib/localAuth";

export type UserRole = "student" | "faculty" | "admin";

export type UserContextType = {
  id: string;
  email: string;
  full_name?: string;
  student_id?: string;
  role: UserRole;
} | null;

const Ctx = createContext<UserContextType>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserContextType>(null);

  useEffect(() => {
    const s = getSession();
    if (s) setUser({ id: s.id, email: s.email, full_name: s.full_name, student_id: s.student_id, role: (s.role as UserRole) || "student" });

    const handler = () => {
      const s2 = getSession();
      if (s2) setUser({ id: s2.id, email: s2.email, full_name: s2.full_name, student_id: s2.student_id, role: (s2.role as UserRole) || "student" });
      else setUser(null);
    };
    window.addEventListener("cc-auth-change", handler);
    return () => window.removeEventListener("cc-auth-change", handler);
  }, []);

  const value = useMemo(() => user, [user]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useUser = () => useContext(Ctx);
