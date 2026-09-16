export class DiversityGuards {
    static isMMR(diversity) {
        return diversity?.type === 'mmr';
    }
}
