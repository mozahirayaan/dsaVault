import { getDB } from "@/app/lib/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
    const db = await getDB();
    const session = await getServerSession(authOptions);


    
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    if (!email) {
        return NextResponse.json({ error: "Email not found in session" }, { status: 400 });
    }


    const url = new URL(request.url);
    const roomId = url.pathname.split('/').pop();

    const roomsCollection = db.collection("rooms");

    const {reply,queryId} = await request.json();

    try {
        // Update the room with the new query
        await roomsCollection.updateOne(
            { roomId },
            {
                $push: { "queries.$[query].replies": reply }
            },
            {
                arrayFilters: [
                    { "query.queryId": queryId } // Match query with this queryId inside queries[]
                ]
            }
        );


        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error adding query:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}