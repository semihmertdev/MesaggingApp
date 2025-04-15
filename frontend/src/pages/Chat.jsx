import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import API from "../api";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const { joinRoom, sendMessage, subscribeToMessages } = useSocket();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Mevcut kullanıcı bilgisini al
    API.get("/auth/me")
      .then((res) => setCurrentUser(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });

    // Tüm kullanıcıları al
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });
  }, [navigate]);

  // Seçilen kullanıcıyla sohbet odasına katıl ve mesaj geçmişini al
  useEffect(() => {
    if (selectedUser && currentUser) {
      const roomId = [currentUser.id, selectedUser.id].sort().join('-');
      joinRoom(roomId);

      API.get(`/messages/${selectedUser.id}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error(err));

      // Gerçek zamanlı mesajları dinle
      const unsubscribe = subscribeToMessages((message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => unsubscribe();
    }
  }, [selectedUser, currentUser, joinRoom, subscribeToMessages]);

  // Yeni mesaj gönder
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !currentUser) return;

    const roomId = [currentUser.id, selectedUser.id].sort().join('-');
    const messageData = {
      roomId,
      sender: currentUser,
      receiver: selectedUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      // Mesajı veritabanına kaydet
      await API.post("/messages", {
        receiver_id: selectedUser.id,
        content: newMessage,
      });

      // Mesajı Socket.IO ile gönder
      sendMessage(messageData);
      
      // Mesajı yerel state'e ekle
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    } catch (err) {
      console.error("Mesaj gönderilemedi:", err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Kullanıcı Listesi */}
      <div className="w-1/4 bg-gray-100 border-r">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Sohbetler</h2>
          <div className="space-y-2">
            {users.filter(user => user.id !== currentUser?.id).map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUser?.id === user.id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                <div className="font-medium">{user.username}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mesajlaşma Alanı */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Sohbet Başlığı */}
            <div className="p-4 bg-white border-b">
              <h2 className="text-lg font-semibold">
                {selectedUser.username}
              </h2>
            </div>

            {/* Mesaj Geçmişi */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender.id === currentUser?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender.id === currentUser?.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(message.timestamp || message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mesaj Gönderme Formu */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 rounded-lg border p-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Gönder
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Sohbet başlatmak için bir kullanıcı seçin
          </div>
        )}
      </div>
    </div>
  );
}
