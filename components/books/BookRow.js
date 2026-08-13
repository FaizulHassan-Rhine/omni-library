import { BookCard } from "@/components/books/BookCard";
import { cn } from "@/lib/utils/cn";

export function BookRow({ books = [], className }) {
  return (
    <div className={cn("-mx-4 overflow-x-auto px-4 pb-2 scrollbar-thin sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8", className)}>
      <div className="flex snap-x items-stretch gap-4 sm:gap-5">
        {books.map((book) => (
          <div key={book.id} className="flex snap-start">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}
