const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const path = require('path');

//const cors = require('cors');
//app.use(cors());

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  // create connection to database
  connectionString: process.env.DATABASE_URL, // use DATABASE_URL environment variable from Heroku app
  ssl: {
    rejectUnauthorized: false, // don't check for SSL cert
  },
});

app.get('/videos', async (req, res) => {
  const { order } = req.query;
  let query = `SELECT * FROM videos`;

  if (order === 'asc') {
    query = `SELECT * FROM videos ORDER BY likes ASC`;
  } else if (order === 'desc') {
    query = `SELECT * FROM videos ORDER BY likes DESC`;
  }
  await pool
    .query(query)
    .then((result) => res.status(200).json(result.rows))
    .catch((e) => {
      res.status(400).json(`An error occurred!`);
      console.log(e);
    });
});

app.get('/videos/:videoId', async (req, res) => {
  const { videoId } = req.params;

  await pool
    .query('SELECT * FROM videos WHERE id = $1', [videoId])
    .then((result) => res.json(result.rows))
    .catch((e) => {
      res.status(400).json(`An error occurred!`);
      console.log(e);
    });
});

app.post('/videos', async (req, res) => {
  try {
    const { title, url, uploader } = req.body;
    if (title && url) {
      await pool.query(
        `INSERT INTO videos (title, url, uploader, likes, dislikes ) VALUES ($1, $2 ,$3, $4, $5)`,
        [title, url, uploader || 'Anonymous', 0, 0]
      );
      res.send(`Video was added successfully!`);
    } else {
      res.send(`You should supply all required fields!`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error video could not be uploaded to our servers`);
  }
});

app.patch('/videos/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const { likes, dislikes } = req.body;
  try {
    if (likes && dislikes) {
      const myVideo = await pool.query(`SELECT * FROM videos WHERE id = $1`, [
        videoId,
      ]);
      if (myVideo.rowCount > 0) {
        await pool.query(
          `UPDATE videos SET likes = $1, dislikes = $2 WHERE id = $3;`,
          [likes, dislikes, videoId]
        );
        res.status(200).json(`Video was updated successfully!`);
      } else {
        res
          .status(400)
          .json(`The provided video ID '${videoId}' does not exist!`);
      }
    } else {
      res.status(400).json(`Update information was not provided!`);
    }
  } catch (e) {
    res.status(400).json(`An error occurred!`);
    console.log(e);
  }
});

app.delete('/videos/:videoId', async (req, res) => {
  const { videoId } = req.params;
  try {
    const myVideo = await pool.query(`SELECT * FROM videos WHERE id = $1`, [
      videoId,
    ]);
    if (myVideo.rowCount > 0) {
      await pool.query(`DELETE FROM videos WHERE id = $1`, [videoId]);
      res.status(200).json(`Video was deleted successfully!`);
    } else {
      res
        .status(400)
        .json(`The provided video ID '${videoId}' does not exist!`);
    }
  } catch (e) {
    res.status(400).json(`An error occurred!`);
    console.log(e);
  }
});

if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
