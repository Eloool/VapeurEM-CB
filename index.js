//Ajout des modules dont on a besoins
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const hbs = require("hbs");
const path = require("path");

const app = express();
const prisma = new PrismaClient();
const PORT = 3008;
app.set("view engine", "hbs"); // On définit le moteur de template que Express va utiliser
app.set("views", path.join(__dirname, "WebPages")); // On définit le dossier des vues (dans lequel se trouvent les fichiers .hbs)
hbs.registerPartials(path.join(__dirname, "WebPages", "partials")); // On définit le dossier des partials (composants e.g. header, footer, menu...)

// On définit un middleware pour parser les données des requêtes entrantes.
// Cela permet de récupérer les données envoyées via des formulaires et les rendre disponibles dans req.body.
app.use(bodyParser.urlencoded({ extended: true }));

const gamesGenres = ["Action","Aventure","RPG","Simulation","Sport","MMORPG"];

app.get("/", async (req, res) => {
    res.render("index");
});

app.get("/games", async (req, res) => {
    const games = await prisma.games.findMany();
    res.render("games", {
        games,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});