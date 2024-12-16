//Ajout des modules dont on a besoins
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const path = require("path");
const { title } = require("process");

const app = express();
const prisma = new PrismaClient();
const PORT = 3008;
app.set("view engine", "hbs"); // On définit le moteur de template que Express va utiliser
app.set("views", path.join(__dirname, "WebPages")); // On définit le dossier des vues (dans lequel se trouvent les fichiers .hbs)
hbs.registerPartials(path.join(__dirname, "WebPages", "partials")); // On définit le dossier des partials (composants e.g. header, footer, menu...)
app.use(express.static('public'));
// On définit un middleware pour parser les données des requêtes entrantes.
// Cela permet de récupérer les données envoyées via des formulaires et les rendre disponibles dans req.body.
app.use(bodyParser.urlencoded({ extended: true }));

//Helper pour savoir si deux nombres sont égaux
hbs.registerHelper("ifEqual", function (a, b, options) {
    return a == b ? options.fn(this) : options.inverse(this);
});

// Ajout des genres qu'y n'existent pas dans la base de données 
const gamesGenres = ["Action","Aventure","RPG","Simulation","Sport","MMORPG"];
(async () => {
    try {
        // Récupérer tous les genres existants dans la base de données
        const genres = await prisma.genres.findMany();
        const existingGenreNames = genres.map((genre) => genre.name);

        // Parcourir les genres définis et ajouter les nouveaux
        for (const element of gamesGenres) {
            if (!existingGenreNames.includes(element)) {
                await prisma.genres.create({
                    data: {
                        name: element, 
                    },
                });
                console.log(`Genre ajouté : ${element}`);
            }
        }
        console.log("Tous les genres sont bien dans la base de données.");
    } catch (error) {
        console.error("Erreur lors de l'ajout des genres :", error);
    } 
})();

//Affichage des jeux en favori
app.get("/", async (req, res) => {
    try {
        const games = await prisma.games.findMany({
            include: {
                editor: true,
                genre: true,
            },
            where: {
                favorited: true,
            },
            orderBy: {
                title: "asc",
            },
        });
        res.render("index", { games });
    } catch (error) {
        console.error("Erreur lors de la récupération des jeux favoris :", error);
        res.status(500).send("Erreur serveur");
    }
});

//Affichage de tous les jeux
app.get("/games", async (req, res) => {
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
app.post("/addgame", async (req, res, next) => {
    const  { jeux, description, date, editor, genre} = req.body;
    try {
        await prisma.Games.create({
            data : { title: jeux, description: description, releaseDate: date , genreId: parseInt(genre), editorId: parseInt(editor)}, 
        }); // Ici on ne stock pas le retour de la requête, mais on attend quand même son exécution
        res.status(201).redirect("/games"); // On redirige vers la page des tâches
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Task creation failed" });
    }
});

//Suppression d'un jeu
app.post("/games/delete", async (req, res, next) => {
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

//Affichage d'un jeu en particulier
app.get("/game", async (req, res) => {
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

//Changement des infos d'un jeu
app.post("/games/update", async (req, res, next) => {
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
app.post("/favorited", async (req, res, next) => {
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
app.get("/editor", async (req, res) => {
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
app.post("/editor", async (req, res, next) => {
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
app.post("/editor/delete", async (req, res, next) => {
    const { id } = req.body;
    try {
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
app.post("/editor/update", async (req, res, next) => {
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
app.get("/genres", async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).render("404");
});