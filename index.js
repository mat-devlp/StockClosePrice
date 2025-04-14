//// IMPORTS
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
const { Client } = pg;

const db = new Client({ 
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: process.env.PASSWORDSQL,
  port: 5433,
});
db.connect();

//// CONFIG
const port = 4000;
const API_KEY = process.env.API_KEY;

//// MIDDLEWARES
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//// ROUTES

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM portfolio");
    res.render("index", { 
      stockSymbol: null, 
      stockClose: null, 
      portfolio: result.rows 
    });
  } catch (err) {
    res.render("index", { 
      stockSymbol: null, 
      stockClose: null, 
      portfolio: [] 
    });
  }
});

app.get("/stockSearch", async (req, res) => {
  try {
    const symbol = req.query.stockname.trim().toUpperCase();
    const apiResponse = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
    );

    console.log(apiResponse.data); // Debug API response

    const timeSeries = apiResponse.data["Time Series (Daily)"];
    const dbResult = await db.query("SELECT * FROM portfolio");

    if (!timeSeries) {
      return res.render("index", { 
        stockSymbol: "Not Found", 
        stockClose: "N/A", 
        portfolio: dbResult.rows 
      });
    }

    const latestDate = Object.keys(timeSeries)[0];
    const stockClose = timeSeries[latestDate]["4. close"];
    const stockSymbol = symbol;

    res.render("index", { 
      stockSymbol, 
      stockClose, 
      portfolio: dbResult.rows 
    });

  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    const dbResult = await db.query("SELECT * FROM portfolio");
    res.render("index", { 
      stockSymbol: "Error", 
      stockClose: "Could not fetch data", 
      portfolio: dbResult.rows 
    });
  }
});

app.post("/addStock", async (req, res) => {
  const { symbol, quantity, buy_price, current_price, purchase_date } = req.body;

  const final_balance = (current_price - buy_price) * quantity;

  await db.query(
    `INSERT INTO portfolio (symbol, quantity, buy_price, current_price, final_balance, purchase_date)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [symbol, quantity, buy_price, current_price, final_balance, new Date(purchase_date)]
  );

  res.redirect("/");
});

app.post("/editStock", async (req, res) => {
  const { id, quantity, buy_price, sell_price, purchase_date } = req.body;

  const result = await db.query("SELECT current_price FROM portfolio WHERE id = $1", [id]);
  const current_price = Number(result.rows[0].current_price);
  const final_balance = sell_price
    ? (sell_price - buy_price) * quantity
    : (current_price - buy_price) * quantity;

  await db.query(
    `UPDATE portfolio 
     SET quantity = $1, buy_price = $2, sell_price = $3, final_balance = $4, purchase_date = $5 
     WHERE id = $6`,
    [quantity, buy_price, sell_price || null, final_balance, new Date(purchase_date), id]
  );

  res.redirect("/");
});

app.post("/deleteStock", async (req, res) => {
  const { id } = req.body;
  await db.query("DELETE FROM portfolio WHERE id = $1", [id]);
  res.redirect("/");
});

//// SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
