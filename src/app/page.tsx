import { Suspense } from "react";
import { PokemonDetailSkeleton } from "./components/PokemonDetail";
import PokemonList from "./components/PokemonList";

export default async function HomePage() {
  const ListSkeleton = () =>
    Array.from({
      length: 9,
    }).map(() => <PokemonDetailSkeleton />);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto">
        <h1 className="py-4 text-4xl">Pokemon</h1>

        <Suspense
          fallback={
            <div className="grid grid-cols-3 gap-4">
              <ListSkeleton />
            </div>
          }
        >
          <PokemonList />
        </Suspense>
      </div>
    </main>
  );
}
