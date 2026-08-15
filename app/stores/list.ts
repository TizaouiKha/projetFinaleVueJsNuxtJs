import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useListStore = defineStore('list', () => {
  const home = reactive({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    searchQuery: '',
    selectedType: null as string | null,
  })

  const type = reactive({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    searchQuery: '',
    selectedType: null as string | null,
  })

  return {
    home,
    type,
  }
})