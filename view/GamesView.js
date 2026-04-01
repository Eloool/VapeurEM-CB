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
    displayGamesList(res, games, editor, genre) {
        this.render(res, { games, editor, genre });
    }

    /**
     * Affiche un message de succès après ajout
     * @param {Object} res - Réponse Express
     * @param {Array} games - Liste des jeux
     * @param {Array} editor - Liste des éditeurs
     * @param {Array} genre - Liste des genres
     */
    gameAdded(res, games, editor, genre) {
        this.renderWithStatus(res, { games, editor, genre }, 201);
    }
}

module.exports = GamesView;
