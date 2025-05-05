"use client";

import Swal, { SweetAlertResult } from "sweetalert2";

function getStatusTitle(status: number | string): string {
	if (typeof status === "string" && status === "Network") return "Network Error";
	if (status === 400) return "Bad Request";
	if (status === 401) return "Unauthorized";
	if (status === 402) return "Payment Required";
	if (status === 403) return "Forbidden";
	if (status === 404) return "Not Found";
	if (status === 409) return "Conflict";
	if (status === 422) return "Unprocessable Entity";
	if (status === 500) return "Server Error";
	if (typeof status === "number") return `Error ${status}`;
	return status.toString();
}

const warn = Swal.mixin({
	customClass: {
		confirmButton: "btn btn-outline btn-success",
		cancelButton: "btn btn-outline btn-error mr-2",
	},
	buttonsStyling: false,
});

const swal = {
	success: (text: string) => Swal.fire({ icon: "success", title: text, timer: 1500, showConfirmButton: false }),
	error: (status: number | string, message: string) => Swal.fire({ icon: "error", title: getStatusTitle(status), text: message, timer: 2000, showConfirmButton: false }),
	warn: (status: number | string, message: string, onConfirm: () => void, confirmText: string = "Yes, delete it!", cancelText: string = "No, cancel!") => {
		warn.fire({
			title: getStatusTitle(status),
			text: message,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: confirmText,
			cancelButtonText: cancelText,
			reverseButtons: true,
		}).then(async (result: SweetAlertResult) => (result.isConfirmed ? onConfirm() : ""));
	},
	loading: (text: string) => Swal.fire({ title: text, allowOutsideClick: false, didOpen: () => Swal.showLoading() }),
	close: () => Swal.close(),
};

export default swal;
