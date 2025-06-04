"use client";
import React from "react";
import {useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useSession } from "next-auth/react";
import axios from "axios"





export default function Dashboard() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<any[]>([]);
  const [visibleNotesSlug, setVisibleNotesSlug] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
const [editedNote, setEditedNote] = useState<string>("");

const startEditing = (slug: string, currentNote: string) => {
  setEditingSlug(slug);
  setEditedNote(currentNote);
};

const saveNote = (slug: string) => {
  setQuestions((prev) =>
    prev.map((q) => (q.slug === slug ? { ...q, notes: editedNote } : q))
  );
  setEditingSlug(null);

  axios.post("/api/updateNotes", {
    slug,
    notes: editedNote,
  });
};


  const deleteQuestion = async (slug: string) => {
    await axios.delete("/api/deleteQuestions", {
      data: { slug: slug },
    });
    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.slug !== slug)
    );
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/questionDetails');
        setQuestions(response.data.questions || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);
  return (
    <>
      <Navbar />
      <main className="mt-12 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-6 py-10 lg:px-16">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
            📚 My Saved Questions ${session?.user?.name}
          </h1>
          <p className="text-white/70 mt-2">Manage your DSA practice across platforms</p>
        </header>

        {/* Saved Questions Table */}
        <section className="mb-14">
          <div className="overflow-x-auto rounded-xl border border-white/10 backdrop-blur-lg bg-white/5">
            <table className="w-full text-left text-sm">
              <thead className="text-white/80 border-b border-white/10">
                <tr className="text-sm font-medium">
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
  {questions.map((q) => (
    <React.Fragment key={q.slug}>
      <tr
        key={`${q.slug}-row`}
        className={`${
          visibleNotesSlug === q.slug
            ? "border-t border-white/10 bg-white/10"
            : ""
        } hover:bg-white/10 transition`}
      >
        <td className="p-4">
          <a href={q.url} className="text-pink-400 hover:underline">
            {q.details.title}
          </a>
        </td>
        <td className="p-4">{q.category}</td>
        <td className="p-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium 
              ${q.details.difficulty === "Easy" ? "bg-green-500/20 text-green-400" : ""}
              ${q.details.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-300" : ""}
              ${q.details.difficulty === "Hard" ? "bg-red-500/20 text-red-400" : ""}
            `}
          >
            {q.details.difficulty}
          </span>
        </td>
        <td className="p-4">
          {q.details.tags.map((tag: string) => (
            <span
              key={`${q.slug}-${tag}`}
              className="text-xs mr-1 px-2 py-1 rounded-full font-semibold bg-green-700/30 text-green-400"
            >
              {tag}
            </span>
          ))}
        </td>
        <td className="p-4 text-right space-x-2">
          <button
            onClick={() =>
              setVisibleNotesSlug(
                visibleNotesSlug === q.slug ? null : q.slug
              )
            }
            className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg font-medium"
          >
            {visibleNotesSlug === q.slug ? "Hide Notes" : "Show Notes"}
          </button>
          <button
            onClick={() => deleteQuestion(q.slug)}
            className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg font-medium"
          >
            Remove
          </button>
        </td>
      </tr>

      {visibleNotesSlug === q.slug && (
        <tr key={`${q.slug}-notes`}>
          <td colSpan={5} className="bg-white/10 p-4 text-gray-300 text-sm">
            {editingSlug === q.slug ? (
              <>
                <textarea
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  className="w-full bg-gray-800 border border-white/10 rounded p-2 text-white"
                />
                <button
                  onClick={() => saveNote(q.slug)}
                  className="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded"
                >
                  Save
                </button>
              </>
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => startEditing(q.slug, q.notes || "")}
              >
                {q.notes || (
                  <span className="italic text-white/50">
                    No notes available. Click to add.
                  </span>
                )}
              </div>
            )}
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>


            </table>
          </div>
        </section>

        {/* Friends Activity Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">👥 Friends' Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          </div>
        </section>
      </main>
    </>
  );}



function FriendActivity({ name, action, platform }: { name: string; action: string; platform: string }) {
  return (
    <div className="bg-white/10 border border-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/20 transition">
      <div>
        <p className="text-sm">
          <span className="font-semibold text-white">{name}</span> {action}
        </p>
        <p className="text-xs text-white/60">{platform}</p>
      </div>
      <span className="text-xs bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full font-semibold">
        {}
      </span>
    </div>
  );
}

