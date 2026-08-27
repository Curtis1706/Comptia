"use client";

import React from "react";
import { Module, Permission, meetsLevel } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";

export interface PermissionGateProps {
  module: Module;
  level?: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Composant de garde visuel conditionnant l'affichage d'un élément selon le niveau RBAC de l'utilisateur.
 */
export function PermissionGate({
  module,
  level = "read",
  children,
  fallback = null,
}: PermissionGateProps) {
  const { getModulePermission, isLoading } = usePermissions();

  if (isLoading) {
    return <>{fallback}</>;
  }

  const actualLevel = getModulePermission(module);
  const isAllowed = meetsLevel(actualLevel, level);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
