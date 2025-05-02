import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { Order } from '@/db/models/orderModel';

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB as string;

// Add this function to create Midtrans transactions
async function createMidtransTransaction(orderId: string, amount: number, customerDetails: any) {
  try {
    // Encode Server Key to Base64
    const serverKey = process.env.MIDTRANS_SERVER_KEY as string;
    const encodedServerKey = Buffer.from(`${serverKey}:`).toString('base64');
    
    const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${encodedServerKey}`
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: amount
        },
        customer_details: {
          first_name: customerDetails.first_name,
          email: customerDetails.email,
          phone: customerDetails.phone
        },
        credit_card: {
          secure: true
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Midtrans API error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in createMidtransTransaction:', error);
    throw error;
  }
}

async function connectToDatabase() {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db(dbName);
}

export async function POST(req: NextRequest) {
  let client: MongoClient | null = null;
  
  try {
    // Use a single client instance and close it properly at the end
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    
    const ordersCollection = db.collection<Order>('orders');
    const usersCollection = db.collection('users');

    const userId = req.headers.get('x-user-id');
    const userEmail = req.headers.get('x-user-email');

    if (!userId || !userEmail) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await req.json();
    
    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
    }

    // Fix: Create a proper order ID that follows Midtrans requirements:
    // - Must be unique
    // - Should be alphanumeric
    // - Should not include special characters except dashes and underscores
    // - Max length: 50 characters
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 8);
    const uniqueOrderId = `ORDER-${timestamp}-${randomPart}`;

    const newOrder: Omit<Order, '_id'> = {
      UserId: new ObjectId(userId),
      amount: amount,
      status: 'Pending',
      orderId: uniqueOrderId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await ordersCollection.insertOne(newOrder);

    if (!result.insertedId) {
      return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
    }

    const createdOrder = await ordersCollection.findOne({ _id: result.insertedId });

    if (!createdOrder) {
      return NextResponse.json({ message: 'Failed to retrieve created order' }, { status: 500 });
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Use the generated unique order ID for Midtrans
    const midtransResponse = await createMidtransTransaction(
      uniqueOrderId,
      amount,
      {
        first_name: user.fullName || 'Customer',
        email: user.email || userEmail,
        phone: user.phoneNumber || '08123456789'
      }
    );

    // Update the order with Midtrans token and redirect URL
    await ordersCollection.updateOne(
      { _id: createdOrder._id },
      { 
        $set: { 
          midtransToken: midtransResponse.token,
          midtransRedirectUrl: midtransResponse.redirect_url,
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({ 
      message: 'Order created successfully', 
      midtransToken: midtransResponse.token, 
      redirectUrl: midtransResponse.redirect_url,
      orderId: uniqueOrderId
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ 
      message: 'Failed to create order', 
      error: error.message 
    }, { status: 500 });
  } finally {
    // Make sure to close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
}