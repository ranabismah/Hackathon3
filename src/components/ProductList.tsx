"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

// Define Product interface
interface Product {
  _id: string;
  title: string;
  description: string;
  productImage: string;
  price: number;
  discountPercentage?: number;
  tags?: string[];
  isNew?: boolean;
}

// Sanity Image URL Builder
const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source).url();

// Fetch products from Sanity
const fetchProducts = async () => {
  const query = `*[_type == "product"] | order(_createdAt desc) [0...8] {
    _id,
    title,
    description,
    productImage,
    price,
    discountPercentage,
    tags,
    isNew
  }`;
  return await client.fetch(query);
};

// Product List Component
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: Product) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
        image: urlFor(product.productImage),
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/cart");
  };

  return (
    <section className="py-10 px-4 flex items-center justify-center w-full bg-background overflow-hidden">
      <div className="w-full max-w-screen-lg flex flex-col items-center space-y-8 box-border">
        <h1 className="text-4xl font-bold text-myblack text-center">
          Our Products
        </h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-full">
            {products.map((product) => (
              <div
                key={product._id}
                className="relative border border-gray-200 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              >
                {/* Image Container with Hover Effect */}
                <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 group">
                  <Image
                    src={urlFor(product.productImage)}
                    alt={product.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  {/* Tags */}
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs rounded-md">
                      New
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded-md">
                      {product.discountPercentage}% Off
                    </span>
                  )}

                  {/* Hover Effect Only on Image */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-myblack">
                    {product.title}
                  </h2>
                  <p className="text-sm text-mygray line-clamp-3">
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-semibold text-myblack">
                      Rp {product.price.toLocaleString()}
                    </span>
                    {product.discountPercentage && (
                      <span className="line-through text-sm text-mygray">
                        Rp{" "}
                        {(
                          product.price /
                          (1 - product.discountPercentage / 100)
                        ).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <Button
            variant="products"
            size="xs"
            className="bg-golden text-white hover:bg-golden/80 mt-6"
          >
            Show More
          </Button>
        )}
      </div>
    </section>
  );
};

export default ProductList;
