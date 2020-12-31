const express = require("express");
const app = express();
const axios = require("axios");
const api_key = "ed25e6a31fe5a66e557dac321e68eafc";
let sport_key = "soccer_epl";
let bolletta = [];

const getMultiplier = (bolletta) => {
  let res = 1;
  bolletta.map((item) => {
    res *= item.odd;
  });
  return res;
};
app.get("/", async (_, res) => {
  try {
    const response = await axios.get("https://api.the-odds-api.com/v3/odds", {
      params: {
        api_key: api_key,
        sport: sport_key,
        region: "eu", // uk | us | eu | au
        mkt: "h2h", // h2h | spreads | totals
      },
    });
    const final = response.data.data.map((curr) => {
      return {
        teams: curr.teams,
        odds: {
          1: curr.sites[0].odds.h2h[0],
          X: curr.sites[0].odds.h2h[2],
          2: curr.sites[0].odds.h2h[1],
        },
      };
    });
    res.json(final);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
app.put("/bet/:match/:odd", async ({ params }, res) => {
  let esit = {
    1: 0,
    2: 1,
    X: 2,
  };
  try {
    const response = await axios.get("https://api.the-odds-api.com/v3/odds", {
      params: {
        api_key: api_key,
        sport: sport_key,
        region: "eu", // uk | us | eu | au
        mkt: "h2h", // h2h | spreads | totals
      },
    });
    if (
      esit[params.odd] !== "undefined" &&
      !isNaN(params.match) &&
      params.match < response.data.data.length
    ) {
      const odd =
        response.data.data[params.match].sites[0].odds.h2h[esit[params.odd]];
      bolletta = bolletta.filter((item) => {
        return (
          JSON.stringify(response.data.data[params.match].teams) !==
          JSON.stringify(item.game)
        );
      });
      bolletta.push({
        game: response.data.data[params.match].teams,
        start: response.data.data[params.match].commence_time,
        result: params.odd,
        odd,
      });
      res.json({ bolletta, checkout: { multiplier: getMultiplier(bolletta) } });
    } else {
      res.status(400).send("Not a valid bet (1,X,2");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
app.get("/checkout/:import", ({ params }, res) => {
  if (!isNaN(params.import) && params.import > 0) {
    let multiplier = getMultiplier(bolletta);
    res.json({
      bolletta,
      checkout: {
        multiplier,
        import: params.import,
        maxWin: multiplier * params.import,
      },
    });
  }
});
app.listen(3000, async () => {
  console.log(`Example app listening at http://localhost:3000`);
});
