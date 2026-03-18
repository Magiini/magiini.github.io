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

  const getZachmurzenie = (wilgotnosc, sumaOpadu) => {
    const w = Number(wilgotnosc);
    const opad = parseFloat(sumaOpadu);
  
    // jeśli pada deszcz
    if ( opad > 0) {
      return `🌧 Deszcz (${opad} mm)`;
    }
  
    // w przeciwnym razie klasyczne zachmurzenie
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
     <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet"></link>

      <nav class="navbar">
      <div class="logo">☀️ CzyJestDeszcz.pl</div>
        <ul>
          <li><a class="active">Pogoda </a></li>
          <li><a href="#news">Ostrzeżenia</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
      
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
            <>
    <div className="temperatureCard">
      <h2>{wybraneMiasto.stacja}</h2>
      <div className="date">
        {getData()} {wybraneMiasto.godzina_pomiaru}:00
      </div>

      <div className="temp">
        {wybraneMiasto.temperatura}°C
      </div>

      <div className="clouds">
        {getZachmurzenie(
          wybraneMiasto.wilgotnosc_wzgledna,
          wybraneMiasto.suma_opadu,
        )}
      </div>
    </div>

  {/* KARTA WIATRU */}

  <div className="windCard">

<h3>Wiatr</h3>

<div className="windCompass">

  <div className="direction north">N</div>
  <div className="direction east">E</div>
  <div className="direction south">S</div>
  <div className="direction west">W</div>

  <div
    className="windArrow"
    style={{
      transform: `rotate(${wybraneMiasto.kierunek_wiatru}deg)`
    }}
  >
    ↑
  </div>

</div>

<div className="windSpeed">
  {wybraneMiasto.predkosc_wiatru} m/s
</div>

</div>

  {/* POZOSTAŁE DANE */}

  <div className="detailsCard">

    <p>
      💧 Wilgotność: {wybraneMiasto.wilgotnosc_wzgledna} %
    </p>

    <p>
      📈 Ciśnienie: {wybraneMiasto.cisnienie} hPa
    </p>

  </div>
</>
          </>
        )}

      </main>

      {wybraneMiasto && (
        <footer className="footer">
          Ostatni pomiar: {wybraneMiasto.godzina_pomiaru}:00
        </footer>
      )}
    </div>
  );
}

export default App;