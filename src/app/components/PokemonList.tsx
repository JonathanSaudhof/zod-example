import { Suspense } from "react";
import { z } from "zod";
import PokemonDetail, { PokemonDetailSkeleton } from "./PokemonDetail";

const PokemonResultItemSchema = z.object({ name: z.string(), url: z.string() });

const PokemonResultSchema = z.array(PokemonResultItemSchema);

// export type TPokemonResult = {
//   name: string;
//   url: string;
// };

type TPokemonResult = z.infer<typeof PokemonResultItemSchema>;

const PokemonResultListSchema = z.array(
  PokemonResultItemSchema.extend({ id: z.number() }),
);

// export type TPokemonListItem = {
//   id: number;
// } & TPokemonResult;

type TPokemonList = z.infer<typeof PokemonResultListSchema>;

const getPokemonId = (url: string | string[]): number => {
  const spittedUrl = Array.isArray(url) ? url : url.split("/");

  const parsedId = parseInt(spittedUrl.pop() as string, 10);

  return parsedId || getPokemonId(spittedUrl);
};

const fetchPokemonList = async (): Promise<TPokemonList> => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon");
  const data = (await response.json()) as { results: TPokemonResult[] };

  const pokemonList = data.results.map((pokemon, index) => {
    return {
      ...pokemon,
      id: getPokemonId(pokemon.url),
    };
  });

  return pokemonList;
};

const PokemonList = async () => {
  const pokemon = await fetchPokemonList();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div className="grid grid-cols-3 gap-4 pb-8">
      {pokemon &&
        pokemon.map((pokemon) => (
          <Suspense
            key={pokemon.id}
            fallback={<PokemonDetailSkeleton name={pokemon.name} />}
          >
            <PokemonDetail {...pokemon} />
          </Suspense>
        ))}
    </div>
  );
};

export default PokemonList;
