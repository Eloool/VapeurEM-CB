const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
class genrePrismaAccess {
    async getGenres() {
        return await prisma.Genres.findMany();
    }
     async createGenre(data) {
        return await prisma.Genres.create(data );
    }
}
module.exports = new genrePrismaAccess();