import { useFetch } from '#app'
import type { Ref } from 'vue'

export function usePokemons() {
  const { data, pending, error, refresh } = useFetch<any[]>('/api/pokemon')

  return {
    pokemons: data as Ref<any[] | null>,
    loading: pending,
    error,
    refresh,
  }
}

export default usePokemons
