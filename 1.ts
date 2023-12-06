// Pokemon List
// https://pokeapi.co/api/v2/pokemon

// Pokemon Details
// https://pokeapi.co/api/v2/pokemon/1

///////////////////////////////////////////
// Types
///////////////////////////////////////////

type TPokemonListItem = {
  name: string;
  url: string;
};

type TPokemonList = TPokemonListItem[];

// type for our details page
// external api
type TPokemonDetails = {
  name: string;
  height: number;
  weight: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
};

// type for our pokemon entity in the database
// internal api
type TPokemon = {
  name: string;
  height: number;
  weight: number;
  types: string[];
};

///////////////////////////////////////////
// Database
///////////////////////////////////////////

const pokemonDeck: TPokemon[] = [];

///////////////////////////////////////////
// Backend
///////////////////////////////////////////

const addPokemonToDeck = (pokemon: any) => {
  pokemonDeck.push(pokemon);
};

///////////////////////////////////////////
// Frontend
///////////////////////////////////////////

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

const mapPokemonDetailsToPokemon = (
  pokemonDetails: TPokemonDetails
): TPokemon => {
  return {
    name: pokemonDetails.name,
    height: pokemonDetails.height,
    weight: pokemonDetails.weight,
    types: pokemonDetails.types.map((type) => type.type.name),
  };
};

const frontend = async () => {
  const pokemonList = await getPokemonList();

  // we display the list of pokemon
  console.log(pokemonList);

  // we click on the first item of our list
  const selectedPokemonFromList = pokemonList[0]!;

  // we get the details of the pokemon

  const pokemonDetails = await getPokemonDetails(selectedPokemonFromList.url);

  // console.log(pokemonDetails);

  // we map the details of the pokemon
  const mappedPokemonDetails = mapPokemonDetailsToPokemon(pokemonDetails);

  // we display the details of the pokemon
  console.log(mappedPokemonDetails);

  // we add the pokemon to our deck
  addPokemonToDeck(mappedPokemonDetails);
};

frontend();
