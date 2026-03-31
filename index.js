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

const gamesRoutes = require("./gamesList");
const gameRoutes = require("./game");
app.use("/games", gamesRoutes);
app.use("/game", gameRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).render("404");
});