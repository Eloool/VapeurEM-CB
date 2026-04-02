const express = require("express");
const router = express.Router();

const gameService = require("./data/gamePrismaAccess");
const editorService = require("./data/editorPrismaAccess");
const genreService = require("./data/genrePrsimaAccess");

const GamesView = require("./view/GamesView");
const EditorView = require("./view/EditorView");
const GenresView = require("./view/GenresView");

const gamesView = new GamesView();
const editorView = new EditorView();
const genresView = new GenresView();
const gamesChecking = require("./service/gamesChecking");

//Affichage de tous les jeux
router.get("/", async (req, res) => {
    const {  sortOrder = "asc" } = req.query;
    const { games, editor, genre } = await gamesChecking.getAllGamesList( sortOrder);
    gamesView.displayGamesList(res, games, editor, genre);
});

//Ajout d'un jeu
router.post("/addgame", async (req, res, next) => {
    const  { jeux, description, date, editor, genre} = req.body;
    if(!editor || !genre || isNaN(parseInt(editor)) || isNaN(parseInt(genre))){
        return res.redirect("/games");
    }
    try {
        await gameService.createGame({
            data : { title: jeux, description: description, releaseDate: date , genreId: parseInt(genre), editorId: parseInt(editor)}, 
        });
        const {games,editors, genres} = await gamesChecking.getAllGamesList();
        gamesView.gameAdded(res, games, editors, genres);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Game creation failed" });
    }
});

//Suppression d'un jeu
router.post("/delete", async (req, res, next) => {
    const { id } = req.body;
    try {
        await gameService.deleteGame(id);
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
        await gameService.updateGame(id, {
            title: jeux,
            description: description,
            releaseDate: date,
            genreId: parseInt(genre),
            editorId: parseInt(editor)
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
        await gameService.updateGame(id, {
            favorited: favoritedbool
        });
        res.redirect(req.headers.referer || '/');
    } catch (error) {
        console.error("Erreur lors de la mise à jour du favori :", error);
        res.status(500).send("Erreur serveur");
    }
});

//Affochage de tous les editors avec leurs jeux
router.get("/editor", async (req, res) => {
    const { id, sortOrder = "asc" } = req.query;
    try {
        const { editor, games } = await gamesChecking.getGamesEditorList(id, sortOrder);
        editorView.displayEditors(res, editor, games, {
            routeBase: '/games/editor',
            selectedId: id,
            sortField,
            sortOrder,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des éditeurs :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

//Ajout d'un editor
router.post("/editor", async (req, res, next) => {
    const  { editor } = req.body;
    try {
        await editorService.createEditor({
            data : { name:editor }, 
        });
        const editors = await editorService.getEditors();
        editorView.editorAdded(res, editors);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Task creation failed" });
    }
});

//Suppression d'un editor
router.post("/editor/delete", async (req, res, next) => {
    const { id } = req.body;
    try {
        await gameService.deleteGames({ editorId: parseInt(id, 10) });
        await editorService.deleteEditor(id);

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
        await editorService.updateEditor(id, { name });
        res.redirect("/editor");
    } catch (error) {
        console.error("Erreur lors de la modification de l'éditeur :", error);
        res.status(400).json({ error: "Échec de la modification de l'éditeur" });
    }
});

//Affichage de tous les genres et des jeux du genre sélectionné
router.get("/genres", async (req, res) => {
    const { id, sortOrder = "asc" } = req.query;
    try {
        const { genres, gamesWithGenre } = await gamesChecking.getGamesGenreList(id, sortOrder);
        genresView.displayGenres(res, genres, gamesWithGenre, {
            routeBase: '/games/genres',
            selectedId: id,
            sortField,
            sortOrder,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des éditeurs :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
module.exports = router;
