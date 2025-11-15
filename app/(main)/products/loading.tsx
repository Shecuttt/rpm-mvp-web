import PageNameSkeleton from "@/components/skeletons/page-name-skeleton";
import ProductsSkeleton from "@/components/skeletons/products-skeleton";

export default function Loading() {
  return (
    <section className="container mx-auto py-8">
      <PageNameSkeleton />
      <ProductsSkeleton />
    </section>
  );
}
