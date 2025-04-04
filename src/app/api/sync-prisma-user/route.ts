// app/api/sync-prisma-user/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { userId } = await req.json();

  try {
    // Get user from Prisma
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Convert numeric ID to string for Firebase compatibility
    const firebaseUserId = userId.toString();

    // Create/update Firestore document
    await adminDb.collection('prismaUsers').doc(firebaseUserId).set({
      email: user.email,
      profile: user.profile ? {
        department: user.profile.department,
        skills: user.profile.skills
      } : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, { merge: true });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}