import { getDB } from "@/app/lib/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session|| !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username,platform } = await request.json();
    if (!username || typeof username !== "string") {
        return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    

    try {

        if(platform=== "leetcode") {
        const response=await axios.post("https://leetcode.com/graphql", {
        query: `
            query userProfilePublicProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                }
            }
        `,
        variables: { username: username },
    });

    if(!response.data.data || !response.data.data.matchedUser|| response.data.data.matchedUser.username !== username) {
        return NextResponse.json({ error: "Invalid LeetCode username" }, { status: 400 });
       }
    }

    if(platform=== "codeforces") {
        const response=await axios.get(`https://codeforces.com/api/user.info?handles=${username}&checkHistoricHandles=false`);

    if(response.data.status=="FAILED") {
        return NextResponse.json({ error: "Invalid codeforces username" }, { status: 400 });}
    }

    const db = await getDB();
    const userLocalCollection = db.collection("userslocal");
        await userLocalCollection.updateOne(
            { email: session.user.email },
            { $set: { [platform]: username } },
        );
        return NextResponse.json({ message: "Username saved successfully" });
    } catch (error) {
        console.error("Error saving username:", error);
        return NextResponse.json({ error: "Failed to save username" }, { status: 500 });
    }
}