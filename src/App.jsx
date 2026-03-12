import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [pogoda, setPogoda] = useState([]);
  const [szukaneMiasto, setSzukaneMiasto] = useState("");
  const [wybraneMiasto, setWybraneMiasto] = useState(null);

  useEffect(() => {
    fetch("https://danepubliczne.imgw.pl/api/data/synop")
      .then((res) => res.json())
      .then((data) => {
        setPogoda(data);

        const wroclaw = data.find((s) => s.stacja === "Wrocław");
        if (wroclaw) {
          setWybraneMiasto(wroclaw);
        }
      })
      .catch((err) => console.error("Błąd pobierania danych:", err));
  }, []);

  const filtrowaneStacje = pogoda.filter((s) =>
    s.stacja.toLowerCase().startsWith(szukaneMiasto.toLowerCase())
  );

  const getZachmurzenie = (wilgotnosc) => {
    const w = Number(wilgotnosc);

    if (w < 25) return "☀️ Słonecznie";
    if (w < 50) return "🌤 Lekkie zachmurzenie";
    if (w < 75) return "⛅ Częściowe zachmurzenie";
    return "☁️ Pełne zachmurzenie";
  };

  const getData = () => {
    const dzis = new Date();
  
    return dzis.toLocaleDateString("pl-PL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="app">

      <header className="header">
        <h1>CzyJestDeszcz.pl</h1>
      </header>

      <main className="main">

        <div className="search">
          <input
            type="text"
            value={szukaneMiasto}
            onChange={(e) => setSzukaneMiasto(e.target.value)}
            placeholder="Wyszukaj miasto..."
          />
        </div>

        {szukaneMiasto && (
          <ul className="results">
            {filtrowaneStacje.map((s) => (
              <li
                key={s.id_stacji}
                onClick={() => {
                  setWybraneMiasto(s);
                  setSzukaneMiasto("");
                }}
              >
                {s.stacja}
              </li>
            ))}
          </ul>
        )}

        {wybraneMiasto && (
          <>
            <div className="temperatureCard">

              <h2>{wybraneMiasto.stacja}</h2>
              <div className="date">{getData()}</div>

              <div className="temp">
                {wybraneMiasto.temperatura}°C
              </div>

              <div className="clouds">
                {getZachmurzenie(wybraneMiasto.wilgotnosc_wzgledna)}
              </div>

            </div>

            <div className="detailsCard">

              <p>
                💨 Wiatr: {wybraneMiasto.predkosc_wiatru} m/s
              </p>

              <p>
                💧 Wilgotność: {wybraneMiasto.wilgotnosc_wzgledna} %
              </p>

              <p>
                📈 Ciśnienie: {wybraneMiasto.cisnienie} hPa
              </p>

            </div>
          </>
        )}

      </main>

      {wybraneMiasto && (
        <footer className="footer">
          Ostatni pomiar: {wybraneMiasto.godzina_pomiaru}
        </footer>
      )}
    </div>
  );
}

export default App;