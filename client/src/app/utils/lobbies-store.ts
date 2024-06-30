import { Player } from '@/app/utils/playerInterface';

export const lobbies = new Map<string, { players: Player[] }>();

// Add a new lobby
export function addLobby(lobbyId: string, player: Player) {
    lobbies.set(lobbyId, { players: [player] });
}

// Remove a lobby
export function removeLobby(lobbyId: string) {
    lobbies.delete(lobbyId);
}

// Get a lobby
export function getLobby(lobbyId: string) {
    return lobbies.get(lobbyId);
}

// List all lobbies
export function listLobbies() {
    return Array.from(lobbies.entries());
}
