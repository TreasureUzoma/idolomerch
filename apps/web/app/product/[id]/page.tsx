import Image from "next/image";
import productData from "../../../data/dummy-products.json";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
};

const getProductById = (id: string) => productData.find((p) => p.id === id);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductById(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist.",
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}

export default function Page({ params }: Props) {
  const product = getProductById(params.id);

  if (!product) {
    return (
      <div className="py-7 px-4 md:px-[5rem] mb-7">
        <h2 className="text-xl font-bold mb-6">Product Not Found</h2>
      </div>
    );
  }

  return (
    <div className="py-7 px-4 md:px-[5rem] mb-7">
      <h2 className="text-xl font-bold mb-6">{product.title}</h2>
      <p className="text-gray-700">{product.description}</p>
      <div className="mt-4 max-w-md w-full rounded-2xl overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          width={500}
          height={500}
          className="rounded-2xl object-cover w-full h-auto"
        />
      </div>
    </div>
  );
}
