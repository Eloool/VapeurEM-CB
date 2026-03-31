const express = require("express");
const router = express.Router();

const InfoGameView = require("./view/InfoGameView");
const infoGameView = new InfoGameView();
const gamesChecking = require("./service/gamesChecking");

//Affichage d'un jeu en particulier
router.get("/", async (req, res) => {
    const { id } = req.query;
    try {
        if (!id || isNaN(parseInt(id, 10))) {
            return infoGameView.invalidRequest(res);
        }

        const {game, editor, genre} = await gamesChecking.getGameInfo(parseInt(id, 10));
        if (!game) {
            return infoGameView.gameNotFound(res);
        }
        infoGameView.displayGameInfo(res, game, editor, genre);
    } catch (error) {
        console.error("Erreur lors de la récupération du jeu :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});
module.exports = router;
