import { createContext, useEffect, useState } from "react";
export const RoleContext = createContext();

export function RoleProvider({ children }) {
    const [role, setRole] = useState('');

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) setRole(storedRole);
    }, [role]);

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
}
