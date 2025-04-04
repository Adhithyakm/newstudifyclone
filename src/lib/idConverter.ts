// Convert Neon ID (number) → Firebase ID (string)
export const toFirebaseId = (neonId: number): string => {
  if (!Number.isInteger(neonId)) {
    throw new Error('Invalid Neon ID: must be an integer');
  }
  return neonId.toString();
};

// Convert Firebase ID (string) → Neon ID (number)
export const toNeonId = (firebaseId: string): number => {
  const id = parseInt(firebaseId, 10);
  if (isNaN(id)) {
    throw new Error('Invalid Firebase ID: not a numeric string');
  }
  return id;
};