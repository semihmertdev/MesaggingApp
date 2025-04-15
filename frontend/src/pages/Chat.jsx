import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

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

  // Seçilen kullanıcıyla mesaj geçmişini al
  useEffect(() => {
    if (selectedUser) {
      API.get(`/messages/${selectedUser.id}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedUser]);

  // Yeni mesaj gönder
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await API.post("/messages", {
        receiver_id: selectedUser.id,
        content: newMessage,
      });
      setNewMessage(""); // Mesajı gönderdikten sonra inputu temizle
      // Mesajlar tekrar çekilsin
      API.get(`/messages/${selectedUser.id}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error(err));
    } catch (err) {
      console.error("Mesaj gönderilemedi:", err);
    }
  };

  return (
    <div className="flex">
      {/* Kullanıcı Listesi */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="font-bold mb-4">Kullanıcılar</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`cursor-pointer p-2 hover:bg-blue-300 ${
                selectedUser && selectedUser.id === user.id
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      {/* Mesaj Geçmişi ve Yeni Mesaj */}
      <div className="w-3/4 p-4">
        <h2 className="font-bold mb-4">
          {selectedUser ? `${selectedUser.username} ile sohbet` : "Bir kullanıcı seçin"}
        </h2>

        {selectedUser && (
          <>
            <div className="border p-4 mb-4 h-96 overflow-y-scroll">
              {/* Mesajlar */}
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`mb-2 p-2 rounded ${
                    msg.sender.id === selectedUser.id 
                      ? 'bg-gray-200' 
                      : 'bg-blue-200 ml-auto'
                  }`}
                  style={{ maxWidth: '80%' }}
                >
                  <strong>{msg.sender.username}: </strong>
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Yeni Mesaj Formu */}
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesaj yaz..."
                className="border p-2 w-full mr-2"
              />
              <button type="submit" className="bg-blue-500 text-white p-2">
                Gönder
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
