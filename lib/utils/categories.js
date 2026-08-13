export const CATEGORIES = [
  { slug: "fiction", name: "Fiction", query: "fiction", icon: "book-open", description: "Stories that invent worlds, people and possibilities." },
  { slug: "fantasy", name: "Fantasy", query: "fantasy", icon: "sparkles", description: "Magic, myth and journeys beyond the ordinary." },
  { slug: "science-fiction", name: "Science Fiction", query: "science_fiction", icon: "rocket", description: "Future worlds, technology and speculative ideas." },
  { slug: "mystery", name: "Mystery", query: "mystery", icon: "search", description: "Clues, secrets and the pleasure of unraveling a plot." },
  { slug: "romance", name: "Romance", query: "romance", icon: "heart", description: "Love stories across eras, cultures and forms." },
  { slug: "history", name: "History", query: "history", icon: "landmark", description: "Civilizations, memory and the making of the present." },
  { slug: "philosophy", name: "Philosophy", query: "philosophy", icon: "brain", description: "Questions of meaning, ethics, mind and knowledge." },
  { slug: "science", name: "Science", query: "science", icon: "atom", description: "Discovery, nature and how the world works." },
  { slug: "technology", name: "Technology", query: "technology", icon: "cpu", description: "Computing, invention and the tools that reshape life." },
  { slug: "biography", name: "Biography", query: "biography", icon: "user", description: "Lives observed, remembered and retold." },
  { slug: "childrens", name: "Children's", query: "juvenile_literature", icon: "baby", description: "Picture books, adventures and stories to grow with." },
  { slug: "classics", name: "Classics", query: "classics", icon: "scroll", description: "Works that continue to be read across generations." },
];

export function getCategory(slug) {
  return CATEGORIES.find((item) => item.slug === slug);
}

export const FEATURED_AUTHORS = [
  "J.R.R. Tolkien",
  "Jane Austen",
  "William Shakespeare",
  "Agatha Christie",
  "Gabriel García Márquez",
  "Haruki Murakami",
  "Rabindranath Tagore",
  "Chinua Achebe",
];

export const SITE = {
  name: "Omni Library",
  tagline: "Find your next great read.",
  description:
    "Search millions of books, authors, editions, languages, classics and freely available literature from libraries and open collections around the world.",
  url: "https://omnilibrary.app",
};
