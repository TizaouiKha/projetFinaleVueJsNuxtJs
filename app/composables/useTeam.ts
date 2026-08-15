import { ref } from 'vue';
import type { Team } from '../types/team';
import type { Pokemon } from '../types/pokemon';
import { useLocale } from './useLocale';

export function useTeam() {
    const allTeams = useState<Team[]>('allTeams', () => []);
    const saving = useState<boolean>('teamSaving', () => false);
    const loading = useState<boolean>('teamsLoading', () => false);
    const saveMessage = ref('');
    const deleteMessage = ref('');
    const fetchError = ref('');

    const { t } = useLocale();

    const fetchTeams = async () => {
        loading.value = true;
        fetchError.value = '';

        try {
            const response = await fetch('/api/team');

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des équipes');
            }

            allTeams.value = await response.json();
        } catch (err) {
            console.error(err);
            fetchError.value = t('fetch_teams_error');
        } finally {
            loading.value = false;
        }
    };

    const saveTeam = async (team: Pokemon[], name?: string) => {
        if (team.length === 0) {
            saveMessage.value = t('team_save_empty');
            return false;
        }

        saving.value = true;
        saveMessage.value = '';

        try {
            const result = await $fetch('/api/team', {
                method: 'POST',
                body: {
                    pokemons: team.map((pokemon) => String(pokemon.name)),
                    name: name || undefined,
                },
            }) as { success?: boolean; error?: string };

            if (result?.success) {
                saveMessage.value = t('team_save_success');
                await fetchTeams();
                return true;
            }

            saveMessage.value = result?.error ?? t('team_save_error');
            return false;
        } catch (err) {
            console.error(err);
            saveMessage.value = t('team_save_error');
            return false;
        } finally {
            saving.value = false;
        }
    };

    const updateTeam = async (teamId: number, team: Pokemon[], name?: string) => {
        if (team.length === 0) {
            saveMessage.value = t('team_save_empty');
            return false;
        }

        saving.value = true;
        saveMessage.value = '';

        try {
            const result = await $fetch(`/api/team/${teamId}`, {
                method: 'PATCH',
                body: {
                    pokemons: team.map((pokemon) => String(pokemon.name)),
                    name: name || null,
                },
            }) as { success?: boolean; error?: string };

            if (result?.success) {
                saveMessage.value = t('team_update_success');
                await fetchTeams();
                return true;
            }

            saveMessage.value = result?.error ?? t('team_update_error');
            return false;
        } catch (err) {
            console.error(err);
            saveMessage.value = t('team_update_error');
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
            deleteMessage.value = t('team_delete_success', teamId);
        } catch (err) {
            console.error(err);
            deleteMessage.value = t('team_delete_error');
        }
    };

    return {
        allTeams,
        fetchTeams,
        saveTeam,
        updateTeam,
        deleteTeam,
        saveMessage,
        deleteMessage,
        saving,
        loading,
        fetchError,
    };
}
