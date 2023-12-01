import { TPokemonListItem } from "./PokemonList";

type TPokemonDetail = {
  name: string;
  url: string;
  weight: number;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  sprites: {
    front_default: string;
    back_default: string;
  };
};

const fetchPokemonDetail = async (id: number) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  const data = (await response.json()) as TPokemonDetail;

  return data;
};

const PokemonDetail = async ({ id }: TPokemonListItem) => {
  const pokemonDetail = await fetchPokemonDetail(id);

  return (
    <div className="flex h-auto w-full gap-4 rounded border border-teal-800 p-4 shadow-lg hover:bg-teal-300 hover:bg-opacity-80">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold capitalize">{pokemonDetail.name}</h2>
        <img
          width={200}
          height={200}
          src={pokemonDetail.sprites.front_default}
          alt={pokemonDetail.name}
        />
      </div>
      <div className="flex flex-col gap-4">
        <p>Weight: {pokemonDetail.weight}</p>
        <h3>Abilities</h3>
        <ul className="ml-4 list-disc">
          {pokemonDetail.abilities.map((ability) => (
            <li key={ability.ability.name}>{ability.ability.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const PokemonDetailSkeleton: React.FC<{ name?: string }> = ({
  name,
}) => {
  return (
    <div className="flex h-auto w-full gap-4 rounded border border-teal-800 p-4 shadow-lg hover:bg-teal-300 hover:bg-opacity-80">
      <div className="flex flex-col gap-4">
        {name ? (
          <h2 className="text-xl font-bold capitalize">{name}</h2>
        ) : (
          <div className="h-4 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        )}
        <div className="h-[200px] w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="ml-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="ml-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="ml-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export default PokemonDetail;
