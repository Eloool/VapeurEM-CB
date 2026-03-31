class gamePrismaAccess {
    constructor(request){
            this.request = request;
    }
    get ListGames() {
        return prisma.games.findMany(this.request);
}
    get Game() {
        return prisma.games.findUnique(this.request);
    }

}