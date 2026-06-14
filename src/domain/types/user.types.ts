/**
 * @module domain/types/user
 * @description User-related type definitions and enums.
 */

export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ProfileType = {
  STUDENT: "STUDENT",
  PROFESSIONAL: "PROFESSIONAL",
  FAMILY: "FAMILY",
  ENTHUSIAST: "ENTHUSIAST",
  GENERAL: "GENERAL",
} as const;

export type ProfileType = (typeof ProfileType)[keyof typeof ProfileType];

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly profileType: ProfileType;
  readonly createdAt: Date;
}

export interface RegisterInput {
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly profileType: ProfileType;
}

export interface LoginInput {
  readonly email: string;
  readonly password: string;
}
