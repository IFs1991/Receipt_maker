// backend/app/modules/users/users.types.ts

/**
 * Represents the structure for patient information.
 */
export interface PatientInfoInput {
  name?: string | null;
  dateOfBirth?: string | null; // ISO 8601 date string (e.g., "YYYY-MM-DD")
  gender?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  insuranceCardNumber?: string | null;
  insuranceProvider?: string | null;
  policyNumber?: string | null;
  injuryCause?: string | null; // 傷病原因
  // Add any other relevant patient fields
}

/**
 * Input type for updating a user's injury cause.
 */
export interface UpdateInjuryCauseInput {
  injuryCause: string;
}

/**
 * Input type for updating a user's profile, including their patient information.
 * This corresponds to the frontend's PatientInfoFormState.
 */
export interface UpdateUserProfileInput {
  email?: string | null;
  username?: string | null;
  displayName?: string | null;
  // other user-specific fields that can be updated
  patient?: PatientInfoInput | null; // Optional: Patient info can be updated or created
}

/**
 * Represents the user data returned by the API, potentially including patient info.
 * This should align with Prisma's User model structure, including relations.
 */
export interface UserResponse {
  id: string;
  firebaseUid: string;
  email: string | null;
  username: string | null;
  createdAt: Date;
  updatedAt: Date;
  patient?: PatientInfoOutput | null; // Assuming PatientInfoOutput is similar or identical to PatientInfoInput for response
}

/**
 * Represents the structure for patient information in API responses.
 */
export interface PatientInfoOutput {
  id: string;
  userId: string;
  name: string | null;
  dateOfBirth: Date | null; // Prisma returns Date objects
  gender: string | null;
  address: string | null;
  phoneNumber: string | null;
  insuranceCardNumber: string | null;
  insuranceProvider: string | null;
  policyNumber?: string | null;
  injuryCause?: string | null; // 傷病原因
  createdAt: Date;
  updatedAt: Date;
  // Add any other relevant patient fields
}

/**
 * Input type for updating a user's injury cause.
 */
export interface UpdateInjuryCauseInput {
  injuryCause: string;
}