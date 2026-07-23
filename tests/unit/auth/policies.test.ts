import { describe, it, expect } from "vitest";
import { canManageUsers, canManageSettings, canManageReports } from "@/lib/auth/policies";
import { ROLES } from "@/lib/auth/roles";

describe("Authorization Policies", () => {
  describe("canManageUsers", () => {
    it("allows ADMIN users only", () => {
      expect(canManageUsers(ROLES.ADMIN)).toBe(true);
      expect(canManageUsers(ROLES.FRONT_ADMIN)).toBe(false);
    });
  });

  describe("canManageSettings", () => {
    it("allows ADMIN users only", () => {
      expect(canManageSettings(ROLES.ADMIN)).toBe(true);
      expect(canManageSettings(ROLES.FRONT_ADMIN)).toBe(false);
    });
  });

  describe("canManageReports", () => {
    it("allows both ADMIN and FRONT_ADMIN users", () => {
      expect(canManageReports(ROLES.ADMIN)).toBe(true);
      expect(canManageReports(ROLES.FRONT_ADMIN)).toBe(true);
    });
  });
});
