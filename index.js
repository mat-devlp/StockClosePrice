//// IMPORTS
import express, { urlencoded } from "express";
import axios from "axios";

//// CONFIG
const app = express();
const port = 4000;
const API_KEY = "YOUR API KEY";

//// MIDDLEWARES
app.use(express.static("public"));
app.use(urlencoded({ extended: true }));
app.set("view engine", "ejs"); 

//// ROUTES
app.get("/", async (req, res) => {
    res.render("index", { stockSymbol: null, stockClose: null });
});

app.get("/stockSearch", async (req, res) => {
    try {
        const symbol = req.query.stockname;
        const result = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
        const timeSeries = result.data["Time Series (Daily)"];

        if (!timeSeries) {
            return res.render("index", { stockSymbol: "Not Found", stockClose: "N/A" });}

        const latestDate = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestDate];
        const stockClose = latestData["4. close"]; 
        const stockSymbol = symbol.toUpperCase();

        console.log(`Stock: ${stockSymbol}, Close Price: ${stockClose}`);
        res.render("index", { stockSymbol, stockClose });

    } catch (error) {
        console.error("Error fetching stock data:", error.message);
        res.render("index", { stockSymbol: "Error", stockClose: "Could not fetch data" });
    }
});

//// SERVER
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
