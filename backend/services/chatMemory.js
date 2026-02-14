const memoria = {};
const maxMensagem = 5;

export const Memoria = {
    addMessage(userID, role, content) {
        if(!memoria[userID]) memoria[userID] = [];
        memoria[userID].push({ role, content })

        if(memoria[userID].length > maxMensagem * 2) {
            memoria[userID] = memoria[userID].slice(-maxMensagem * 2);
        }
    },
    getHistorico(userID) {
        return memoria[userID] || [];
    },

    limparHistorico(userID) {
        memoria[userID] = []
    }
}