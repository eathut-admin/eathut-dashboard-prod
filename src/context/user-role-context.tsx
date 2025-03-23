"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserRoleContextType {
  userRole: string;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
}

const userRoleContext = createContext<UserRoleContextType | undefined>(
  undefined
);

export const useUserRole = () => {
  const context = useContext(userRoleContext);
  if (!context) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};

export const UserRoleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userRole, setUserRole] = useState("");
  return (
    <userRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </userRoleContext.Provider>
  );
};

export const UserRoleInitializer = ({ userRole }: { userRole: string }) => {
  const { setUserRole } = useUserRole();

  useEffect(() => {
    setUserRole(userRole);
  }, [userRole, setUserRole]);

  return null;
};
