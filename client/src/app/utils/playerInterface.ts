export interface Player {
    id: string;
    name: string;
    role: string;
    isAlive: boolean;
    isReady: boolean;
    isHost: boolean;
    isDisconnected: boolean;
}