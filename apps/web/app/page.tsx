import { Hero } from "../components/hero";
import Products from "../components/products";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Products />
    </div>
  );
}
