export const usePokeApi = () => {
  const config = useRuntimeConfig();

  const pokeApi = $fetch.create({
    baseURL: config.public.pokeApiBase as string,

    onRequestError({ error }) {
      console.error('Error fetching PokeAPI data:', error);
    },

    onResponseError({ response }) {
      console.error('Error response from PokeAPI:', response);
    }
  });
  return { pokeApi }
}
