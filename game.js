const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
//Affichage d'un jeu en particulier
router.get("/", async (req, res) => {
    const { id } = req.query;
    try {
        if (!id || isNaN(parseInt(id, 10))) {
            return res.status(400).json({ error: "ID invalide ou manquant" });
        }

        const game = await prisma.games.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                editor: true,
                genre: true,
            },
        });

        if (!game) {
            return res.status(404).send("Jeu introuvable");
        }
        const editor = await prisma.Editors.findMany();
        const genre = await prisma.Genres.findMany();
        res.render("infogame", { game, editor, genre});
    } catch (error) {
        console.error("Erreur lors de la récupération du jeu :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});
module.exports = router;
