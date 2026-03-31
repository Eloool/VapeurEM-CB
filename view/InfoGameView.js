const View = require('./View');

class InfoGameView extends View {
    constructor() {
        super('infogame', 'Détails du Jeu');
    }

    /**
     * Affiche les détails d'un jeu spécifique
     * @param {Object} res - Réponse Express
     * @param {Object} game - Jeu à afficher
     * @param {Array} editors - Liste des éditeurs
     * @param {Array} genres - Liste des genres
     */
    displayGameInfo(res, game, editors, genres) {
        this.render(res, { game, editors, genres });
    }

    /**
     * Affiche un jeu introuvable
     * @param {Object} res - Réponse Express
     */
    gameNotFound(res) {
        res.status(404).send('Jeu introuvable');
    }

    /**
     * Affiche une erreur (ID invalide, etc.)
     * @param {Object} res - Réponse Express
     * @param {String} message - Message d'erreur
     */
    invalidRequest(res, message = 'ID invalide ou manquant') {
        res.status(400).json({ error: message });
    }
}

module.exports = InfoGameView;
