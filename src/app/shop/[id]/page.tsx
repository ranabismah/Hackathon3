"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import ShopProductList from "@/components/ShopProductList";
import Loader from "@/components/Loader";

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

const builder = imageUrlBuilder(client);
const urlFor = (source?: { asset?: { _ref?: string } }) => 
  source?.asset?._ref ? builder.image(source.asset._ref).width(500).height(500).url() : "/fallback.jpg";

const ProductDetails = () => {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid product ID.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching product with ID:", id);

        // Fetch product data
        const query = `*[_type == "product" && _id == $id][0]`;
        const fetchedProduct = await client.fetch(query, { id });

        console.log("Fetched product:", fetchedProduct);

        if (!fetchedProduct) {
          setError("Product not found.");
          setLoading(false);
          return;
        }

        setProduct(fetchedProduct);

        // Fetch related products
        if (fetchedProduct?.tags?.length > 0) {
          const relatedQuery = `*[_type == "product" && _id != $id && $tag in tags] | order(_createdAt desc) [0...4]`;
          const fetchedRelated = await client.fetch(relatedQuery, { id, tag: fetchedProduct.tags[0] });
          setRelatedProducts(fetchedRelated);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center text-xl py-20"><Loader/></div>;
  if (error) return <div className="text-center text-xl py-20 text-red-600">{error}</div>;
  if (!product) return <div className="text-center text-xl py-20">Product not found.</div>;

  return (
    <div className="max-w-screen-lg mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-10">
        <Image
          src={urlFor(product.productImage)}
          alt={product.title}
          width={500}
          height={500}
          className="w-full md:w-1/2 object-cover rounded-lg shadow-lg"
          unoptimized
        />
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-lg text-gray-700">{product.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">Rp {product.price.toLocaleString()}</span>
            {product.discountPercentage && (
              <span className="line-through text-gray-500">
                Rp {(product.price / (1 - product.discountPercentage / 100)).toLocaleString()}
              </span>
            )}
          </div>
          <button className="bg-golden px-6 py-3 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Related Products</h2>
        <ShopProductList products={relatedProducts} onAddToCart={() => {}} />
      </div>
    </div>
  );
};

export default ProductDetails;
