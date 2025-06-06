"use client";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function UsernamesForm() {
  const [leetcode, setLeetcode] = useState("");
  const [codeforces, setCodeforces] = useState("");
  const [messageLC, setMessageLC] = useState("");
  const [messageCF, setMessageCF] = useState("");
  const [loadingLC, setLoadingLC] = useState(false);
  const [loadingCF, setLoadingCF] = useState(false);

  useEffect(()=>{
    const fetchUser=async()=>{
      try{
        const response=await axios.get('/api/getUserDetail');
      if(!response||!response.data || !response.data.userDetails){
        return;
      }

      if(response.data.userDetails.leetcode){
        setLeetcode(response.data.userDetails.leetcode);
      }
      if(response.data.userDetails.codeforces){
        setCodeforces(response.data.userDetails.codeforces);
      }
      console.log(response.data.userDetails.leetcode);
      }
      catch(error){
        console.log(error);
      }
    }
    fetchUser();
  },[])

  const handleSubmitLeetcode = async (e: any) => {
    e.preventDefault();
    setLoadingLC(true);
    setMessageLC("");
    try {
        await axios.post("/api/saveUsername", {
            username: leetcode,
            platform: "leetcode",
        });
      setMessageLC("✅ LeetCode username saved!");
    } catch {
      setMessageLC("❌ Failed to save check your LeetCode username.");
    }
    setLoadingLC(false);
  };

  const handleSubmitCodeforces = async (e:any) => {
    e.preventDefault();
    setLoadingCF(true);
    setMessageCF("");
    try {
      await axios.post("/api/saveUsername", {
            username: codeforces,
            platform: "codeforces",
        });
      setMessageCF("✅ Codeforces username saved!");
    } catch {
      setMessageCF("❌ Failed to save check your Codeforces username.");
    }
    setLoadingCF(false)
  };

  return (<>
  <Navbar />
    <div className="mt-32 max-w-md mx-auto p-6 text-black bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800">You must link both of your profiles to proceed</h2>

      {/* LeetCode Form */}
      <form onSubmit={handleSubmitLeetcode} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">LeetCode Username</span>
          <input
            type="text"
            value={leetcode}
            onChange={(e) => setLeetcode(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="e.g. tourist"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loadingLC}
          className="w-full bg-yellow-500 text-white font-medium py-2 rounded-lg hover:bg-yellow-600 transition"
        >
          {loadingLC ? "Saving..." : "Save LeetCode Username"}
        </button>
        {messageLC && <p className="text-sm text-center">{messageLC}</p>}
      </form>

      {/* Codeforces Form */}
      <form onSubmit={handleSubmitCodeforces} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Codeforces Username</span>
          <input
            type="text"
            value={codeforces}
            onChange={(e) => setCodeforces(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. jiangly"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loadingCF}
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {loadingCF ? "Saving..." : "Save Codeforces Username"}
        </button>
        {messageCF && <p className="text-sm text-center">{messageCF}</p>}
      </form>
    </div>
    </>
  );
}
