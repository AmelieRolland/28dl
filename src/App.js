import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import "./App.css";

function App() {
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [cycleDates, setCycleDates] = useState([]);
  const [nextPeriodStart, setNextPeriodStart] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
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
    setNextPeriodStart(nextCycleStart.format("DD MMMM YYYY"));

    for (let i = 0; i < 7; i++) {
      const nextPeriodStart = start.add(i * cycleLength, "day");

      for (let j = 0; j < periodDays; j++) {
        const periodDate = nextPeriodStart.add(j, "day");
        nextDates.push({
          date: periodDate.format("YYYY-MM-DD"),
          type: "period",
          advice:
            "Time to rest 🩸 Take it easy, rest up and recharge your energy 🩸 You've earned it!",
        });
      }

      // SPM
      for (let j = 1; j <= spmDays; j++) {
        const spmDate = nextPeriodStart.subtract(j, "day");
        nextDates.push({
          date: spmDate.format("YYYY-MM-DD"),
          type: "spm",
          advice:
            "Right in your SPM! Time to have some self-care 💗 You got this, queen!",
        });
      }

      // OVULATION DAY
      const ovulationDate = nextPeriodStart.add(ovulationDay, "day");
      nextDates.push({
        date: ovulationDate.format("YYYY-MM-DD"),
        type: "ovulation",
        advice: "🤰 Ovulation Day! Time to dare and to be fantastic 💗",
      });

      // OVULATION PERIOD
      for (let j = 1; j <= highPhaseBefore; j++) {
        const highBeforeDate = ovulationDate.subtract(j, "day");
        nextDates.push({
          date: highBeforeDate.format("YYYY-MM-DD"),
          type: "high",
          advice:
            "✨ You're on fire! ✨ Time to get your work done and to be proud 💗",
        });
      }
      for (let j = 1; j <= highPhaseAfter; j++) {
        const highAfterDate = ovulationDate.add(j, "day");
        nextDates.push({
          date: highAfterDate.format("YYYY-MM-DD"),
          type: "high",
          advice:
            "✨ You're on fire! ✨ Time to get your work done and to be proud 💗",
        });
      }
    }

    setCycleDates(nextDates);
  };

  const getTodayAdvice = () => {
    const today = dayjs().format("YYYY-MM-DD");
    const cycleDay = cycleDates.find((d) => d.date === today);
    return cycleDay
      ? cycleDay.advice
      : "✨ Normal, just be normal, enjoy the ride and chill out: everything is fine ✨";
  };

  useEffect(() => {
    if (cycleDates.length > 0) {
      setCycleAdvice(getTodayAdvice());
    }
  }, [cycleDates]);

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
    <div className="p-4">
      <div className="mx-auto w-full text-white pt-16">
        <h1 className="pb-16 text-5xl md:text-6xl text-red-600 mx-auto text-center">
          🩸💗28 Days Later💗🩸
        </h1>

        <label className="text-lg block mx-auto text-center pb-4">
          Enter the first day of your last period:
        </label>

        <div className="flex flex-row justify-center pb-8 items-center gap-4 mt-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-500 bg-white !important text-black rounded"
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
          <div className="relative flex flex-col justify-center bg-white rounded-lg p-6 shadow-[8px_8px_0px_#ff668b,16px_16px_0px_#9333ea] w-4/5 md:w-1/3 max-w-md mx-auto mb-12">
            <h2 className="text-center text-2xl mt-4"> Today is :</h2>
            <p className="text-center text-lg mt-4">{cycleAdvice}</p>
          </div>
          <div className="relative flex flex-col justify-center border-2 border-red-600 rounded-lg p-6 max-w-full mx-auto inline-flex">
            <p className="text-center text-lg text-red-600">
              Your next period will start on:
              <span className="nextperiod text-xl"> {nextPeriodStart}</span>
            </p>
          </div>
          <div className="flex flex-row justify-center flex-wrap gap-4 mt-2">
            {[...Array(6)].map((_, i) => (
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
        </div>
      )}
    </div>
  );
}

export default App;
