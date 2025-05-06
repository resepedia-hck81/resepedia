import { ObjectId } from "mongodb";

// Definisikan konstanta untuk harga premium
export const PREMIUM_SUBSCRIPTION_PRICE = 350000;

export interface Order {
	_id?: ObjectId;
	UserId: ObjectId;
	amount: number;
	status: string;
	orderId: string; // Tambahkan field orderId untuk integrasi dengan Midtrans
	midtransToken?: string;
	midtransRedirectUrl?: string; // Field untuk menyimpan URL redirect Midtrans
	paidAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

// Definisikan tipe respons Midtrans
export interface MidtransResponse {
	token: string;
	redirect_url: string;
	transaction_id?: string;
	order_id?: string;
	gross_amount?: string;
	payment_type?: string;
	transaction_time?: string;
	transaction_status?: string;
	fraud_status?: string;
	status_code?: string;
	status_message?: string;
}

export async function createMidtransTransaction(orderId: string, amount: number = PREMIUM_SUBSCRIPTION_PRICE, customerDetails: { email: string }): Promise<MidtransResponse> {
	try {
		const serverKey = process.env.MIDTRANS_SERVER_KEY;

		if (!serverKey) {
			throw new Error("Midtrans server key is not defined in environment variables");
		}

		const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Basic ${Buffer.from(serverKey + ":").toString("base64")}`,
			},
			body: JSON.stringify({
				transaction_details: {
					order_id: orderId,
					gross_amount: amount,
				},
				credit_card: {
					secure: true,
				},
				customer_details: {
					email: customerDetails.email,
				},
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			let errorJson;
			try {
				errorJson = JSON.parse(errorText);
			} catch {
				errorJson = { message: errorText };
			}
			//   console.error('Midtrans Error:', errorJson);
			throw new Error(`Failed to create Midtrans transaction: ${response.status} - ${JSON.stringify(errorJson)}`);
		}

		const data = (await response.json()) as MidtransResponse;
		// console.log("Midtrans Response:", data);
		return data;
	} catch (error: unknown) {
		// if (error instanceof Error) {
		// 	console.error("Error creating Midtrans transaction:", error.message);
		// } else {
		// 	console.error("Unknown error creating Midtrans transaction");
		// }
		throw error;
	}
}
