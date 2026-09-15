import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { db } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const token = authHeader.substring(7).trim();

  try {
    await getAuth().verifyIdToken(token);
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const counterRef = db.collection("systemCounters").doc("listings");

    const listingId = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      const currentNumber =
        counterDoc.exists && typeof counterDoc.data()?.lastNumber === "number"
          ? counterDoc.data()!.lastNumber
          : 10000;

      const nextNumber = currentNumber + 1;

      if (nextNumber > 99999) {
        throw new Error("Listing number limit reached");
      }

      transaction.set(
        counterRef,
        {
          lastNumber: nextNumber,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      return `SBM-${String(nextNumber).padStart(5, "0")}`;
    });

    return NextResponse.json({
      success: true,
      listingId,
    });
  } catch (error) {
    console.error("Error generating listing ID:", error);

    return NextResponse.json(
      { success: false, error: "Could not generate listing ID" },
      { status: 500 },
    );
  }
}
