
<div align="center">

# 📈 STOCK PORTFOLIO

### PostgreSQL + External API Integration (Alpha Vantage)

![image](https://github.com/user-attachments/assets/172a4886-0cd9-47a2-b6e8-2f49da8d79e5)

</div>

## 🚀 Overview
Stock Portfolio is a web app that allows users to build and manage an investment portfolio by adding stocks with quantity and purchase price. The app fetches real-time stock data from Alpha Vantage and calculates current values and profit/loss per stock.

## 📦 Installation

### 1️⃣ Clone the repository
```sh
git clone https://github.com/mat-devlp/StockClosePrice.git
cd StockClosePrice
```

### 2️⃣ Install dependencies
```sh
npm install
```

#### 3️⃣ Set up PostgreSQL database
Make sure PostgreSQL is running. Create a database named `postgres` (or update the connection) and run the following:

```sql
CREATE TABLE portfolio (
    id SERIAL PRIMARY KEY,
    symbol TEXT,
    quantity NUMERIC(12,6),
    buy_price NUMERIC,
    current_price NUMERIC,
    sell_price NUMERIC,
    final_balance NUMERIC,
    purchase_date DATE
);
```

### 4️⃣ Configure environment variables
Create a `.env` file in the root directory:

```env
PASSWORDSQL=your_pg_password
API_KEY=your_alpha_vantage_key
```

### ▶️ Running the Stock Portfolio
Start the application with Nodemon:

```sh
npm install -g nodemon
nodemon index.js
```

Then open [http://localhost:4000](http://localhost:4000) in your browser.

## 📡 Features
- Add a stock with quantity, buy price, and date.
- Automatically fetch real-time close price from Alpha Vantage.
- View profit/loss per asset.
- Edit or delete assets in your portfolio.
- Highlights gain/loss rows in green/red.

---

