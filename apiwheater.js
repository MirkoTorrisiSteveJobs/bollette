const express = require("express");
const weather = require("npm-openweathermap");
const stadiums = require("./stadiums.json");
const fetch = require("node-fetch");
const app = express();

// weather.api_key = "d94fd138c616b9c10f9156a013b5727f";

// app.get("/:id", async (req, res) => {
//   let matches_final = [];
//   let index = 0;
//   try {
//     const response = await fetch("https://www.scorebat.com/video-api/v1/");
//     const matches = await response.json();

//     stadiums.map((stadium) => {
//       matches.map((match) => {
//         if (stadium.Team.toLowerCase().includes(match.side1.name.toLowerCase()))
//           matches_final.push({ id: index++, ...match, city: stadium.City });
//       });
//     });
//     let match = matches_final.find((match) => match.id == req.params.id);
//     const weat_res = await weather.get_weather_custom(
//       "city",
//       match.city,
//       "forecast"
//     );

//     res.json({
//       ...match,
//       weather: { ...weat_res[0].weather[0] }.description,
//     });
//   } catch (error) {
//     res.status(404).json({ message: error });
//   }
// });
