export const useListStore = defineStore('list', () => {
    const currentPage = ref(1)
    const itemsPerPage = ref(20)
    const totalItems = ref(0)
    const searchQuery = ref('')
    const selectedType = ref<string | null>(null)

    const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))

    return {
        currentPage,
        itemsPerPage,
        totalItems,
        searchQuery,
        selectedType,
        totalPages,
    }
});