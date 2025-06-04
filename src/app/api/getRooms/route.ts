import { getDB } from "@/app/lib/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOption";
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
    const roomsCollection = await db.collection("rooms");

    try {
        const user = await userLocalCollection.findOne({ email: email });
        if (!user || !user.rooms || user.rooms.length === 0) {
            return NextResponse.json({ rooms: [] }, { status: 200 });
        }

        const allRooms = await roomsCollection.find({ roomId: { $in: user.rooms } }).toArray();
        const rooms = allRooms.map((room) => ({
            roomId: room.roomId,
            roomName: room.roomName,
            members: room.members?.length || 0
        }));
        return NextResponse.json({ rooms }, { status: 200 });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}