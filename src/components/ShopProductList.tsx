import React from "react";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";

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

interface ShopProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const builder = imageUrlBuilder(client);
const urlFor = (source?: { asset?: { _ref?: string } }) => {
  return source?.asset?._ref ? builder.image(source).width(400).height(400).url() : "/fallback.jpg";
};

const ShopProductList: React.FC<ShopProductListProps> = ({ products, onAddToCart }) => {
  return (
    <section className="py-10 px-4 flex items-center justify-center w-full bg-background overflow-hidden">
      <div className="w-full max-w-screen-lg flex flex-col items-center space-y-8 box-border">
        <h1 className="text-4xl font-bold text-myblack text-center">All Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-full">
          {products.map((product) => (
            <Link key={product._id} href={`/shop/${product._id}`} passHref>
              <div className="cursor-pointer relative border border-gray-200 overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 group">
                  <Image
                    src={urlFor(product.productImage)}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs rounded-md">New</span>
                  )}
                  {product.discountPercentage && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded-md">
                      {product.discountPercentage}% Off
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-semibold text-myblack">{product.title}</h2>
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
                        Rp {(product.price / (1 - product.discountPercentage / 100)).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent Link navigation
                      onAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopProductList;
