const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class genrePrismaAccess {
    async getGenres(options = {}) {
        return await prisma.Genres.findMany(options);
    }
     async createGenre(options) {
        return await prisma.Genres.create(options);
    }
}
module.exports = new genrePrismaAccess();