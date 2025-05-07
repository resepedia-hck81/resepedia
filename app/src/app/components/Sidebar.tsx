"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { checkToken } from "../action";

export default function Sidebar() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [open, setOpen] = useState(false);

	async function checkLoginStatus() {
		const hasToken = await checkToken();
		setIsLoggedIn(hasToken);
	}
	useEffect(() => {
		checkLoginStatus();
	}, []);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) setOpen(false);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<>
			<button className="fixed top-4 left-4 z-50 btn btn-ghost btn-circle lg:hidden" onClick={() => setOpen((prev) => !prev)} aria-label="Open sidebar">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>

			<div className={`fixed inset-0 z-30 lg:hidden transition-opacity duration-300 ${open ? "block" : "hidden"} backdrop-blur bg-white/30`} onClick={() => setOpen(false)} />

			<aside
				className={`
					fixed top-0 left-0 h-full w-64 z-40 bg-white border-r border-gray-200 p-6
					transition-transform duration-300 ease-in-out
					${open ? "translate-x-0" : "-translate-x-full"}
					lg:sticky lg:top-0 lg:left-0 lg:h-screen lg:w-64 lg:z-30 lg:bg-white lg:border-r lg:p-6 lg:translate-x-0 lg:block
				`}
				style={{ maxWidth: 256 }}>
				<button className={`btn btn-ghost btn-circle absolute top-4 right-4 lg:hidden ${open ? "" : "hidden"}`} onClick={() => setOpen(false)} aria-label="Close sidebar">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<div className="mb-8 flex justify-center">
					<Image src="/RESEPEDIA-2.png" alt="Resepedia Logo" width={150} height={50} className="object-contain" />
				</div>
				<nav className="flex flex-col gap-4">
					{isLoggedIn ? (
						<Link href="/profile" className="flex items-center gap-3 text-lg text-gray-700 hover:text-red-500 transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							Profile
						</Link>
					) : (
						<Link href="/login" className="flex items-center gap-3 text-lg text-gray-700 hover:text-red-500 transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
							</svg>
							Login
						</Link>
					)}

					<Link href="/" className="flex items-center gap-3 text-lg text-gray-700 hover:text-red-500 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
						</svg>
						Home
					</Link>
					{isLoggedIn && (
						<Link href="/add-recipe" className="flex items-center gap-3 text-lg text-gray-700 hover:text-red-500 transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Add Recipe
						</Link>
					)}
					<Link href="/generate-recipe" className="flex items-center gap-3 text-lg text-gray-700 hover:text-red-500 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
						</svg>
						Generate Recipe
					</Link>
				</nav>
			</aside>
		</>
	);
}
