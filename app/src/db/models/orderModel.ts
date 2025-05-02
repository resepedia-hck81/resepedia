import { ObjectId } from 'mongodb';

export interface Order {
  _id?: ObjectId;
  UserId: ObjectId;
  amount: number;
  status: string;
  midtransToken?: string;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createMidtransTransaction(orderId: string, amount: number, customerDetails: { first_name: string; email: string; phone: string }): Promise<any> {
  try {
    const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: `TRX-PREMIUM-${orderId}`,
          gross_amount: amount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: customerDetails.first_name,
          email: customerDetails.email,
          phone: customerDetails.phone,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Midtrans Error:', error);
      throw new Error(`Failed to create Midtrans transaction: ${response.status} - ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    console.log('Midtrans Response:', data);
    return data;
  } catch (error: any) {
    console.error('Error creating Midtrans transaction:', error);
    throw error;
  }
}