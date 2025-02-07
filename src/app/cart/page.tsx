'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';

// ✅ Define the CartItem type
type CartItem = {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedCart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
    calculateTotal(storedCart);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    calculateTotal(newCart);
  };

  const calculateTotal = (cartItems: CartItem[]) => {
    const newTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const handleRemove = (id: string) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    updateCart(updatedCart);
  };

  const increaseQuantity = (id: string) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (id: string) => {
    const updatedCart = cart.map((item) =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updatedCart);
  };

  return (
    <section className="py-10 px-4 flex flex-col items-center justify-center w-full bg-[#FFF3E3]">
      {/* Banner Section */}
      <div className="md:h-[316px] relative w-full">
        <Image src="/shop/shop-hero.png" alt="hero" width={1440} height={316} priority />
        <div className="w-[150px] md:w-[124px] absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] h-[90%] flex flex-col justify-center items-center md:h-[84px]">
          <h1 className="font-medium text-4xl text-black">Cart</h1>
          <p className="font-normal text-[16px] text-mygray">home &gt; Cart</p>
        </div>
      </div>

      <div className="w-full max-w-screen-lg bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-[#333333] mb-8 flex items-center justify-center">
          <AiOutlineShoppingCart className="mr-2 text-[#B88E2F]" /> Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-[#666666]">Your cart is empty!</p>
            <Link href="/shop">
              <button className="mt-6 bg-[#B88E2F] text-white px-6 py-3 rounded-full hover:bg-[#B88E2F]/80 transition duration-300">
                Go to Shop
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={item._id + '-' + index} className="flex justify-between items-center p-4 bg-[#F9F1E7] rounded-lg shadow-md">
                  {/* ✅ Use next/image for optimization */}
                  <div className="w-20 h-20 relative">
                    {item.image ? (
                      <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" className="rounded-lg" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* ✅ Product Info */}
                  <div className="flex-1 ml-4">
                    <h2 className="font-semibold text-lg text-[#333333]">{item.title}</h2>
                    <p className="text-[#666666]">Price: Rp {item.price.toLocaleString()}</p>

                    {/* ✅ Quantity Controls */}
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded-l-md hover:bg-gray-400 transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-white border">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded-r-md hover:bg-gray-400 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* ✅ Delete Button */}
                  <button onClick={() => handleRemove(item._id)} className="text-red-500 hover:text-red-600 transition duration-300">
                    <FiTrash2 className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="mt-8 border-t pt-4">
              <h2 className="text-2xl font-semibold text-right text-[#333333]">
                Subtotal: <span className="text-[#B88E2F]">Rp {total.toLocaleString()}</span>
              </h2>

              {/* ✅ Proceed to Checkout Button */}
              <div className="text-right mt-4">
                <Link href="/checkout">
                  <button className="mt-4 bg-[#B88E2F] text-white px-6 py-3 rounded-full hover:bg-[#B88E2F]/80 transition duration-300">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;
