import { BookCard } from "@/components/books/BookCard";
import { cn } from "@/lib/utils/cn";

export function BookGrid({ books = [], className }) {
  return (
    <div className={cn("grid grid-cols-2 items-stretch gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6", className)}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} className="w-full" />
      ))}
    </div>
  );
}
