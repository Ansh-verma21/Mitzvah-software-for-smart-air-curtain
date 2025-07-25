import React, { useEffect, useState } from "react";
import axios from "axios";

function District(props) {
  const [data, setdata] = useState([]);

  function callit(event) {
    props.change(event.target.id, event.target.value);
  }

  useEffect(() => {
    if ((props.login === "Admin" || props.login === "Client") && data.length === 0) {
      axios.get("https://mitzvah-software-for-smart-air-curtain.onrender.com/district-select").then((res) => {
        setdata(res.data);
      });
    }
  }, [props.login]);

  return (
    <select id="district-select" onChange={callit} value={props.ds}>
      <option id="2" value="">
        Select District
      </option>
      {data.map((ele) => {
        return (
          <option key={ele} id={ele} value={ele}>
            {ele}
          </option>
        );
      })}
    </select>
  );
}

export default District;
