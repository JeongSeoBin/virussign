import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./style/calendar.css";

function App() {
  const [items, setItems] = useState(null);

  async function callAPI(date = "") {
    const request = "/stat";
    const params = {
      params: {
        date: date,
      },
    };

    await axios.get(request, params).then((response) => {
      console.log("response", response);
      setItems(response);
    });
  }

  useEffect(() => {
    const today = new Date();

    // YYYYMM
    const parseDate = new Date(Date.parse(today))
      .toISOString()
      .substring(0, 8)
      .replace(/-/g, "");
    //console.log("parseDate", parseDate);

    callAPI(parseDate);
  }, []);

  const onClickMonth = (value, event) => {
    // console.log("onClickMonth", value, event); // 1월 클릭시 Fri Jan 01 2021 00:00:00 GMT+0900
    // 2021년 1월의 데이터를 가져온다

    // 202111
    const offset = new Date().getTimezoneOffset() * 60000;
    const parseDate = new Date(Date.parse(value) - offset)
      .toISOString()
      .substring(0, 8)
      .replace(/-/g, "");
    // console.log("parseDate", parseDate);

    callAPI(parseDate);
  };

  const onClickYear = (value, event) => {
    // console.log("onClickYear", value, event); // 2021 클릭시 Fri Jan 01 2021 00:00:00 GMT+0900
    // 2021년도의 1월부터 12월까지의 데이터를 가져온다

    // 2021
    const offset = new Date().getTimezoneOffset() * 60000;
    const parseDate = new Date(Date.parse(value) - offset)
      .toISOString()
      .substring(0, 4)
      .replace(/-/g, "");
    // console.log("parseDate", parseDate);

    callAPI(parseDate);
  };

  const onClickDecade = (value, event) => {
    // console.log("onClickDecade", value); // 2021-2030 클릭시 Fri Jan 01 2021 00:00:00 GMT+0900
    // 2021포함 10년의 데이터를 년도 단위로 불러온다

    callAPI();
  };

  /////////////////////////////////////////

  const onActiveStartDateChange = ({
    action,
    activeStartDate,
    value,
    view,
  }) => {
    console.log("onActiveStartDateChange");
    console.log(action); //prev, prev2, next, next2/ drillup
    console.log(activeStartDate); // Fri Oct 01 2021 00:00:00 GMT+0900, Sun Nov 01 2020 00:00:00 GMT+0900, Wed Dec 01 2021 00:00:00 GMT+0900, Tue Nov 01 2022 00:00:00 GMT+0900 (한국 표준시)
    console.log(value); // Wed Nov 03 2021 13:37:01 GMT+0900, Wed Nov 03 2021 13:39:44 GMT+0900
    console.log(view); // month, month

    const offset = new Date().getTimezoneOffset() * 60000;
    let parseDate;
    switch (view) {
      case "month":
        // 202111
        parseDate = new Date(Date.parse(activeStartDate) - offset)
          .toISOString()
          .substring(0, 8)
          .replace(/-/g, "");

        callAPI(parseDate);
        break;
      case "year":
        // 2021
        parseDate = new Date(Date.parse(activeStartDate) - offset)
          .toISOString()
          .substring(0, 4)
          .replace(/-/g, "");

        callAPI(parseDate);
        break;
      case "decade":
        callAPI();
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Calendar
        className="calendar"
        value={new Date()}
        onClickMonth={onClickMonth}
        onClickYear={onClickYear}
        onClickDecade={onClickDecade}
        onActiveStartDateChange={onActiveStartDateChange}
        tileContent={(date, view) => {
          const offset = new Date().getTimezoneOffset() * 60000;
          // YYYYMMDD
          const parsedDate = new Date(Date.parse(date.date) - offset)
            .toISOString()
            .substring(0, 10)
            .replace(/-/g, "");

          if (!items) return null;

          const pick = items.data.message.find(
            (item) =>
              item.YYYYMMDD ===
              parsedDate.substring(0, item.YYYYMMDD.trim().length)
          );
          return pick ? <p>{pick.YYYYMMDD}</p> : null;
        }}
      />
    </div>
  );
}

export default App;
