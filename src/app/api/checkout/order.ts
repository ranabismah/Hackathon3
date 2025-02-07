import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const { name, email, phone, address, cartItems, totalAmount } = await req.json();

    if (!name || !email || !phone || !address || cartItems.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newOrder = {
      _type: "order",
      name,
      email,
      phone,
      address,
      cartItems,
      totalAmount,
      status: "Pending",
    };

    await client.create(newOrder);

    return NextResponse.json({ message: "Order placed successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
