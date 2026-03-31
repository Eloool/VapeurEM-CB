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
    async getAllGamesList() {
        const games = await gameService.getListGames({
                include: {
                    editor: true,
                    genre: true,
                },
                    orderBy: {
                        title: "asc",
                    },
                });
            const editor = await editorService.getEditors();
            const genre = await genreService.getGenres();
        return { games, editor, genre };
    }
    async getGamesEditorList(id) {
        const editor = await editorService.getEditors({
                    orderBy: {
                        name: "asc",
                    },
                });
        
                let games = null;
                if (id) {
                    games = await gameService.getListGames({
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
        return { editor, games };
    }
    async getGamesGenreList(id) {
        const genres = await genreService.getGenres({
                    orderBy: {
                        name: "asc",
                    },
                });
        
                let gamesWithGenre = null;
                if (id) {
                    gamesWithGenre = await gameService.getListGames({
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