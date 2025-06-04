"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

interface Room {
  roomId: string;
  roomName: string;
  members: number;
}

export default function Room() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');


  useEffect(() => {
    const fetchRooms = async () => { 
      try {
        const response = await axios.get('/api/getRooms'); // Adjust the endpoint as needed
        if (response.data && Array.isArray(response.data.rooms)) {
          setRooms(response.data.rooms);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
     }

     fetchRooms();
  },[])

  const createRoom = async () => {

    const response=await axios.post('/api/createRoom', { roomName: newRoomName });
    if(!response.data || !response.data.roomId) {
      alert("Error creating room. Please try again.");
      return;
    }
    if (newRoomName.trim()) {
      const newRoom = {
        roomId: response.data.roomId,
        roomName: response.data.roomName,
        members: 1,
      };
      setRooms([...rooms, newRoom]);
      setNewRoomName('');
    }

    


  };

  const joinRoom = async() => {
    const response = await axios.post('/api/joinRoom', { roomId: joinRoomCode });
    if(!response.data || !response.data.roomId) {
      alert("Error Joining room. Please try again. Plzz check the room code.");
      return;
    }


    if (joinRoomCode.trim()) {
      alert(`Trying to join room with code: ${joinRoomCode}`);
      setJoinRoomCode('');
      setShowJoinModal(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mt-20 mx-auto">
        <h1 className="text-4xl font-bold mb-6">🧠 My Rooms</h1>

        <div className="flex gap-4 mb-8">
          <input
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Enter room name"
            className="flex-1 px-4 py-2 rounded-md text-black"
          />
          <button
            onClick={createRoom}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md font-semibold"
          >
            Create Room
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold"
          >
            Join Room
          </button>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 cursor-pointer">
          {rooms.map((room) => (
  <a
    key={room.roomId}
    href={`/eachRoom/${room.roomId}`}
    className="bg-white/10 border border-white/20 rounded-xl p-5 hover:bg-white/20 transition"
  >
    <h2 className="text-2xl font-semibold mb-1">{room.roomName}</h2>
    <p className="text-sm text-white/70">RoomID: {room.roomId}</p>
    <p className="text-lg text-white/70">{room.members} members</p>
  </a>
))}

        </div>
        

        {showJoinModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur flex justify-center items-center z-10">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">🔑 Join Room</h3>
              <input
                value={joinRoomCode}
                onChange={(e) => setJoinRoomCode(e.target.value)}
                placeholder="Enter room code"
                className="w-full px-4 py-2 mb-4 rounded-md text-black"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={joinRoom}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};


