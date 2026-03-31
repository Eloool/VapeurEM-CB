class View {
    constructor(template, title = "Vapeur") {
        this.template = template;
        this.title = title;
    }

    /**
     * Rend la vue avec les données fournies
     * @param {Object} res - Objet réponse Express
     * @param {Object} data - Données à passer au template
     */
    render(res, data = {}) {
        const viewData = {
            ...data,
            title: this.title
        };
        res.render(this.template, viewData);
    }

    /**
     * Rend la vue et retourne une réponse avec code de statut
     * @param {Object} res - Objet réponse Express
     * @param {Object} data - Données à passer au template
     * @param {Number} statusCode - Code HTTP (défaut 200)
     */
    renderWithStatus(res, data = {}, statusCode = 200) {
        res.status(statusCode);
        this.render(res, data);
    }
}

module.exports = View;