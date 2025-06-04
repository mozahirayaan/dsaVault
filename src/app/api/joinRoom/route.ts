import { getDB } from "@/app/lib/database";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOption";

export async function POST(request: Request) {
  interface UserLocal {
  email: string;
  name: string;
  picture?: string;
  roomsID: string[];
  questions: [];
    friends: [];
    leetcode: string;
    codeforces: string;
    createdAt: Date;
}
  const db = await getDB();
  
    const session = await getServerSession(authOptions);
    if (!session||!session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    if (!email) {
        return NextResponse.json({ error: "Email not found in session" }, { status: 400 });
    }

    const userLocalCollection = await db.collection<UserLocal>("userslocal");
    const roomsCollection = await db.collection("rooms");
    const { roomId } = await request.json();

    const existingUser = await userLocalCollection.findOne({ email: email });
    

    try {
        const existingRoom = await roomsCollection.findOne({ roomId: roomId });
        if (!existingRoom) { return NextResponse.json({ message: "No Room with this Id" }, { status: 201 });}
        await userLocalCollection.updateOne(
            { email: email },
            { $addToSet: { rooms: roomId } },
        );

        await roomsCollection.updateOne(
            { roomId: roomId },
            { $addToSet: { members: email } },
        );

        

        return NextResponse.json({ roomId }, { status: 201 });
    } catch (error) {
        console.error("Error creating room:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  
}