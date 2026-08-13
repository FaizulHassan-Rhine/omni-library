import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import {
  TrendingSection,
  CategoriesSection,
  AuthorsSection,
  FreeBooksSection,
  LanguagesSection,
  ClassicsSection,
  RecentSection,
  HomeSectionsFallback,
} from "@/components/home/HomeSections";
import { Container } from "@/components/ui/Container";

export const maxDuration = 30;

export default function HomePage() {
  return (
    <>
      <Hero />
      <Container className="space-y-16 pb-20 sm:space-y-20">
        <Suspense fallback={<HomeSectionsFallback />}>
          <TrendingSection />
        </Suspense>
        <CategoriesSection />
        <Suspense fallback={<HomeSectionsFallback />}>
          <AuthorsSection />
        </Suspense>
        <Suspense fallback={<HomeSectionsFallback />}>
          <FreeBooksSection />
        </Suspense>
        <LanguagesSection />
        <Suspense fallback={<HomeSectionsFallback />}>
          <ClassicsSection />
        </Suspense>
        <Suspense fallback={<HomeSectionsFallback />}>
          <RecentSection />
        </Suspense>
      </Container>
    </>
  );
}
