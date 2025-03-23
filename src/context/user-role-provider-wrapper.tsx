"use client";

import { UserRoleInitializer, UserRoleProvider } from "./user-role-context";

interface UserRoleProviderWrapperProps {
  children: React.ReactNode;
  userRole: string;
}

const UserRoleProviderWrapper: React.FC<UserRoleProviderWrapperProps> = ({
  children,
  userRole,
}) => {
  return (
    <UserRoleProvider>
      <UserRoleInitializer userRole={userRole} />
      {children}
    </UserRoleProvider>
  );
};

export default UserRoleProviderWrapper;
