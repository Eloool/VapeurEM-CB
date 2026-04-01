const request = require('supertest');
const app = require('../index');

describe('Tests fonctionnels du site Vapeur', () => {
  test('GET / renvoie la page d’accueil avec la liste des favoris', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Voici votre liste de jeux favoris');
  });

  test('GET /games renvoie la page jeux avec formulaire', async () => {
    const res = await request(app).get('/games');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Ajouter un jeu:');
    expect(res.text).toContain('Liste des jeux');
  });

  test('GET /editor renvoie la page éditeur', async () => {
    const res = await request(app).get('/games/editor');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('éditeurs');
  });

  test('GET /genres renvoie la page genres', async () => {
    const res = await request(app).get('/games/genres');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Genres');
  });

  test('POST /games/addgame avec données invalides redirige vers /games', async () => {
    const res = await request(app)
      .post('/games/addgame')
      .type('form')
      .send({ jeux: '', description: '', date: '', editor: '', genre: '' });
    expect([302, 303]).toContain(res.statusCode);
    expect(res.headers.location).toBe('/games');
  });

  test('GET url non existante renvoie 404', async () => {
    const res = await request(app).get('/route-qui-existe-pas');
    expect(res.statusCode).toBe(404);
    expect(res.text).toContain('404');
  });

  test('GET /game?id=1 fonctionne ou retourne 404 (route valide)', async () => {
    const res = await request(app).get('/game?id=1');
    expect([200, 404]).toContain(res.statusCode);
  });
});
