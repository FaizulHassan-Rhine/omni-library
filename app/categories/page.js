import { CATEGORIES } from "@/lib/utils/categories";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Categories",
  description: "Browse Omni Library by genre, subject and literary tradition.",
};

export default function CategoriesPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="font-sans text-4xl font-semibold tracking-tight text-foreground">Categories</h1>
      <p className="mt-3 max-w-2xl text-foreground-secondary">
        Move through fiction, history, science and the classics — each collection draws from open library catalogs.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </Container>
  );
}
