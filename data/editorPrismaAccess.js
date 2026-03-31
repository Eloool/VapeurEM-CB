const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class editorPrismaAccess {
    async getEditors(options = {}) {
        return await prisma.Editors.findMany(options);
    }

    async createEditor(data) {
        return await prisma.Editors.create(data);
    }
   
    async deleteEditor(id) {
        return await prisma.Editors.delete({
            where: { id: parseInt(id, 10) }
        });
    }
    async updateEditor(id, data) {
        return await prisma.Editors.update({
            where: { id: parseInt(id, 10) },
            data
        });
    }
}

module.exports = new editorPrismaAccess();