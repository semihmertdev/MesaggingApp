import React, { useState } from 'react';
import { Chat } from './Chat';

export const ChatTest = () => {
  const [activeRoom, setActiveRoom] = useState('test-room-1');
  const [activeUser, setActiveUser] = useState('User1');

  const rooms = ['test-room-1', 'test-room-2'];
  const users = ['User1', 'User2', 'User3'];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Test Kontrolleri</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Aktif Oda:</label>
              <select
                value={activeRoom}
                onChange={(e) => setActiveRoom(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Aktif Kullanıcı:</label>
              <select
                value={activeUser}
                onChange={(e) => setActiveUser(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {users.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h4 className="font-semibold">Test Talimatları:</h4>
          <ol className="list-decimal ml-4 space-y-2">
            <li>Farklı tarayıcı pencerelerinde bu sayfayı açın</li>
            <li>Her pencerede farklı kullanıcıları seçin</li>
            <li>Aynı odada mesajlaşmayı test edin</li>
            <li>Farklı odalarda mesajlaşmayı test edin</li>
            <li>Bağlantı durumunu kontrol edin</li>
          </ol>
        </div>
      </div>

      <div className="border rounded-lg h-[600px]">
        <div className="bg-gray-100 p-4 border-b">
          <h2 className="text-lg font-semibold">
            Oda: {activeRoom} | Kullanıcı: {activeUser}
          </h2>
        </div>
        <Chat roomId={activeRoom} currentUser={activeUser} />
      </div>
    </div>
  );
}; 