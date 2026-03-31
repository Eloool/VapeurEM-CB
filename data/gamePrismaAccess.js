const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class gamePrismaAccess {
    async getListGames(options = {}) {
        return await prisma.games.findMany(options);
    }

    async getGameById(id) {
        return await prisma.games.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                editor: true,
                genre: true
            }
        });
    }
    async getGame(options = {}) {
        return await prisma.games.findUnique(options);
    }

    async createGame(data) {
        return await prisma.games.create( data );
    }

    async updateGame(id, data) {
        return await prisma.games.update({
            where: { id: parseInt(id, 10) },
            data
        });
    }

    async deleteGame(id) {
        return await prisma.games.delete({
            where: { id: parseInt(id, 10) }
        });
    }async deleteGames(options = {}) {
        return await prisma.games.deleteMany(options);
    }
    
}

module.exports = new gamePrismaAccess();