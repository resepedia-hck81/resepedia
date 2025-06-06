"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import swal from "../components/Swal";

export default function Register() {
	const router = useRouter();
	const [form, setForm] = useState({
		email: "",
		username: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const errors = [];
		if (!form.username) errors.push("Username is required");
		if (!form.email) errors.push("Email is required");
		if (!form.password) errors.push("Password is required");
		if (errors.length) {
			return swal.error(400, errors.join(", "));
		}
		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			const result = await res.json();
			if (res.ok) {
				swal.success("Register success, please login");
				router.push("/login");
			} else swal.error(res.status, result.message || "Register failed");
		} catch {
			swal.error(500, "Network error, please try again later");
		}
	};

	return (
		<div className="flex min-h-screen">
			<div className="absolute top-4 left-4">
				<Link href="/" className="inline-block text-gray-700 hover:text-red-600 transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
					</svg>
				</Link>
			</div>
			<div className="w-full sm:w-1/2 flex flex-col justify-center items-center bg-white p-6 sm:p-10">
				<div className="w-full max-w-md">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Create an Account</h1>
					<form className="text-sm font-medium text-gray-800 mb-1 flex flex-col gap-4" onSubmit={handleSubmit}>
						<div>
							<label htmlFor="UserName" className="block text-sm font-medium text-gray-800 mb-1">
								Username
							</label>
							<input name="username" value={form.username} onChange={handleChange} type="text" id="UserName" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
						</div>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
								Email
							</label>
							<input name="email" value={form.email} onChange={handleChange} type="email" id="email" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
								Password
							</label>
							<input name="password" value={form.password} onChange={handleChange} type="password" id="password" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
						</div>
						<button type="submit" className="mt-4 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors w-full">
							Register
						</button>
					</form>
					<p className="text-center text-sm text-gray-800 mt-6">
						Already have an account?{" "}
						<Link href="/login" className="text-red-600 hover:underline">
							Login
						</Link>
					</p>
				</div>
			</div>
			<div
				className="hidden sm:block sm:w-1/2 bg-cover bg-center"
				style={{
					backgroundImage: "url('https://images3.alphacoders.com/970/970431.jpg')",
				}}></div>
		</div>
	);
}
