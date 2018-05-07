module.exports = (app) => {
    const hotelnote = require('../controllers/note.controller.js');

    // Retrieve all Notes
    app.post('/hotelnotes', hotelnote.create);
}