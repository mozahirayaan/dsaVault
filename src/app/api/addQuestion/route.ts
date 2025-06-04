import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { getDB } from "@/app/lib/database";
import axios from "axios";
import { platform } from "os";

const client = new OAuth2Client();

const fetchLeetcodeQuestion = async (problemInfo: any,newQuestion: any) => {
     try{
      const response = await axios.post("https://leetcode.com/graphql", {
        query: `
    query questionTitle($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        titleSlug
        difficulty
        dislikes
      }
    }
  `,
        variables: { titleSlug: problemInfo.slug },
      });


      const tags = await axios.post("https://leetcode.com/graphql", {
        query: `
    query singleQuestionTopicTags($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    topicTags {
      name
      slug
    }
  }
}
  `,
        variables: { titleSlug: problemInfo.slug },
      });


      // Extract the question object from the response data
      const newQuestion = response.data.data.question;
      newQuestion.tags = tags.data.data.question.topicTags.map((tag: any) => tag.name);
      return newQuestion;
     }
     catch (error) {
      console.log(error);
     }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const body = await req.json();

  const { title, category, notes, url, problemInfo } = body;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
  }

  const accessToken = authHeader.slice(7);

  try {
    const tokenInfo = await client.getTokenInfo(accessToken);

    if (!tokenInfo || !tokenInfo.email) {
      return NextResponse.json({ error: "Invalid access token" }, { status: 401 });
    }

    // ✅ Check client ID
    if (tokenInfo.aud !== "952138734571-g9edmf8hgndksbn0ri65vr7ldgm5o5tn.apps.googleusercontent.com") {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 401 });
    }

    // ✅ Get full user profile info
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      return NextResponse.json({ error: "Failed to fetch user info" }, { status: 500 });
    }

    const profile = await profileRes.json();

    const db = await getDB();
    const usersLocalCollection = db.collection("userslocal");

    const existingUser = await usersLocalCollection.findOne({ email: profile.email });

    if (!existingUser) {
      await usersLocalCollection.insertOne({
        email: profile.email,
        name: profile.name,         // ✅ Now `name` is available
        picture: profile.picture,   // Optional
        rooms: [],
        questions: [],
        friends:[],
        createdAt: new Date(),
      });
    }





    const questionsCollection =await db.collection("questions");
    const existingQuestion = await questionsCollection.findOne({ titleSlug: problemInfo.slug });
    let newQuestion={};
    if (!existingQuestion&&problemInfo.platform==='leetcode') {
      newQuestion=await fetchLeetcodeQuestion(problemInfo,newQuestion);
      await questionsCollection.insertOne({...newQuestion});
    }

        // Step 1: Remove any existing question with the same slug
await usersLocalCollection.updateOne(
  { email: profile.email },
  {
    $pull: { questions: { slug: problemInfo.slug } }
  } as any
);

// Step 2: Push the updated/new question
await usersLocalCollection.updateOne(
  { email: profile.email },
  {
    $push: {
      questions: {
        category: category,
        notes: notes,
        slug: problemInfo.slug,
        url: url,

      }
    }
  } as any
);
  
    return NextResponse.json({ notes: "User validated and stored", user: profile.email });
  } catch (error) {
    console.error("Error validating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
