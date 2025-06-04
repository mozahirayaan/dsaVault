'use client';
import axios from 'axios';
import React from 'react';
import { useState,useEffect } from 'react';
import { useParams } from 'next/navigation'
import {format } from 'timeago.js';
import QueryTab from '@/app/components/QueryTab';
import Navbar from '@/app/components/Navbar';

export default function RoomPage() {
  const params = useParams< {roomId: string}>();
  const roomId = params.roomId;

  const [members, setMembers] = useState<any[]>([]);
  const [activities,setActivities] =useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [roomDetails,setRoomDetails]=useState<any>({});

  const newQuery=(query: any)=>{
    setQueries(prevQueries => [...prevQueries, query]);
  }

  const updateReply=(query: any)=>{
    setQueries(prevQueries => [...prevQueries, query]);
  }


  const addQuery = (query: any) => {
    setQueries((queries) => [...queries, query]);
  }


  const url={
    Leetcode: {
      submission: "https://leetcode.com/problems/",
      contest: "https://leetcode.com/contest/"
    },

    Codeforces: {
      submission: "https://codeforces.com/contest/", 
      contest: "https://codeforces.com/contest/",
    }
  }


  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/api/getRoomDetails/${roomId}`); // Adjust the endpoint as needed
        if (response.data) {
          setMembers(response.data.memberDetails || []);
          setActivities(response.data.userActivity || []);
          setQueries(response.data.room.queries);
          setRoomDetails(response.data.room)
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    fetchRoomDetails();
  }, []);

  return (
    <>
    <Navbar/>
    <div style={{ height: 'calc(100vh - 48px)' }} className="flex h-screen bg-gray-950 text-white mt-12">
      
      {/* Left Sidebar - Members */}
      <aside style={{ height: 'calc(100vh - 48px)' }}  className="w-1/4 h-screen p-6 border-r border-gray-800 bg-gray-900 flex flex-col">
  {/* Room Name */}
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-white">🏠 {roomDetails.roomName}</h1>
    <p>Room Code: {roomDetails.roomId}</p>
  </div>

  {/* Members List */}
  <div className="flex-1 overflow-y-auto">
    <h2 className="text-xl font-semibold mb-4 text-gray-300">👥 Room Members</h2>
    <ul className="space-y-3">
      {members.map((member) => (
        <li
          key={member.email}
          className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-white"
        >
          {member.name}
        </li>
      ))}
    </ul>
  </div>

  {/* Query Tab at Bottom */}
  <div className="mt-6">
    <a href="#query">
    <button className="w-full bg-pink-600 hover:bg-pink-500 text-white font-medium py-2 px-4 rounded-lg transition">
      💬 Query Tab
    </button>
    </a>
  </div>
</aside>


      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-10">
        {/* Activity Feed */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">📈 Member Activity</h2>
          <div className="space-y-4">
            {activities.map((act, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-xl">
                <p>
                  <span className="text-pink-400 font-semibold">{act.member}</span> {act.action}{" "}
                  <a href={`${(url as any)[act.platform][act.type]}${act.titleSlug}`} target="_blank" rel="noopener noreferrer">
                  <span className="text-yellow-300 font-medium">
                    {act.title}
                  </span>
                  </a>
                  {" "}
                  on <span className="text-green-400">{act.platform}</span> {act.ranking && (
  <>
    and secured rank of{" "}
    <span className="text-yellow-300 font-medium">{act.ranking}</span>
  </>
)}


                </p>
                <p className="text-xs text-gray-400 mt-1">{format(act.timestamp* 1000)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DSA Query Forum */}
        <div id="query"></div>
        <QueryTab queries={queries} roomId={roomId} updateQuery={newQuery} />

        {/* Add New Query */}
      </main>
    </div>
    </>
  );
}
