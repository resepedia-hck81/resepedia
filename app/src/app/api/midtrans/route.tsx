import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { Order } from "@/db/models/orderModel";
import User from "@/db/models/Users";
import crypto from "crypto";

const uri = process.env.MONGODB_URI as string;
// const dbName = process.env.MONGODB_DB as string;

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
  }
}

interface INotificationBody {
  transaction_status: string;
  signature_key: string;
  order_id: string;
  gross_amount: string;
  status_code: string;
  payment_type?: string;
  transaction_id?: string;
  transaction_time?: string;
  fraud_status?: string;
}

export async function POST(request: NextRequest) {
  let client: MongoClient | null = null;

  try {
    const body = (await request.json()) as INotificationBody;
    console.log("Midtrans notification body:", body);

    // Validasi status transaksi
    if (
      body.transaction_status !== "settlement" &&
      body.transaction_status !== "capture" &&
      body.transaction_status !== "pending" &&
      body.transaction_status !== "deny" &&
      body.transaction_status !== "cancel" &&
      body.transaction_status !== "expire"
    ) {
      throw new CustomError("Invalid transaction status", 400);
    }

    // Validasi keberadaan order_id
    if (!body.order_id) {
      throw new CustomError("Order ID is required", 400);
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db("resepedia");
    const ordersCollection = db.collection<Order>('orders');

    // Cari order berdasarkan ID (errornya pas dinyalain yg ini)
    const order = await ordersCollection.findOne({
      _id: new ObjectId(body.order_id)
    });

    if (!order) {
      throw new CustomError("Order not found", 404);
    }

    // Untuk status pending, cukup update status order
    if (body.transaction_status === "pending") {
      await ordersCollection.updateOne(
        { _id: new ObjectId(body.order_id) },
        { $set: { status: "Pending", updatedAt: new Date() } }
      );
      return NextResponse.json({ message: "Order status updated to pending" }, { status: 200 });
    }

    // Validasi jumlah pembayaran
    if (!body.gross_amount) {
      throw new CustomError("Gross amount is required", 400);
    }

    // Pastikan jumlah pembayaran sesuai dengan yang diharapkan
    // Hapus koma dan titik untuk perbandingan numerik
    // const receivedAmount = parseInt(body.gross_amount.replace(/[.,]/g, ""));
    // const expectedAmount = order.amount;

    // if (receivedAmount !== expectedAmount) {
    //   throw new CustomError("Payment amount does not match order amount", 400);
    // }

    // Validasi signature key
    if (!body.signature_key) {
      throw new CustomError("Signature key is required", 400);
    }

    // Validasi status code
    if (!body.status_code) {
      throw new CustomError("Status code is required", 400);
    }

    // Verifikasi signature key untuk memastikan request benar-benar dari Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY as string;
    if (!serverKey) {
      throw new CustomError("Midtrans server key not configured", 500);
    }

    const calculatedSignature = crypto
      .createHash("sha512")
      .update(body.order_id + body.status_code + body.gross_amount + serverKey)
      .digest("hex");

    if (calculatedSignature !== body.signature_key) {
      throw new CustomError("Invalid signature key", 401);
    }

    // Update status order berdasarkan status transaksi (ini pas dinyalain juga)
    let newStatus = "Pending";
    if (body.transaction_status === "settlement" || body.transaction_status === "capture") {
      newStatus = "Paid";
    } else if (body.transaction_status === "deny" || body.transaction_status === "cancel") {
      newStatus = "Failed";
    } else if (body.transaction_status === "expire") {
      newStatus = "Expired";
    }

    await ordersCollection.updateOne(
      { _id: new ObjectId(body.order_id) },
      {
        $set: {
          status: newStatus,
          paymentType: body.payment_type || "",
          paidAt: newStatus === "Paid" ? new Date() : undefined,
          updatedAt: new Date()
        }
      }
    );

    // Jika pembayaran berhasil, upgrade user ke premium
    if (newStatus === "Paid") {
      try {
    // Dapatkan user ID dari order
        const userId = order.UserId.toString();

    // Cara update user dengan Mongoloquent berdasarkan kode yang Anda bagikan
        const user = await User.findOrFail(userId);

    // Update properti user
        user.isPremium = true;
        // user.tokenCount = 9999999; // Set ke nilai sangat tinggi sebagai "unlimited"

    // Simpan perubahan
        await user.save();

        console.log(`User ${userId} upgraded to premium status`);
      } catch (userError) {
        console.error("Error updating user premium status:", userError);
        // Kita tetap lanjutkan karena order sudah diupdate sebagai dibayar
      }
    }

    return NextResponse.json({
      message: `Order status updated to ${newStatus}`,
      orderId: body.order_id
    }, { status: 200 });

    // return Response.json(
    //   { message: "Midtrans notification processed successfully" },
    //   { status: 200 }
    // );
  } catch (error) {
    console.error("Error processing Midtrans notification:", error);

    if (error instanceof CustomError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
  finally {
    if (client) {
      await client.close();
    }
  }
}

// Endpoint GET untuk testing
export async function GET() {
  return NextResponse.json({
    message: "Midtrans notification endpoint is operational",
    info: "This endpoint handles POST notifications from Midtrans payment gateway",
  });
}
