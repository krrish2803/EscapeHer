export interface TrustedContact {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  relationship: ContactRelationship;
  priority: number;
  isVerified: boolean;
  notifyOnEmergency: boolean;
  notifyOnHeartbeatLoss: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactRelationship =
  | "parent"
  | "sibling"
  | "spouse"
  | "friend"
  | "colleague"
  | "neighbor"
  | "guardian"
  | "other";

export interface CreateContactPayload {
  name: string;
  phone: string;
  email?: string;
  relationship: ContactRelationship;
  priority?: number;
  notifyOnEmergency?: boolean;
  notifyOnHeartbeatLoss?: boolean;
}

export interface UpdateContactPayload extends Partial<CreateContactPayload> {
  isVerified?: boolean;
}
