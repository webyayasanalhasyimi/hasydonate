import { prisma } from "@/lib/prisma/client";
import { type Profile } from "@prisma/client";

export const ProfileService = {
  getById(id: string): Promise<Profile | null> {
    return prisma.profile.findUnique({ where: { id } });
  },

  getByEmail(email: string): Promise<Profile | null> {
    return prisma.profile.findUnique({ where: { email } });
  },

  create(data: Omit<Profile, "createdAt" | "updatedAt">): Promise<Profile> {
    return prisma.profile.create({ data });
  },

  update(id: string, data: Partial<Omit<Profile, "id" | "createdAt" | "updatedAt">>): Promise<Profile> {
    return prisma.profile.update({
      where: { id },
      data,
    });
  },
};
export type ProfileServiceType = typeof ProfileService;
