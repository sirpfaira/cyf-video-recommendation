const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors());

const videos = require('./data.json');

app.get('/', (req, res) => {
  res.status(200).json('You have hit the video recommendation API');
});

app.get('/videos', (req, res) => {
  const { order } = req.query;
  if (order === 'desc') {
    videos.sort((a, b) => (a.likes > b.likes ? -1 : b.likes > a.likes ? 1 : 0));
  } else if (order === 'asc') {
    videos.sort((a, b) => (a.likes > b.likes ? 1 : b.likes > a.likes ? -1 : 0));
  }
  res.status(200).json(videos);
});

app.get('/videos/:videoId', (req, res) => {
  const { videoId } = req.params;
  const video = videos.find((vid) => vid.id == videoId);
  video
    ? res.status(200).json(video)
    : res.status(404).send(`Video with ID: "${videoId}" was not found`);
});

app.post('/videos', (req, res) => {
  try {
    const { title, url, uploader } = req.body;
    if (title && url) {
      const newVideo = {
        id: getId(),
        title: title,
        url: url,
        author: uploader || 'Anonymous',
        likes: 0,
        dislikes: 0,
      };
      videos.push(newVideo);
      res.send(`Video was added. Id: "${newVideo.id}"`);
    } else {
      res.send(`You should supply all required fields!`);
    }
  } catch (error) {}
  console.log(req.body);
  res.status(500).send(`Error video could not be uploaded to our servers`);
});

app.delete('/videos/:videoId', function (req, res) {
  const { videoId } = req.params;
  const video = videos.find((vid) => vid.id == videoId);

  if (video) {
    videos.splice(videos.indexOf(video), 1);
    res.send(`Video #${videoId} deleted!`);
  } else {
    res.status(404).send(`Video with ID: ${videoId} was not found`);
  }
});

const getId = () => {
  const sortedArr = videos.sort((a, b) =>
    a.id > b.id ? 1 : b.id > a.id ? -1 : 0
  );
  return sortedArr[sortedArr.length - 1].id + 1;
};

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
