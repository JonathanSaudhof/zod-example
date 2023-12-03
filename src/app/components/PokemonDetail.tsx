import { z } from "zod";
import { TPokemonListItem } from "./PokemonList";

const PokemonDetailViewSchema = z.object({
  name: z.string(),
  weight: z.number(),
  abilities: z.array(z.string()),
  frontImage: z.string(),
  backImage: z.string(),
  height: z.number().positive(),
});

const PokemonDetailSchema = z.promise(
  z
    .object({
      name: z.string(),
      // url: z.string(),
      weight: z.number().positive(),
      height: z.number().positive(),
      abilities: z.array(
        z.object({
          ability: z.object({
            name: z.string(),
            url: z.string(),
          }),
          is_hidden: z.boolean(),
          slot: z.number(),
        }),
      ),
      sprites: z.object({
        front_default: z.string(),
        back_default: z.string(),
      }),
    })
    .transform((data) => {
      return {
        name: data.name,
        weight: data.weight,
        height: data.height,
        abilities: data.abilities.map((ability) => ability.ability.name),
        frontImage: data.sprites.front_default,
        backImage: data.sprites.back_default,
      };
    })
    .pipe(PokemonDetailViewSchema),
);

// type TPokemonDetail = z.infer<typeof PokemonDetailSchema>;

const fetchPokemonDetail = async (id: number) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

  const data = await PokemonDetailSchema.parseAsync(response.json());

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
          src={pokemonDetail.frontImage}
          alt={pokemonDetail.name}
        />
      </div>
      <div className="flex flex-col gap-4">
        <p>Weight: {pokemonDetail.weight}</p>
        <p>Height: {pokemonDetail.height}</p>
        <h3>Abilities</h3>
        <ul className="ml-4 list-disc">
          {pokemonDetail.abilities.map((ability, index) => (
            <li key={`${ability}-${index}`}>{ability}</li>
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
          <div className="h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        )}
        <div className="h-[200px] w-[200px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="ml-4 h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="ml-4 h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="ml-4 h-2.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export default PokemonDetail;
