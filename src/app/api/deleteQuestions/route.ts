import { getDB } from "@/app/lib/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const db = await getDB();
        const usersLocalCollection = db.collection("userslocal");
    
        const user = await usersLocalCollection.findOne({ email: session.user.email });
    
        if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
    
        const { slug } = await req.json();
    
        if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }
    
        await usersLocalCollection.updateOne(
  { email: session.user.email },
  { $pull: { questions: { slug } } } as any
);

    
        return NextResponse.json({ message: "Question deleted successfully" });
    
    } catch (error) {
        console.error("Error deleting question:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}