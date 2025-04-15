import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">
        MesajlaşmaApp
      </Link>
      <div className="space-x-4">
        <Link to="/profile" className="hover:underline">
          Profil
        </Link>
        <Link to="/login" className="hover:underline">
          Giriş
        </Link>
        <Link to="/register" className="hover:underline">
          Kayıt
        </Link>
      </div>
    </nav>
  );
}
