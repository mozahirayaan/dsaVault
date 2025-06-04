import { getDB } from "@/app/lib/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    const db = await getDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    if (!email) {
        return NextResponse.json({ error: "Email not found in session" }, { status: 400 });
    }

    const userLocalCollection = await db.collection("userslocal");

    try {
        const userDetails = await userLocalCollection.findOne({ email: email });
        if (!userDetails) {
            return NextResponse.json({ error: "User details not found" }, { status: 404 });
        }

        return NextResponse.json({ userDetails }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}