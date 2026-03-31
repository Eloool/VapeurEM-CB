const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//Affichage de tous les jeux
router.get("/", async (req, res) => {
    const games = await prisma.games.findMany({
        include: {
            editor: true,
            genre: true,
        },
            orderBy: {
                title: "asc",
            },
        });
    const editor = await prisma.Editors.findMany();
    const genre = await prisma.Genres.findMany();
    res.render("games", {
        games,editor,genre
    });
});

//Ajout d'un jeu
router.post("/addgame", async (req, res, next) => {
    const  { jeux, description, date, editor, genre} = req.body;
    if(!editor || !genre || isNaN(parseInt(editor)) || isNaN(parseInt(genre))){
        return res.redirect("/games");
    }
    try {
        await prisma.Games.create({
            data : { title: jeux, description: description, releaseDate: date , genreId: parseInt(genre), editorId: parseInt(editor)}, 
        }); 
        res.status(201).redirect("/games"); 
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Game creation failed" });
    }
});

//Suppression d'un jeu
router.post("/delete", async (req, res, next) => {
    const { id } = req.body;
    try {
        await prisma.Games.delete({
            where: { id: parseInt(id, 10) },
        });
        res.redirect("/games"); 
    } catch (error) {
        console.error("Erreur lors de la suppression du jeu :", error);
        res.status(400).json({ error: "Échec de la suppression de l'éditeur" });
    }
});

//Changement des infos d'un jeu
router.post("/update", async (req, res, next) => {
    const { id, jeux, description, date, editor, genre} = req.body;
    try {
        await prisma.Games.update({
            where: { id: parseInt(id, 10) },
            data : { title: jeux, description: description, releaseDate: date , genreId: parseInt(genre), editorId: parseInt(editor)},
        });
        res.redirect(req.headers.referer || '/');
    } catch (error) {
        console.error("Erreur lors de la modification de l'éditeur :", error);
        res.status(400).json({ error: "Échec de la modification de l'éditeur" });
    }
});

//Change l'etat favorited quand l'appui sur une checkbox
router.post("/favorited", async (req, res, next) => {
    const { id, favorited } = req.body;
    try {
        const favoritedbool = favorited[1] === 'true';
        await prisma.Games.update({
            where: { id: parseInt(id, 10) },
            data: { favorited: favoritedbool },
        });
        res.redirect(req.headers.referer || '/');
    } catch (error) {
        console.error("Erreur lors de la mise à jour du favori :", error);
        res.status(500).send("Erreur serveur");
    }
});

//Affochage de tous les editors avec leurs jeux
router.get("/editor", async (req, res) => {
    const { id } = req.query;
    try {
        const editor = await prisma.Editors.findMany({
            orderBy: {
                name: "asc",
            },
        });

        let games = null;
        if (id) {
            games = await prisma.Games.findMany({
                where: { editorId: parseInt(id, 10) },
                include: {
                    editor: true,
                    genre: true,
                },
                orderBy: {
                    title: "asc",
                },
            });
        }

        res.render("editor", { editor, games });
    } catch (error) {
        console.error("Erreur lors de la récupération des éditeurs :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

//Ajout d'un editor
router.post("/editor", async (req, res, next) => {
    const  { editor } = req.body;
    try {
        await prisma.Editors.create({
            data : { name:editor }, 
        }); 
        res.status(201).redirect("/editor");
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Task creation failed" });
    }
});

//Suppression d'un editor
router.post("/editor/delete", async (req, res, next) => {
    const { id } = req.body;
    try {
        await prisma.Games.deleteMany({
            where: { editorId : parseInt(id,10) },
        })

        await prisma.Editors.delete({
            where: { id: parseInt(id, 10) },
        });

        res.redirect("/editor"); 
    } catch (error) {
        console.error("Erreur lors de la suppression de l'éditeur :", error);
        res.status(400).json({ error: "Échec de la suppression de l'éditeur" });
    }
});

//Update d'un editor
router.post("/editor/update", async (req, res, next) => {
    const { id, name } = req.body;
    try {
        await prisma.Editors.update({
            where: { id: parseInt(id, 10) },
            data: { name },
        });
        res.redirect("/editor");
    } catch (error) {
        console.error("Erreur lors de la modification de l'éditeur :", error);
        res.status(400).json({ error: "Échec de la modification de l'éditeur" });
    }
});

//Affichage de tous les genres et des jeux du genre sélectionné
router  .get("/genres", async (req, res) => {
    const { id } = req.query;
    try {
        const genres = await prisma.Genres.findMany({
            orderBy: {
                name: "asc",
            },
        });

        let gamesWithGenre = null;
        if (id) {
            gamesWithGenre = await prisma.Games.findMany({
                where: { genreId: parseInt(id, 10) },
                include: {
                    editor: true,
                    genre: true,
                },
                orderBy: {
                    title: "asc",
                },
            });
        }
        res.render("genres", { genres, gamesWithGenre });
    } catch (error) {
        console.error("Erreur lors de la récupération des éditeurs :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
module.exports = router;
