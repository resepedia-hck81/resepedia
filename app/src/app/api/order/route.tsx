import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { createMidtransTransaction, PREMIUM_SUBSCRIPTION_PRICE } from "@/db/models/orderModel";

const uri = process.env.MONGOLOQUENT_DATABASE_URI as string;
// const dbName = process.env.MONGODB_DB as string;

class CustomError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

export async function POST(request: NextRequest) {
	let client: MongoClient | null = null;

	try {
		const userId = request.headers.get("x-user-id");
		const userEmail = request.headers.get("x-user-email");

		if (!userId || !userEmail) {
			throw new CustomError("Unauthorized", 401);
		}

		// Connect to MongoDB
		client = new MongoClient(uri);
		await client.connect();
		const db = client.db("resepedia");

		// Collections
		const ordersCollection = db.collection("orders");
		const usersCollection = db.collection("users");

		// Generate unique order ID for Midtrans
		// const timestamp = Date.now();
		// const randomPart = Math.random().toString(36).substring(2, 8);
		// const uniqueOrderId = `ORDER-${timestamp}-${randomPart}`;

		// Create order
		const orderData = {
			UserId: new ObjectId(userId),
			amount: PREMIUM_SUBSCRIPTION_PRICE,
			status: "Pending",
			// orderId: uniqueOrderId,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await ordersCollection.insertOne(orderData);

		if (!result.insertedId) {
			throw new CustomError("Failed to create order", 500);
		}

		// Get user data
		const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

		if (!user) {
			throw new CustomError("User not found", 404);
		}

		// Create Midtrans transaction
		const midtransResponse = await createMidtransTransaction(result.insertedId.toString(), PREMIUM_SUBSCRIPTION_PRICE, { email: userEmail });

		if (!midtransResponse.redirect_url) {
			throw new CustomError("Midtrans error", 500);
		}

		// Update order with Midtrans data
		await ordersCollection.updateOne(
			{ _id: result.insertedId },
			{
				$set: {
					midtransToken: midtransResponse.token,
					midtransRedirectUrl: midtransResponse.redirect_url,
					updatedAt: new Date(),
				},
			}
		);

		return NextResponse.json(
			{
				message: "Order created successfully",
				orderId: result.insertedId.toString(),
				redirectUrl: midtransResponse.redirect_url,
			},
			{ status: 201 }
		);
	} catch (error: unknown) {
		// console.error("🐄 - POST - error:", error);

		if (error instanceof CustomError) {
			return NextResponse.json({ message: error.message }, { status: error.status });
		}

		return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
	} finally {
		if (client) {
			await client.close();
		}
	}
}
