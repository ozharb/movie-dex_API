'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MovieDex = require('./moviedex.json');


const app = express();

app.use(morgan('dev'));
app.use(function validateBearerToken(req, res, next) {
  
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  console.log('validate bearer token middleware');
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});
function handleGetMovies(req, res) {
  let response = MovieDex;

  // filter movies by genre if genre query param is present
  if (req.query.genre) {
    response = response.filter(movie =>
    // case insensitive searching
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }
  
  // filter movies by country if country query param is present
  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }
  // filter movies by avg vote if avg vote query param is present
  if (req.query.avg_vote) {
    response = response.filter(movie =>
      movie.avg_vote >= req.query.avg_vote
    );}

  res.json(response);
}
    
app.get('/movie', handleGetMovies);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});