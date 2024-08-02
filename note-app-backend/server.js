const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const mongoUri = 'mongodb+srv://Avishek:motorola@mycluster.hklrkic.mongodb.net/?retryWrites=true&w=majority&appName=mycluster';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const groupSchema = new mongoose.Schema({
    name: String,
    color: String
});

const noteSchema = new mongoose.Schema({
    groupId: mongoose.Schema.Types.ObjectId,
    text: String,
    date: { type: Date, default: Date.now }
});

const Group = mongoose.model('Group', groupSchema);
const Note = mongoose.model('Note', noteSchema);

app.post('/api/groups', (req, res) => {
    const newGroup = new Group(req.body);
    newGroup.save()
        .then(group => res.json(group))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.post('/api/notes', (req, res) => {
    const newNote = new Note(req.body);
    newNote.save()
        .then(note => res.json(note))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.get('/api/groups', (req, res) => {
    Group.find()
        .then(groups => res.json(groups))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.get('/api/notes/:groupId', (req, res) => {
    Note.find({ groupId: req.params.groupId })
        .then(notes => res.json(notes))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
