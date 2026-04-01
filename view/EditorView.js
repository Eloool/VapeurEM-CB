const View = require('./View');

class EditorView extends View {
    constructor() {
        super('editor', 'Éditeurs');
    }

    /**
     * Affiche la liste des éditeurs et optionnellement les jeux d'un éditeur
     * @param {Object} res - Réponse Express
     * @param {Array} editor - Liste des éditeurs
     * @param {Array|null} games - Jeux de l'éditeur sélectionné (optional)
     */
    displayEditors(res, editor, games = null, options = {}) {
        this.render(res, { editor, games, ...options });
    }

    /**
     * Affiche la liste avec confirmation d'ajout
     * @param {Object} res - Réponse Express
     * @param {Array} editor - Liste des éditeurs
     */
    editorAdded(res, editor) {
        this.renderWithStatus(res, { editor }, 201);
    }
}

module.exports = EditorView;
