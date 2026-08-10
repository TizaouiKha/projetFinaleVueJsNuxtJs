import { ref } from 'vue'

export function useTypeDetails() {
    const typeDetails = ref<any>(null)

    const fetchTypeDetails = async (typeName: string) => {
        try {
            const normalizedType = typeName.toLowerCase().trim()
            const response = await fetch(`https://pokeapi.co/api/v2/type/${encodeURIComponent(normalizedType)}`)
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des détails du type')
            }
            typeDetails.value = await response.json()
        } catch (err) {
            console.error(err)
            typeDetails.value = null
        }
    }

    return {
        typeDetails,
        fetchTypeDetails
    }
}