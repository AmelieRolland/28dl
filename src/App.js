import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import "./App.css";

function App() {
  const [startDate, setStartDate] = useState("");
  const [cycleDates, setCycleDates] = useState([]);
  const [nextPeriodStart, setNextPeriodStart] = useState("");
  const [cycleAdvice, setCycleAdvice] = useState("");

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

    const nextCycleStart = start.add(cycleLength, "day");
    setNextPeriodStart(nextCycleStart.format("YYYY-MM-DD"));

    for (let i = 0; i < 7; i++) {
      const nextPeriodStart = start.add(i * cycleLength, "day");

      // In nextDates array, I add :
      // Period days
      for (let j = 0; j < periodDays; j++) {
        nextDates.push({
          date: nextPeriodStart.add(j, "day").format("YYYY-MM-DD"),
          type: "period",
        });
        if (i === 0 && j === 0) {
          setCycleAdvice("Time to rest 🩸 ");
        }
      }

      // SPM period
      for (let j = 1; j <= spmDays; j++) {
        nextDates.push({
          date: nextPeriodStart.subtract(j, "day").format("YYYY-MM-DD"),
          type: "spm",
        });
        if (i === 0 && j === 0) {
          setCycleAdvice(
            "Right in your SPM! Time to have some self-care 💗 You got this! "
          );
        }
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
        if (i === 0 && j === periodDays) {
          adviceText =
            "Best time of the month! time to dare and to be fantastic 💗";
        }
      }
      for (let j = 1; j <= highPhaseAfter; j++) {
        nextDates.push({
          date: ovulationDate.add(j, "day").format("YYYY-MM-DD"),
          type: "high",
        });
        if (i === 0 && ovulationDay === 14) {
          adviceText =
            "✨ You're on fire ! ✨ Time to get your work done and to be proud 💗";
        }
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
        <div className="calendar-container flex flex-col justify-center mt-4">
          <p className="text-center text-lg text-white">
            Your next period will start on: {nextPeriodStart}
          </p>
          <p>{cycleAdvice}</p>
          <div className="flex flex-row justify-center flex-wrap gap-4 mt-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="calendar-wrapper">
                <Calendar
                  tileClassName={tileClassName}
                  tileContent={tileContent}
                  view="month"
                  activeStartDate={
                    new Date(
                      dayjs()
                        .add(i + 1, "month")
                        .startOf("month")
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
