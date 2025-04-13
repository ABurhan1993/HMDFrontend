import { useMemo } from "react";

export interface UserInfo {
  userId: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  role: string;
  branchId: string;
  userImageUrl?: string;
  isNotificationEnabled: boolean;
  permissions: string[];
}

export function getUserFromToken(): UserInfo | null {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        userId: payload.sub || payload["nameid"],
        fullName: payload.Name,
        firstName: payload.FirstName,
        lastName: payload.LastName,
        email: payload.email,
        phone: payload.Phone,
        role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role,
        branchId: payload.BranchId,
        userImageUrl: payload.UserImageUrl || "",
        isNotificationEnabled: payload.IsNotificationEnabled === "true",
        permissions: Array.isArray(payload.Permission)
          ? payload.Permission
          : [payload.Permission].filter(Boolean),
      };
    } catch (error) {
      console.error("Failed to parse token:", error);
      return null;
    }
  }
  

export function isAdmin(): boolean {
  const user = getUserFromToken();
  return user?.role?.toLowerCase() === "admin";
}

export function hasPermission(permission: string): boolean {
  const user = getUserFromToken();
  return user?.permissions.includes(permission) || false;
}

// ✅ الآن نعمل لها export صريح
export function useUser(): UserInfo | null {
  const user = useMemo(() => getUserFromToken(), []);
  return user;
}
