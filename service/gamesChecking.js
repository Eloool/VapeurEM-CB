const gameService = require("../data/gamePrismaAccess");
const editorService = require("../data/editorPrismaAccess");
const genreService = require("../data/genrePrsimaAccess");

class gamesChecking {
    async getInfosFirstPage() {
        const games = await gameService.getListGames({
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
        return games;
    }
    _buildOrderBy(sortField = "title", sortOrder = "asc") {
        const order = sortOrder === "desc" ? "desc" : "asc";
        switch (sortField) {
            case "releaseDate":
                return { releaseDate: order };
            case "description":
                return { description: order };
            case "editor":
                return { editor: { name: order } };
            case "genre":
                return { genre: { name: order } };
            default:
                return { title: order };
        }
    }

    async getAllGamesList(sortField = "title", sortOrder = "asc") {
        const orderBy = this._buildOrderBy(sortField, sortOrder);
        const games = await gameService.getListGames({
            include: {
                editor: true,
                genre: true,
            },
            orderBy,
        });
        const editor = await editorService.getEditors();
        const genre = await genreService.getGenres();
        return { games, editor, genre };
    }
    async getGamesEditorList(id, sortField = "title", sortOrder = "asc") {
        const editor = await editorService.getEditors({
            orderBy: {
                name: "asc",
            },
        });

        let games = null;
        if (id) {
            const orderBy = this._buildOrderBy(sortField, sortOrder);
            games = await gameService.getListGames({
                where: { editorId: parseInt(id, 10) },
                include: {
                    editor: true,
                    genre: true,
                },
                orderBy,
            });
        }
        return { editor, games };
    }
    async getGamesGenreList(id, sortField = "title", sortOrder = "asc") {
        const genres = await genreService.getGenres({
                    orderBy: {
                        name: "asc",
                    },
                });
        
        let gamesWithGenre = null;
        if (id) {
            const orderBy = this._buildOrderBy(sortField, sortOrder);
            gamesWithGenre = await gameService.getListGames({
                where: { genreId: parseInt(id, 10) },
                include: {
                    editor: true,
                    genre: true,
                },
                orderBy,
            });
        }
        return { genres, gamesWithGenre };
    }
    async getGameInfo(id) {
        const game = await gameService.getGame({
            where: { id: parseInt(id, 10) },
            include: {
                editor: true,
                genre: true,
            },
        });

        
        const editor = await editorService.getEditors();
        const genre = await genreService.getGenres();
        return { game, editor, genre };
    }
}

module.exports = new gamesChecking();