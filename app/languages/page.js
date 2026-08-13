import { LANGUAGES } from "@/lib/utils/languages";
import { LanguageCard } from "@/components/ui/LanguageCard";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Languages",
  description: "Explore books in English, Bengali, Spanish, Arabic, Japanese and more.",
};

export default function LanguagesPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="font-sans text-4xl font-semibold tracking-tight text-foreground">Languages</h1>
      <p className="mt-3 max-w-2xl text-foreground-secondary">
        Omni Library is built to surface literature beyond a single language or market.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {LANGUAGES.map((language) => (
          <LanguageCard key={language.code} language={language} />
        ))}
      </div>
    </Container>
  );
}
