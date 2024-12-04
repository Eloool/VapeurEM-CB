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

// On définit un middleware pour parser les données des requêtes entrantes.
// Cela permet de récupérer les données envoyées via des formulaires et les rendre disponibles dans req.body.
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour gérer les erreurs 404
// app.use((req, res) => {
//     res.status(404).render("404");
// });



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

app.get("/", async (req, res) => {
    res.render("index");
});

app.get("/games", async (req, res) => {
    const games = await prisma.games.findMany({
            orderBy: {
                title: "asc",
            },
        });
    const editors = await prisma.Editors.findMany();
    const genres = await prisma.genres.findMany();
    res.render("games", {
        games,editors,genres
    });
});

app.get("/editor", async (req, res) => {
    const { id } = req.query; // Récupère l'ID de la requête (si présent)
    try {
        const editor = await prisma.Editors.findMany({
            orderBy: {
                name: "asc", // Trie par nom en ordre croissant
            },
        });

        let gamesFromEditor = null;
        if (id) {
            gamesFromEditor = await prisma.Editors.findUnique({
                where: { id: parseInt(id, 10) },
            });
        }

        res.render("editor", { editor, gamesFromEditor });
    } catch (error) {
        console.error("Erreur lors de la récupération des éditeurs :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

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

app.get("/game", async (req, res) => {
    const games = await prisma.Games.findMany();
    const editor = await prisma.Editors.findMany();
    const genre = await prisma.Genres.findMany();
    res.render("add_jeux", {games, editor, genre} );
});

app.post("/game", async (req, res, next) => {
    const  { jeux, description, date, editor, genre} = req.body;
    try {
        await prisma.Games.create({
            data : { title: jeux, description: description, releaseDate: date , genreId: parseInt(genre), editorId: parseInt(editor)}, 
        }); // Ici on ne stock pas le retour de la requête, mais on attend quand même son exécution
        res.status(201).redirect("/game"); // On redirige vers la page des tâches
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Task creation failed" });
    }
});

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

app.get("/genres", async (req, res) => {
    const { id } = req.query; // Récupère l'ID de la requête (si présent)
    try {
        const genres = await prisma.Genres.findMany({
            orderBy: {
                name: "asc", // Trie par nom en ordre croissant
            },
        });

        let gamesWithGenre = null;
        if (id) {
            gamesWithGenre = await prisma.Genres.findUnique({
                where: { id: parseInt(id, 10) },
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