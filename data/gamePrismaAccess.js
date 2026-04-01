const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class gamePrismaAccess {
    async getListGames(options = {}) {
        return await prisma.Games.findMany(options);
    }

    async getGameById(id) {
        return await prisma.Games.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                editor: true,
                genre: true
            }
        });
    }
    async getGame(options = {}) {
        return await prisma.Games.findUnique(options);
    }

    async createGame(options) {
        return await prisma.Games.create(options);
    }

    async updateGame(id, data) {
        return await prisma.Games.update({
            where: { id: parseInt(id, 10) },
            data
        });
    }

    async deleteGame(id) {
        return await prisma.Games.delete({
            where: { id: parseInt(id, 10) }
        });
    }
    async deleteGames(options = {}) {
        return await prisma.Games.deleteMany(options);
    }
    
}

module.exports = new gamePrismaAccess();