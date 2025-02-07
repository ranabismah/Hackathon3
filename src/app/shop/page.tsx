"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ShopProductList from "@/components/ShopProductList";
import CustomerCare from "@/components/CustomerCare";
import Image from "next/image";
import { client } from "@/sanity/lib/client";

const Shop: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [showCount, setShowCount] = useState<number>(16); // Products per page
  const [sort, setSort] = useState<string>("default");
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      let orderQuery = "_createdAt desc"; // Default sorting
      if (sort === "priceLowToHigh") orderQuery = "price asc";
      if (sort === "priceHighToLow") orderQuery = "price desc";
      if (sort === "newest") orderQuery = "_createdAt desc";

      const query = `*[_type == "product"] | order(${orderQuery}) [${(page - 1) * showCount}...${page * showCount}] {
        _id, title, description, productImage, price, discountPercentage, tags, isNew
      }`;
      const fetchedProducts = await client.fetch(query);
      setProducts(fetchedProducts);

      const totalQuery = `count(*[_type == "product"])`;
      const totalCount = await client.fetch(totalQuery);
      setTotalProducts(totalCount);
    };

    fetchProducts();
  }, [page, showCount, sort]);

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
              className={`px-4 py-2 rounded ${
                products.length < showCount ? "bg-gray-400 cursor-not-allowed" : "bg-golden"
              }`}
              onClick={() => setPage((prev) => prev + 1)}
              disabled={products.length < showCount}
            >
              Next
            </button>
          </div>
        </div>

        <ShopProductList products={products} onAddToCart={() => {}} />
      </section>

      {/* Customer Care Section */}
      <CustomerCare />
    </div>
  );
};

export default Shop;
