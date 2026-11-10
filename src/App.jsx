

import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("milkRecords");
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [quantity, setQuantity] = useState(1);
  const [rate, setRate] = useState(60);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    localStorage.setItem("milkRecords", JSON.stringify(records));
  }, [records]);

  const monthRecords = records[monthKey] || {};

  const selectDay = (day) => {
    setSelectedDay(day);
    const record = monthRecords[day];
    setQuantity(record?.quantity ?? 1);
  };

  const updateStatus = (status) => {
    setRecords((prev) => ({
      ...prev,
      [monthKey]: {
        ...(prev[monthKey] || {}),
        [selectedDay]: {
          status,
          quantity: status === "received" ? Number(quantity) : 0,
        },
      },
    }));
  };

  const updateQuantity = (value) => {
    setQuantity(value);
    setRecords((prev) => ({
      ...prev,
      [monthKey]: {
        ...(prev[monthKey] || {}),
        [selectedDay]: {
          status: "received",
          quantity: Number(value),
        },
      },
    }));
  };

  const changeMonth = (direction) => {
    setCurrentDate(
      new Date(year, month + direction, 1)
    );
    setSelectedDay(1);
    setQuantity(1);
  };

  const receivedDays = Object.values(monthRecords).filter(
    (item) => item.status === "received"
  ).length;

  const absentDays = Object.values(monthRecords).filter(
    (item) => item.status === "not-received"
  ).length;

  const totalMilk = Object.values(monthRecords).reduce(
    (sum, item) =>
      sum + (item.status === "received" ? Number(item.quantity) : 0),
    0
  );

  const totalBill = totalMilk * rate;

  const selectedRecord = monthRecords[selectedDay];
  const selectedStatus = selectedRecord?.status || "not-marked";

  return (
    <div className="app">
      <header className="header">
        <h1>🥛 दूध का हिसाब</h1>
        <p>Your Monthly Milk Tracker</p>
      </header>

      <main className="container">
        <div className="month-heading">
          <button onClick={() => changeMonth(-1)}>❮</button>
          <h2>{monthName}</h2>
          <button onClick={() => changeMonth(1)}>❯</button>
        </div>

        <div className="calendar">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <div className="weekday" key={day}>{day}</div>
            )
          )}

          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const status = monthRecords[day]?.status;

            return (
              <button
                key={day}
                className={`calendar-day ${status || ""} ${
                  selectedDay === day ? "selected" : ""
                }`}
                onClick={() => selectDay(day)}
              >
                <span>{day}</span>
                <small>
                  {status === "received"
                    ? "✓"
                    : status === "not-received"
                    ? "✕"
                    : "·"}
                </small>
              </button>
            );
          })}
        </div>

        <div className="legend">
          <span>🟢 Received</span>
          <span>🔴 Not received</span>
          <span>⚪ Not marked</span>
        </div>

        <section className="daily-section">
          <h3>Daily Milk Entry – {selectedDay} {monthName}</h3>

          <label>Milk quantity (litres)</label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <div className="action-buttons">
            <button
              className="received-btn"
              onClick={() => updateStatus("received")}
            >
              ✓ Milk Received
            </button>

            <button
              className="absent-btn"
              onClick={() => updateStatus("not-received")}
            >
              ✕ Not Received
            </button>
          </div>

          <p className="current-status">
            Current status: <strong>{selectedStatus}</strong>
          </p>
        </section>

        <section className="summary">
          <h3>Monthly Summary</h3>

          <div className="summary-grid">
            <div className="summary-card green">
              <h2>{receivedDays}</h2>
              <p>Days Received</p>
            </div>

            <div className="summary-card red">
              <h2>{absentDays}</h2>
              <p>Days Not Received</p>
            </div>

            <div className="summary-card blue">
              <h2>{totalMilk.toFixed(1)} L</h2>
              <p>Total Milk</p>
            </div>

            <div className="summary-card yellow">
              <h2>₹{totalBill.toFixed(2)}</h2>
              <p>Monthly Bill</p>
            </div>
          </div>

          <div className="rate-section">
            <label>Milk price per litre (₹)</label>
            <input
              type="number"
              min="0"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>

          <h3 className="final-bill">
            Total Amount: ₹{totalBill.toFixed(2)}
          </h3>
        </section>
      </main>

      <footer>
        <p>Made with ❤️ | दूध का हिसाब</p>
      </footer>
    </div>
  );
}

export default App;