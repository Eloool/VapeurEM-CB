const View = require('./View');

class NotFoundView extends View {
    constructor() {
        super('404', 'Page non trouvée');
    }

    /**
     * Affiche la page 404
     * @param {Object} res - Réponse Express
     */
    display(res) {
        res.status(404);
        this.render(res, {});
    }
}

module.exports = NotFoundView;
