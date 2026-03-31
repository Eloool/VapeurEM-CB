const View = require('./View');

class EditorView extends View {
    constructor() {
        super('editor', 'Éditeurs');
    }

    /**
     * Affiche la liste des éditeurs et optionnellement les jeux d'un éditeur
     * @param {Object} res - Réponse Express
     * @param {Array} editors - Liste des éditeurs
     * @param {Array|null} games - Jeux de l'éditeur sélectionné (optional)
     */
    displayEditors(res, editors, games = null) {
        this.render(res, { editors, games });
    }

    /**
     * Affiche la liste avec confirmation d'ajout
     * @param {Object} res - Réponse Express
     * @param {Array} editors - Liste des éditeurs
     */
    editorAdded(res, editors) {
        this.renderWithStatus(res, { editors }, 201);
    }
}

module.exports = EditorView;
