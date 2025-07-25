import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Client from "./client";
import District from "./district";
import City from "./city";
import Location from "./location";
import SensorCard from "./sensorcard";
import axios from "axios";
import Macid from "./macid";
import Refid from "./refid";
import "./index.css";

function Home(props) {
  const navigate = useNavigate();
  const [s, sets] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const val = JSON.parse(sessionStorage.getItem("user"));
    let val2 = JSON.parse(sessionStorage.getItem("filter"));
    if (!val2) {
      sessionStorage.setItem("filter", JSON.stringify({ cs: "", ds: "", cis: "", ls: "", rs: "", ms: "" }));
    }
    if (!val) {
      navigate("/");
    } else {
      axios
        .post("https://mitzvah-software-for-smart-air-curtain.onrender.com/get-name", {
          username: val.username,
          password: val.password,
        })
        .then((res) => {
          if (res.data.flag === "client") {
            props.setcs(res.data.name);
            props.setcis(res.data.city);
            props.setls(res.data.location);
            props.setds(res.data.district);
            setTimeout(() => {
              props.setlogin("Client");
            }, 10);
          } else if (res.data.flag === "admin") {
            axios
              .post("https://mitzvah-software-for-smart-air-curtain.onrender.com/user-role", { name: val.username })
              .then(response => {
                if (response.data.role === "admin") {
                  setIsAdmin(true);
                } else {
                  setIsAdmin(false);
                }
              })
              .catch(err => {
                console.error("Error checking user role", err);
              });

            props.setcs(val2.cs);
            props.setls(val2.ls);
            props.setcis(val2.cis);
            props.setds(val2.ds);
            props.setdname(val2.ms);
            props.setrefname(val2.rs);
            setTimeout(() => {
              props.setlogin("Admin");
            }, 10);
          } else {
            sessionStorage.clear();
            navigate("/");
          }
        });
    }
  }, [props.login]);

  useEffect(() => {
    const interval = setInterval(() => {
      sets(prev => prev + 1);
    }, 3000000);
    return () => clearInterval(interval);
  }, []);

  function display(event) {
    event.target.disabled = true;
    setTimeout(() => {
      event.target.disabled = false;
    }, 2000);
    sets(s + 1);
  }

  function change(id, val) {
    const val2 = JSON.parse(sessionStorage.getItem("filter")) || { cs: "", ds: "", cis: "", ls: "", rs: "", ms: "" };

    switch (id) {
      case "client-select":
        props.setcs(val);
        val2.cs = val;
        break;
      case "district-select":
        props.setds(val);
        val2.ds = val;
        break;
      case "city-select":
        props.setcis(val);
        val2.cis = val;
        break;
      case "macid-select":
        props.setdname(val);
        val2.ms = val;
        break;
      case "refid-select":
        props.setrefname(val);
        val2.rs = val;
        break;
      default:
        props.setls(val);
        val2.ls = val;
    }

    sessionStorage.setItem("filter", JSON.stringify(val2));
  }

  return (
    <>
      <div className="search-bar">
        <Client change={change} cs={props.cs} login={props.login} />
        <District ds={props.ds} change={change} login={props.login} />
        <City cis={props.cis} change={change} login={props.login} />
        <Location ls={props.ls} change={change} login={props.login} />
        <Macid
          dname={props.dname}
          cs={props.cs}
          ls={props.ls}
          change={change}
          ds={props.ds}
          cis={props.cis}
          refname={props.refname}
          login={props.login}
        />
        <Refid
          dname={props.dname}
          refname={props.refname}
          cs={props.cs}
          ls={props.ls}
          change={change}
          ds={props.ds}
          cis={props.cis}
          login={props.login}
        />
        <button id="search-button" onClick={display}>
          Search/Reload
        </button>
      </div>

      <SensorCard
        ok={props.ok}
        s={s}
        id_view={props.id_view}
        ls={props.ls}
        cs={props.cs}
        ds={props.ds}
        cis={props.cis}
        isLf={props.isLf}
        login={props.login}
        dname={props.dname}
        refname={props.refname}
        sets={sets}
      />
    </>
  );
}

export default Home;
