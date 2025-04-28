import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="flex flex-col bg-white min-w-64 min-h-screen border-r border-gray-200 p-6">
      <div className="mb-8">
        <Image
          src="/RESEPEDIA-2.png"
          alt="Resepedia Logo"
          width={150}
          height={50}
          className="object-contain"
        />
      </div>
      <nav className="flex flex-col gap-4">
        <Link
          href="/"
          className="text-lg text-gray-700 hover:text-red-500 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/login"
          className="text-lg text-gray-700 hover:text-red-500 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/addrecipe"
          className="text-lg text-gray-700 hover:text-red-500 transition-colors"
        >
          Add Recepi
        </Link>
      </nav>
    </aside>
  );
}
