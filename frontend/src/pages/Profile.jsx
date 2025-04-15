import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.error || 'Bir hata oluştu');
        setLoading(false);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      });
  }, [navigate]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 text-center text-red-500">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Profilim</h2>
      <div className="space-y-4">
        <div>
          <label className="text-gray-600 text-sm">Kullanıcı adı</label>
          <p className="text-lg font-medium">{user.username}</p>
        </div>
        <div>
          <label className="text-gray-600 text-sm">Email</label>
          <p className="text-lg font-medium">{user.email}</p>
        </div>
        {user.bio && (
          <div>
            <label className="text-gray-600 text-sm">Hakkımda</label>
            <p className="text-lg font-medium">{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
