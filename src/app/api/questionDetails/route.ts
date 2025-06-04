import { getDB } from "@/app/lib/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  // ✅ Proper usage for App Router
  const session = await getServerSession( authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDB();
    const usersLocalCollection = db.collection("userslocal");
    const questionsCollection = db.collection("questions");

    const user = await usersLocalCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const questions = user.questions || [];
    if (!questions.length) {
      return NextResponse.json({ questions: [] });
    }

    const slugs = questions.map((q: any) => q.slug);
    const questionDocs = await questionsCollection.find({ titleSlug: { $in: slugs } }).toArray();

    const detailsMap = new Map(questionDocs.map(doc => [doc.titleSlug, doc]));

    const mergedQuestions = questions.map((q: any) => ({
      ...q,
      details: detailsMap.get(q.slug) || null,
    }));

    console.log("Merged Questions:", mergedQuestions);

    return NextResponse.json({ questions: mergedQuestions });

  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
