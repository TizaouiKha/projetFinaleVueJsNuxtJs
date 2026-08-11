import { ref } from 'vue';
import type { Team } from '../types/team';
import type { Pokemon } from '../types/pokemon';

export function useTeam() {
    const allTeams = useState<Team[]>('allTeams', () => []);
    const saveMessage = ref('');
    const deleteMessage = ref('');
    const saving = ref(false);

    const fetchTeams = async () => {
        try {
            const response = await fetch('/api/team');

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des équipes');
            }

            allTeams.value = await response.json();
        } catch (err) {
            console.error(err);
        }
    };

    const saveTeam = async (team: Pokemon[]) => {
        if (team.length === 0) {
            saveMessage.value = 'Pas de pokemons dans l\'équipe à sauvegarder.';
            return false;
        }

        saving.value = true;
        saveMessage.value = '';

        try {
            const result = await $fetch('/api/team', {
                method: 'POST',
                body: {
                    pokemons: team.map((pokemon) => String(pokemon.name)),
                },
            }) as { success?: boolean; error?: string };

            if (result?.success) {
                saveMessage.value = 'Équipe sauvegardée avec succès.';
                await fetchTeams();
                return true;
            }

            saveMessage.value = result?.error ?? 'Erreur lors de la sauvegarde.';
            return false;
        } catch (err) {
            console.error(err);
            saveMessage.value = 'Erreur lors de la sauvegarde.';
            return false;
        } finally {
            saving.value = false;
        }
    };

    const deleteTeam = async (teamId: number) => {
        try {
            await $fetch(`/api/team/${teamId}`, {
                method: 'DELETE',
            });

            await fetchTeams();
            deleteMessage.value = `L'equipe n°${teamId} a été supprimée avec succès.`;
        } catch (err) {
            console.error(err);
            deleteMessage.value = `Erreur lors de la suppression de l'équipe`;
        }
    };

    return {
        allTeams,
        fetchTeams,
        saveTeam,
        deleteTeam,
        saveMessage,
        deleteMessage,
        saving,
    };
}