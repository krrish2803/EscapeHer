export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "user" | "admin";
  isVerified: boolean;
  emergencyPin?: string;
  stealthMode: boolean;
  sentinelKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  address?: string;
  city?: string;
  state?: string;
  bloodGroup?: string;
  medicalConditions?: string;
  allergies?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: User;
  };
  message?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  bloodGroup?: string;
  medicalConditions?: string;
  allergies?: string;
  sentinelKeywords?: string[];
  emergencyPin?: string;
  stealthMode?: boolean;
}
