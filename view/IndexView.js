const View = require('./View');

class IndexView extends View {
    constructor() {
        super('index', 'Jeux Favoris');
    }

    /**
     * Affiche la liste des jeux favorisés
     * @param {Object} res - Réponse Express
     * @param {Array} games - Liste des jeux favorisés
     */
    displayFavorites(res, games) {
        this.render(res, { games });
    }
}

module.exports = IndexView;
