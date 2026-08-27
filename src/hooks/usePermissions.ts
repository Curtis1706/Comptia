"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Module,
  Permission,
  PermissionMatrix,
  DEFAULT_PERMISSIONS,
  meetsLevel,
  getAccessibleModules,
  UserRole,
} from "@/lib/permissions";

interface PermissionsResponse {
  matrix: PermissionMatrix;
  defaults: PermissionMatrix;
  overrides: any[];
  userRole: UserRole;
}

export function usePermissions() {
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role as UserRole | undefined;

  const { data, isLoading } = useQuery<PermissionsResponse>({
    queryKey: ["permissions", session?.user?.email],
    queryFn: async () => {
      const res = await fetch("/api/permissions");
      if (!res.ok) {
        throw new Error("Impossible de charger les permissions");
      }
      const json = await res.json();
      return json.data || json;
    },
    enabled: !!session?.user,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  const matrix = data?.matrix || (userRole ? DEFAULT_PERMISSIONS : null);
  const role: UserRole = data?.userRole || userRole || "viewer";

  const getModulePermission = (mod: Module): Permission => {
    if (isLoading || !matrix) return "none";
    return matrix[role]?.[mod] || "none";
  };

  const hasAccess = (mod: Module): boolean => {
    return getModulePermission(mod) !== "none";
  };

  const canRead = (mod: Module): boolean => {
    return meetsLevel(getModulePermission(mod), "read");
  };

  const canWrite = (mod: Module): boolean => {
    return meetsLevel(getModulePermission(mod), "write");
  };

  const canValidate = (mod: Module): boolean => {
    return meetsLevel(getModulePermission(mod), "validate");
  };

  const canDelete = (mod: Module): boolean => {
    return meetsLevel(getModulePermission(mod), "full");
  };

  const accessibleModules = matrix ? getAccessibleModules(matrix, role) : [];
  const isOwner = role === "owner";

  return {
    role,
    matrix,
    isLoading: status === "loading" || (isLoading && !matrix),
    isOwner,
    hasAccess,
    canRead,
    canWrite,
    canValidate,
    canDelete,
    getModulePermission,
    accessibleModules,
  };
}
