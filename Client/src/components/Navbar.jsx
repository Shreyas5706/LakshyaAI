import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 z-50 bg-white/70 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <div className="text-xl font-bold">
          Lakshya<span className="text-indigo-600">.ai</span>
        </div>

        <div className="hidden md:flex gap-8 text-lg text-gray-600">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="flex gap-3">
          <Link
            to="/auth"
              className="px-5 py-2 rounded-xl bg-white text-indigo-600 shadow"
          >
            Login
          </Link>

          <Link
            to="/auth"
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white shadow"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </nav>
  );
}
