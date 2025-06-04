import { getDB } from "@/app/lib/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";
import { Timestamp } from "mongodb";


async function fetchCodeforcesContestActivity(membersDetails: any, userActivity: any[]) {
    const promises = membersDetails.map(async (member: any) => {
        try{
            const response= await axios.get(`https://codeforces.com/api/user.rating?handle=${member.codeforces}`);
            if (response.data.status !== "OK") {
                console.error(`Error fetching Codeforces data for ${member.codeforces}: ${response.data.comment}`);
                return;
            }

            const recentSubmissions = response.data.result;
            if (!recentSubmissions || recentSubmissions.length === 0) {
                console.warn(`No recent submissions found for ${member.codeforces}`);
                return;
            }

            userActivity.push(
                ...recentSubmissions
                    .map((submission: any) => ({
                        type: "contest",
                        title: submission.contestName,
                        titleSlug: submission.contestId,
                        ranking: submission.rank,
                        rating: submission.newRating,
                        totalProblems: 5,
                        problemsSolved: 4,
                        timestamp: submission.ratingUpdateTimeSeconds,
                        member: member.name,
                        action: "appeared",
                        platform: "Codeforces"
                    }))
            );

            

        }
        catch (error) {
            console.error(`Failed to fetch Codeforces contest for ${member.codeforces}`, error);
        }
    })

    await Promise.all(promises);

    
}



async function fetchCodeforcesSubmissionActivity(membersDetails: any, userActivity: any[]) {
    const promises = membersDetails.map(async (member: any) => {
        try{
            const response= await axios.get(`https://codeforces.com/api/user.status?handle=${member.codeforces}&from=1&count=10`);
            if (response.data.status !== "OK") {
                console.error(`Error fetching Codeforces data for ${member.codeforces}: ${response.data.comment}`);
                return;
            }

            const recentSubmissions = response.data.result;
            if (!recentSubmissions || recentSubmissions.length === 0) {
                console.warn(`No recent submissions found for ${member.codeforces}`);
                return;
            }

            userActivity.push(
                ...recentSubmissions
                    .filter((submission: any) => submission.verdict === "OK")
                    .map((submission: any) => ({
                        type: "submission",
                        title: submission.problem.name,
                        timestamp: submission.creationTimeSeconds,
                        titleSlug: `${submission.problem.contestId}/problem/${submission.problem.index}`,
                        member: member.name,
                        action: "solved",
                        platform: "Codeforces"
                    }))
            );

            

        }
        catch (error) {
            console.error(`Failed to fetch Codeforces contest for ${member.codeforces}`, error);
        }
    })

    await Promise.all(promises);

    
}


async function fetchContestActivity(membersDetails: any, userActivity: any[]) {



    const promises = membersDetails.map(async (member: any) => {
        try {
            const response = await axios.post(
                'https://leetcode.com/graphql',
                {
                    query: `
      query userContestRankingInfo($username: String!) {
        userContestRankingHistory(username: $username) {
          attended
          problemsSolved
          totalProblems
          rating
          ranking
          contest {
            title
            startTime
          }
        }
      }
    `,
                    variables: { username: member.leetcode },
                }
            );

            const recentSubmissions = response.data.data.userContestRankingHistory;
            userActivity.push(
                ...recentSubmissions
                    .filter((submission: any) => submission.attended === true)
                    .map((submission: any) => ({
                        type: "contest",
                        title: submission.contest.title,
                        totalProblems: submission.totalProblems,
                        problemsSolved: submission.problemsSolved,
                        rating: submission.rating,
                        ranking: submission.ranking,
                        timestamp: submission.contest.startTime,
                        member: member.name,
                        action: "appeared",
                        platform: "Leetcode"
                    }))
            );

        } catch (error) {
            console.error(`Failed to fetch contest for ${member.leetcode}`, error);
        }
    });

    await Promise.all(promises);
}


async function fetchSubmissionActivity(memberDetails: any, userActivity: any[]) {


    const promises = memberDetails.map(async (member: any) => {
        try {
            const response = await axios.post(
                'https://leetcode.com/graphql',
                {
                    query: `
            query recentAcSubmissions($username: String!, $limit: Int!) {
              recentAcSubmissionList(username: $username, limit: $limit) {
                title
                titleSlug
                timestamp
              }
            }
          `,
                    variables: { username: member.leetcode, limit: 5 },
                }
            );
            const recentSubmissions = response.data.data.recentAcSubmissionList;
            userActivity.push(
                ...recentSubmissions.map((submission: any) => ({
                    type: "submission",
                    title: submission.title,
                    titleSlug: submission.titleSlug,
                    timestamp: submission.timestamp,
                    member: member.name,
                    action: "solved",
                    platform: "Leetcode",
                }))
            );

        } catch (error) {
            console.error(`Failed to fetch submissions for ${member.leetcode}`, error);
        }
    });

    await Promise.all(promises);
}



export async function GET(request: Request) {
    const url = new URL(request.url);
    const roomId = url.pathname.split('/').pop();
    const db = await getDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    if (!email) {
        return NextResponse.json({ error: "Email not found in session" }, { status: 400 });
    }
    if (!roomId) {
        return NextResponse.json({ error: "Room ID is required" }, { status: 400 });
    }




    const userLocalCollection = await db.collection("userslocal");
    const roomsCollection = await db.collection("rooms");


    try {
        const room = await roomsCollection.findOne({ roomId: roomId });
        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        const userActivity: any = [];

        const memberDetails = await db.collection("userslocal").find({
            email: { $in: room.members }
        }).toArray();

        await fetchSubmissionActivity(memberDetails, userActivity);
        await fetchContestActivity(memberDetails, userActivity);
        await fetchCodeforcesContestActivity(memberDetails, userActivity);
        await fetchCodeforcesSubmissionActivity(memberDetails, userActivity);



        userActivity.sort((a: any, b: any) => Number(b.timestamp) - Number(a.timestamp));


        return NextResponse.json({ memberDetails, userActivity,room }, { status: 200 });
    } catch (error) {
        console.error("Error fetching room details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}