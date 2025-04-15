import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Hata mesajlarını gösterebilmek için state ekledik
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Her seferinde hata mesajını sıfırlıyoruz
    try {
      // Backend'e yeni kullanıcıyı kaydediyoruz
      await API.post("/auth/register", { username, email, password });

      // Kayıt başarılıysa login ol
      const loginRes = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", loginRes.data.token);

      // Başarıyla giriş yapıldığında ana sayfaya yönlendir
      navigate("/");
    } catch (err) {
      // Backend'den gelen hata mesajını göster
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Kayıt başarısız. Lütfen tekrar deneyin.");
      } else {
        setError("Kayıt başarısız. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Kayıt Ol</h2>
      
      {/* Hata mesajını burada gösteriyoruz */}
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          className="w-full border px-3 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Şifre"
          className="w-full border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          Kayıt Ol
        </button>
      </form>
    </div>
  );
}
