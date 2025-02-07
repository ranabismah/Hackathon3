"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ShopProductList from "@/components/ShopProductList";
import CustomerCare from "@/components/CustomerCare";
import Image from "next/image";
import { client } from "@/sanity/lib/client";

// Define Product Interface
interface Product {
  _id: string;
  title: string;
  description: string;
  productImage?: { asset?: { _ref?: string } };
  price: number;
  discountPercentage?: number;
  tags?: string[];
  isNew?: boolean;
}

// Fetch Products from Sanity
const fetchProducts = async (sort: string, page: number, limit: number): Promise<Product[]> => {
  try {
    let orderQuery = "_createdAt desc"; // Default sorting
    if (sort === "priceLowToHigh") orderQuery = "price asc";
    if (sort === "priceHighToLow") orderQuery = "price desc";
    if (sort === "newest") orderQuery = "_createdAt desc";

    const query = `*[_type == "product"] | order(${orderQuery}) [${(page - 1) * limit}...${page * limit}] {
      _id, title, description, productImage, price, discountPercentage, tags, isNew
    }`;

    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const Shop: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("default");
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts(sort, page, 16).then(setProducts);
  }, [page, sort]);

  const handleAddToCart = (product: Product) => {
    if (typeof window !== "undefined") {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item: Product) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      router.push("/cart");
    }
  };

  return (
    <div>
      {/* Shop Page Banner */}
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-200 flex items-center justify-center overflow-hidden">
        <Image
          src="/shop/shop-hero.png"
          alt="Shop Banner"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl sm:text-5xl font-bold">Discover Our Latest Collection</h1>
          <p className="mt-2 text-lg sm:text-xl">Shop the best products at amazing prices.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-3 bg-golden text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition"
          >
            Explore Now
          </button>
        </div>
      </section>

      {/* Product List & Filters */}
      <section className="min-h-full w-full flex flex-col bg-white items-center py-8">
        <div className="flex justify-between items-center w-full max-w-screen-lg mb-6 px-4">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md"
          >
            <option value="default">Default</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>

          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-golden"}`}
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </button>
            <button
              className={`px-4 py-2 rounded ${products.length < 16 ? "bg-gray-400 cursor-not-allowed" : "bg-golden"}`}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={products.length < 16}
            >
              Next
            </button>
          </div>
        </div>

        {/* Product List */}
        <ShopProductList products={products} onAddToCart={handleAddToCart} />
      </section>

      {/* Customer Care Section */}
      <CustomerCare />
    </div>
  );
};

export default Shop;

