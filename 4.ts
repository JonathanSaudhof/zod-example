// Pokemon List
// https://pokeapi.co/api/v2/pokemon

// Pokemon Details
// https://pokeapi.co/api/v2/pokemon/1

// https://zod.dev/

import { z } from "zod";

///////////////////////////////////////////
// Schemas and Types
///////////////////////////////////////////

const PokemonListItemSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const PokemonListSchema = z.array(PokemonListItemSchema);

type TPokemonList = z.infer<typeof PokemonListSchema>;

const PokemonSchema = z.object({
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  types: z.array(z.string()),
});

const PokemonDetailsSchema = z
  .object({
    name: z.string(),
    height: z.number(),
    weight: z.number(),
    types: z.array(
      z.object({
        slot: z.number(),
        type: z.object({
          name: z.string(),
          url: z.string(),
        }),
      })
    ),
  })
  .transform((data) => ({
    name: data.name,
    height: data.height,
    weight: data.weight,
    types: data.types.map((type) => type.type.name),
  }))
  .pipe(PokemonSchema);

type TPokemonDetails = z.infer<typeof PokemonDetailsSchema>;

type TPokemon = z.infer<typeof PokemonSchema>;

///////////////////////////////////////////
// Database
///////////////////////////////////////////

const pokemonDeck: TPokemon[] = [];

///////////////////////////////////////////
// Backend
///////////////////////////////////////////

const addPokemonToDeck = (pokemon: any) => {
  pokemonDeck.push(PokemonSchema.parse(pokemon));
};

const getPokemonList = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon");

  const data = await response.json();

  return data.results as TPokemonList;
};

const getPokemonDetails = async (url: string) => {
  const response = await fetch(url);

  const data = await response.json();

  return data as TPokemonDetails;
};

///////////////////////////////////////////
// Frontend
///////////////////////////////////////////

const frontend = async () => {
  const pokemonList = await getPokemonList();

  // we display the list of pokemon
  console.log(PokemonListSchema.parse(pokemonList));

  // we click on the first item of our list
  const selectedPokemonFromList = pokemonList[0]!;

  // we get the details of the pokemon

  const pokemonDetails = await getPokemonDetails(selectedPokemonFromList.url);

  // we map the details of the pokemon
  const mappedPokemonDetails = PokemonDetailsSchema.parse(pokemonDetails);

  // we display the details of the pokemon
  console.log(mappedPokemonDetails);

  // we add the pokemon to our deck
  addPokemonToDeck(mappedPokemonDetails);

  // look into the database
  console.log(pokemonDeck);
};

frontend();
