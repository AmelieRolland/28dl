import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import "./App.css";

function App() {
  const [startDate, setStartDate] = useState("");
  const [cycleDates, setCycleDates] = useState([]);

  const cycleLength = 28;
  const periodDays = 5;
  const spmDays = 4;
  const ovulationDay = 14;
  const highPhaseBefore = 5;
  const highPhaseAfter = 1;

  const calculateCycles = () => {
    if (!startDate) return;
    const start = dayjs(startDate);
    const nextDates = [];

    for (let i = 0; i < 7; i++) {
      const nextPeriodStart = start.add(i * cycleLength, "day");

      // In nextDates array, I add :
      // Period days
      for (let j = 0; j < periodDays; j++) {
        nextDates.push({
          date: nextPeriodStart.add(j, "day").format("YYYY-MM-DD"),
          type: "period",
        });
      }

      // SPM period
      for (let j = 1; j <= spmDays; j++) {
        nextDates.push({
          date: nextPeriodStart.subtract(j, "day").format("YYYY-MM-DD"),
          type: "spm",
        });
      }

      // Ovulation day
      const ovulationDate = nextPeriodStart.add(ovulationDay, "day");
      nextDates.push({
        date: ovulationDate.format("YYYY-MM-DD"),
        type: "ovulation",
      });

      // Ovulation period
      for (let j = 1; j <= highPhaseBefore; j++) {
        nextDates.push({
          date: ovulationDate.subtract(j, "day").format("YYYY-MM-DD"),
          type: "high",
        });
      }
      for (let j = 1; j <= highPhaseAfter; j++) {
        nextDates.push({
          date: ovulationDate.add(j, "day").format("YYYY-MM-DD"),
          type: "high",
        });
      }
    }

    setCycleDates(nextDates);
  };

  const tileClassName = ({ date }) => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    const cycleDay = cycleDates.find((d) => d.date === dateStr);

    if (!cycleDay) return "";
    if (cycleDay.type === "period") return "period-band";
    if (cycleDay.type === "ovulation") return "ovulation-day";
    if (cycleDay.type === "high") return "ovulation-period";
  };

  const tileContent = ({ date }) => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    const cycleDay = cycleDates.find((d) => d.date === dateStr);

    if (cycleDay?.type === "spm") {
      return <span className="spm-emoji">☠️</span>;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-pink-300  p-4">
      <div className="mx-auto w-full text-white">
        <h1 className="pt-22 pb-18 text-6xl text-red-600 mx-auto text-center">
          🩸💗28 Days Later💗🩸
        </h1>

        <label className="text-lg block mx-auto text-center">
          Enter the first day of your last period:
        </label>

        <div className="flex flex-row justify-center pb-16 items-center gap-4 mt-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded"
          />

          <button
            className="px-4 py-2 bg-red-400 text-white rounded"
            onClick={calculateCycles}
          >
            Go
          </button>
        </div>
      </div>

      {cycleDates.length > 0 && (
        <div className="calendar-container flex justify-center mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="calendar-wrapper">
              <Calendar
                tileClassName={tileClassName}
                tileContent={tileContent}
                view="month"
                activeStartDate={
                  new Date(dayjs().add(i, "month").startOf("month"))
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
