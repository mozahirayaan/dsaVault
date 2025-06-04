import { getDB } from "@/app/lib/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDB();
    const usersLocalCollection = db.collection("userslocal");

    const { slug,notes } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    await usersLocalCollection.updateOne(
  { email: session.user.email, "questions.slug": slug },
  { $set: { "questions.$.notes": notes } }
);


    

    return NextResponse.json({ message: "Note updated successfully" });

  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}