const express = require('express');
const { uuid } = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const NEWrepositorio = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(NEWrepositorio);

  return response.json(NEWrepositorio);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id,
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const { likes } = repositories[repositoryIndex];
  const titleTake = repositories[repositoryIndex].title;
  const urlTake = repositories[repositoryIndex].url;
  const techsTake = repositories[repositoryIndex].techs;

  repositories[repositoryIndex] = {
    id,
    title: title ? title : titleTake,
    url: url ? url : urlTake,
    techs: techs ? techs : techsTake,
    likes,
  };

  return response.status(200).json({ message: 'Success' });
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id,
  );

  repositories.splice(repositoryIndex, 1);

  return response.status(200).json({ message: 'Success' });
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id,
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repositoryTake = repositories[repositoryIndex];
  const likesSum = repositoryTake.likes + 1;

  repositories[repositoryIndex] = {
    ...repositoryTake,
    likes: repositoryTake.likes + 1,
  };

  return response.status(200).json({ message: 'Success', likes: likesSum });
});

module.exports = app;
