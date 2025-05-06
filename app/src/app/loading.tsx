import Image from "next/image";

export default function Loading() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-base-200">
			<div className="flex items-center justify-center h-screen">
				<div className="relative flex items-center justify-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
					<Image src="/RESEPEDIA-2.png" alt="Resepedia Logo" className="absolute h-16 w-16 object-contain" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }} width={64} height={64} priority />
				</div>
			</div>
		</div>
	);
}
