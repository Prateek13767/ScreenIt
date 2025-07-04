import axios from 'axios';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

export const getNowPlayingMovies = async (req, res) => {
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            params: {
                api_key: process.env.TMDB_API_KEY
            }
        });
        const movies = data.results;
        res.json({ success: true, movies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body;
        console.log(req.body);

        let movie = await Movie.findById(movieId);

        if (!movie) {
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    params: { api_key: process.env.TMDB_API_KEY }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    params: { api_key: process.env.TMDB_API_KEY }
                })
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                genres: movieApiData.genres,
                cast: movieCreditsData.cast,
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime
            };

            movie = await Movie.create(movieDetails);
        }

        const showsToCreate = [];

        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time) => {
                const dateTimeString = `${showDate}T${time}`; // ISO 8601 format
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                });
            });
        });

        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        }

        res.json({ success: true, message: 'Show Added Successfully' });

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};
