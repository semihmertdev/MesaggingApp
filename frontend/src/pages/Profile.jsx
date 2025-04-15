import { useState, useEffect } from "react";
import API from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/users/me")
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!user) return <p className="p-4">Yükleniyor...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profilim</h2>
      <p><strong>Kullanıcı adı:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {user.bio && <p><strong>Hakkımda:</strong> {user.bio}</p>}
    </div>
  );
}
