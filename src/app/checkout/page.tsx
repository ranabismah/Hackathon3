"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
}

const Checkout = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Load cart data from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (Array.isArray(storedCart) && storedCart.length > 0) {
      setCart(storedCart);
      setTotalAmount(
        storedCart.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
      );
    }
  }, []);

  // Handle order submission (Cash on Delivery)
  const handlePlaceOrder = async () => {
    if (!name || !address || !phone) {
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        _type: "order",
        customerName: name,
        customerAddress: address,
        customerPhone: phone,
        totalAmount: totalAmount,
        items: cart.map((item) => ({
          _type: "orderItem",
          productId: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentMethod: "Cash on Delivery",
        status: "Pending",
      };

      // Save order in Sanity CMS
      await client.create(orderData);

      // Clear cart after successful order
      localStorage.removeItem("cart");
      setCart([]);
      setTotalAmount(0);
      setSuccess(true);

      // Redirect after a delay
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {success ? (
        <div className="text-green-600 text-center text-xl">
          🎉 Your order has been placed successfully! Redirecting to home...
        </div>
      ) : (
        <>
          {/* Order Summary */}
          <div className="border p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between mb-2">
                    <span>{item.title} (x{item.quantity})</span>
                    <span>Rp {item.price.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>Rp {totalAmount.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          {/* Customer Details Form */}
          <div className="border p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading || cart.length === 0}
            className="w-full bg-golden text-white p-3 rounded-lg font-bold hover:bg-yellow-600 transition"
          >
            {loading ? "Placing Order..." : "Place Order (COD)"}
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
