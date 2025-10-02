import React from "react";
import ProductsList from "@/src/components/ProductsList";

const Home = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="latest" className="pb-12">
        <h2 id="latest" className="mb-6 text-heading-3 text-dark-900">
          Nike Collection
        </h2>
        <ProductsList />
      </section>
    </main>
  );
};

export default Home;
