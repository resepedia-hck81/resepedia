"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { usePathname } from "next/navigation";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const hideNavRoutes = ["/login", "/register"];
	const shouldShowSidebar = !hideNavRoutes.includes(pathname);

	const showTitle = () => {
		if (pathname === "/profile") return "Resepedia - Profile";
		if (pathname === "/login") return "Resepedia - Login";
		if (pathname === "/register") return "Resepedia - Register";
		if (pathname === "/generate-recipe") return "Resepedia - Generate Recipe";
		return "Resepedia";
	}
	
	return (
		<html lang="en" data-theme="light">
			<head>
				<link rel="manifest" href="/manifest.json" />
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" href="/RESEPEDIA-2.png" type="image/png" />
				<link rel="apple-touch-icon" href="/RESEPEDIA-2.png" />
				<title>{showTitle()}</title>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} flex flex-row min-h-screen antialiased`}>
				{shouldShowSidebar && <Sidebar />}
				<div className={`min-h-screen bg-white ${shouldShowSidebar ? "flex-1" : "w-full"}`}>{children}</div>
			</body>
		</html>
	);
}
