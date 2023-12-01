import { Suspense } from "react";
import PokemonDetail, { PokemonDetailSkeleton } from "./PokemonDetail";

export type TPokemonResult = {
  name: string;
  url: string;
};

export type TPokemonListItem = {
  id: number;
} & TPokemonResult;

const getPokemonId = (url: string | string[]): number => {
  const spittedUrl = Array.isArray(url) ? url : url.split("/");

  const parsedId = parseInt(spittedUrl.pop() as string, 10);

  return parsedId || getPokemonId(spittedUrl);
};

const fetchPokemon = async (): Promise<TPokemonListItem[]> => {
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
  const pokemon = await fetchPokemon();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div className="grid grid-cols-3 gap-4 pb-8">
      {pokemon &&
        pokemon.map((pokemon) => (
          <Suspense
            key={pokemon.id}
            fallback={<PokemonDetailSkeleton name={pokemon.name} />}
          >
            <PokemonDetail id={pokemon.id} />
          </Suspense>
        ))}
    </div>
  );
};

export default PokemonList;
