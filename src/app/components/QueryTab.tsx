'use client';
import React from "react";
import { useEffect,useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function QueryTab({ queries, roomId, updateQuery }: any) {
    const { data: session } = useSession();
    const [replyInputs, setReplyInputs] = useState<any>({});
  const [activeReplyIndex, setActiveReplyIndex] = useState<number | null>(null);

  const [newQuery, setNewQuery] = useState({ question: "", link: "", replies: {} });
  const email = session?.user?.email || "";
  const name = session?.user?.name || "Anonymous";
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuerySubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuery.question || !newQuery) return;
    const response = await axios.post(`/api/addQuery/${roomId}`, {
      queries: {
        name: name, 
        email: email,
        question: newQuery.question,
        link: newQuery.link,

      },
    });

    updateQuery({
        name: name, 
        email: email,
        question: newQuery.question,
        link: newQuery.link,
        queryId:response.data.queryId,
      });
    
    
    setNewQuery({ question: "", link: "", replies:{} });
  };

  const handleReplyChange = (index: number, field: string, value: string) => {
    setReplyInputs((prev: any) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const handleReplySubmit = async(index: number,queryId: any) => {
    const reply = replyInputs[index];
    if (!reply?.comment ) return;
    await axios.post(`/api/addReply/${roomId}`, {
      reply: {
        name: name,
        email: email,
        comment: reply.comment,
        fixLink: reply.fixLink || "",
      },
      queryId: queryId, // Assuming each query has a unique queryId
    });
    
    setReplyInputs((prev: any) => ({
      ...prev,
      [index]: { comment: "", fixLink: "" },
    }));
    setActiveReplyIndex(null);
  };
    return (
        <>
        <section>
      <h2 className="text-2xl font-semibold mb-4">💬 DSA Query & Help</h2>
      <div className="space-y-6">
        {(queries || []).map((q: any, i: number) => (
          <div key={i} className="bg-gray-800 p-5 rounded-lg">
            <div className="mb-2">
              <span className="text-pink-400 font-semibold">{q.name}</span> shared a question:{" "}
              <span className="text-yellow-300 font-medium">{q.question}</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={q.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline text-sm"
              >
                View their solution
              </a>
              <button
                className="text-sm text-pink-300 hover:underline"
                onClick={() => setActiveReplyIndex(activeReplyIndex === i ? null : i)}
              >
                Reply
              </button>
            </div>

            {activeReplyIndex === i && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Your comment"
                  value={replyInputs[i]?.comment || ""}
                  onChange={(e) => handleReplyChange(i, "comment", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                />
                <input
                  type="url"
                  placeholder="Corrected solution link"
                  value={replyInputs[i]?.fixLink || ""}
                  onChange={(e) => handleReplyChange(i, "fixLink", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white"
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded text-white"
                  onClick={() => handleReplySubmit(i, q.queryId)}
                >
                  Submit Reply
                </button>
              </div>
            )}

            {q?.replies?.length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-pink-500 space-y-3">
                {q.replies.map((r: any, j: number) => (
                  <div key={j}>
                    <p>
                      <span className="text-green-400 font-semibold">{r.name}</span>:{" "}
                      <span className="text-gray-300">{r.comment}</span>
                    </p>
                    <a
                      href={r.fixLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 underline text-sm"
                    >
                      View corrected code
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>

        {/* Add New Query */}
       <section className="mt-10 bg-gray-900 p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">➕ Add a New Query</h3>
      <form className="space-y-4" onSubmit={handleQuerySubmit}>
        <input
          type="text"
          name="question"
          value={newQuery.question}
          onChange={handleInputChange}
          placeholder="Question Title"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
        />
        <input
          type="url"
          name="link"
          value={newQuery.link}
          onChange={handleInputChange}
          placeholder="Solution Link"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
        />
        <button
        onClick={handleQuerySubmit}
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Submit Query
        </button>
      </form>
    </section>
        </>
    )
}