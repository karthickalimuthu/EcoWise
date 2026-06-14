/**
 * @module repositories/user.repository
 * @description Data access layer for User model.
 * All database operations for user management.
 */

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { RegisterInput, UserProfile } from "@/domain/types/user.types";
import { ConflictError, NotFoundError } from "@/lib/errors";

const BCRYPT_ROUNDS = 12;

/**
 * Create a new user with hashed password.
 */
export async function createUser(input: RegisterInput): Promise<UserProfile> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new ConflictError("A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
      profileType: input.profileType,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profileType: true,
      createdAt: true,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserProfile["role"],
    profileType: user.profileType as UserProfile["profileType"],
    createdAt: user.createdAt,
  };
}

/**
 * Find a user by ID.
 */
export async function findUserById(id: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profileType: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User", id);
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserProfile["role"],
    profileType: user.profileType as UserProfile["profileType"],
    createdAt: user.createdAt,
  };
}

/**
 * Find a user by email.
 */
export async function findUserByEmail(email: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profileType: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserProfile["role"],
    profileType: user.profileType as UserProfile["profileType"],
    createdAt: user.createdAt,
  };
}
