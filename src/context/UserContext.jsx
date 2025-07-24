import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

// Provider function
export function UserProvider({ children }) {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("student");
  const [sidebaritem, setSidebaritem] = useState("")
  // const [user, setUser] = useState({
  //   rollNo: '',
  //   password: ''
  // });

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedRole = sessionStorage.getItem("role");

    if (storedUserId) setUserId(storedUserId);
    if (storedRole) setRole(storedRole);

  }, []);

  return (
    <UserContext.Provider value={{ userId, role, sidebaritem, setUserId, setRole, setSidebaritem }}>
      {children}
    </UserContext.Provider>
  );
}
