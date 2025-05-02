"use client";

import Swal from "sweetalert2";

function getStatusTitle(status: number | string): string {
	if (typeof status === "string" && status === "Network") return "Network Error";
	if (status === 400) return "Bad Request";
	if (status === 401) return "Unauthorized";
	if (status === 403) return "Forbidden";
	if (status === 404) return "Not Found";
	if (status === 409) return "Conflict";
	if (status === 422) return "Unprocessable Entity";
	if (status === 500) return "Server Error";
	if (typeof status === "number") return `Error ${status}`;
	return status.toString();
}

const swal = {
	success: (text: string) => Swal.fire({ icon: "success", title: text, timer: 1500, showConfirmButton: false }),
	error: (status: number | string, message: string) => Swal.fire({ icon: "error", title: getStatusTitle(status), text: message, timer: 2000, showConfirmButton: false }),
};

export default swal;
