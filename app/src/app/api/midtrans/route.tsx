import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { Order } from '@/db/models/orderModel';

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

async function connectToDatabase() {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db(dbName);
}

export async function POST(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');

    const { orderId } = await req.json();

    if (!orderId) {
      return new NextResponse(JSON.stringify({ message: 'Order ID is required' }), { status: 400 });
    }

    const objectIdOrderId = new ObjectId(orderId);

    const order = await ordersCollection.findOne({ _id: objectIdOrderId });

    if (!order) {
      return new NextResponse(JSON.stringify({ message: 'Order not found' }), { status: 404 });
    }

    // Di sini Anda akan memproses notifikasi dari Midtrans.
    // Biasanya, Midtrans akan mengirimkan notifikasi ke endpoint yang Anda konfigurasi di dashboard Midtrans.
    // Endpoint ini akan menerima informasi tentang status pembayaran (success, pending, failed, dll.).

    // Contoh sederhana: anggap ada field `transaction_status` di body notifikasi Midtrans
    const { transaction_status } = await req.json();

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      await ordersCollection.updateOne(
        { _id: objectIdOrderId },
        { $set: { status: 'Success', paidAt: new Date() } }
      );
      return new NextResponse(JSON.stringify({ message: 'Payment successful!', orderId: orderId }), { status: 200 });
    } else if (transaction_status === 'pending') {
      await ordersCollection.updateOne(
        { _id: objectIdOrderId },
        { $set: { status: 'Pending' } }
      );
      return new NextResponse(JSON.stringify({ message: 'Payment pending.', orderId: orderId }), { status: 200 });
    } else if (transaction_status === 'deny' || transaction_status === 'expire' || transaction_status === 'cancel') {
      await ordersCollection.updateOne(
        { _id: objectIdOrderId },
        { $set: { status: 'Failed' } }
      );
      return new NextResponse(JSON.stringify({ message: 'Payment failed or cancelled.', orderId: orderId }), { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ message: 'Unhandled payment status.', orderId: orderId, status: transaction_status }), { status: 400 });
    }
  } catch (error: any) {
    console.error('Error processing Midtrans notification:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to process Midtrans notification', error: error.message }), { status: 500 });
  }
}