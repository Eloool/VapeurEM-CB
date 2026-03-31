const View = require('./View');

class GamesView extends View {
    constructor() {
        super('games', 'Tous les Jeux');
    }

    /**
     * Affiche la liste des jeux avec les éditeurs et genres
     * @param {Object} res - Réponse Express
     * @param {Array} games - Liste des jeux
     * @param {Array} editors - Liste des éditeurs
     * @param {Array} genres - Liste des genres
     */
    displayGamesList(res, games, editors, genres) {
        this.render(res, { games, editors, genres });
    }

    /**
     * Affiche un message de succès après ajout
     * @param {Object} res - Réponse Express
     * @param {Array} games - Liste des jeux
     * @param {Array} editors - Liste des éditeurs
     * @param {Array} genres - Liste des genres
     */
    gameAdded(res, games, editors, genres) {
        this.renderWithStatus(res, { games, editors, genres }, 201);
    }
}

module.exports = GamesView;
