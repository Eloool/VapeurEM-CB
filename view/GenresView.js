const View = require('./View');

class GenresView extends View {
    constructor() {
        super('genres', 'Genres');
    }

    /**
     * Affiche la liste des genres et optionnellement les jeux d'un genre
     * @param {Object} res - Réponse Express
     * @param {Array} genres - Liste des genres
     * @param {Array|null} gamesWithGenre - Jeux du genre sélectionné (optional)
     */
    displayGenres(res, genres, gamesWithGenre = null, options = {}) {
        this.render(res, { genres, gamesWithGenre, ...options });
    }
}

module.exports = GenresView;
