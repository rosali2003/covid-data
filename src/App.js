import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';

const App = (event) => {
  const [countryData, setCountryData] = useState([]);
  const [homePage, setHomePage] = useState(true);
  const [rankResults, setRankResults] = useState(false);
  const [category, setCategory] = useState("");
  const [display, setDisplay] = useState("");
  
  const fetchData = () => {
    fetch("https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true")
      .then((response) => {
        return response.json();
      }).then((data) => {
        setCountryData(data);
      });
  };

  const rankCases = () => {
    return [...countryData].sort((a, b) => (a[`${category}`] < b[`${category}`]) || (a[`${category}`] === null) || (a[`${category}`] === "NA") ? 1 : -1);
  };

  const getLargestCase = (data) => {
    return [...data].reduce((a, b) => (a[`${category}`] > b[`${category}`]) ? a : b, 0)[`${category}`];
  };

  const getFilteredData = (data) => {
    return data.filter((country) => country[`${category}`] !== null && country[`${category}`] !== "NA");
  };

  const displayResults = () => {
    if (category !== "" && display !== "") {
      setHomePage(false);
      fetchData();
    } else {
      alert("Please select a display and a category");
    }
  };

  const displayTable = (data) => {
    return data.map((country, index) => {
      const num = (country[`${category}`] === null || country[`${category}`] === "NA") ? "N/A" : country[`${category}`];
      return (
        <tr key={`${index}`}>
          <td>{country.country}</td>
          <td>{num}</td>
        </tr>
      );
    });
  };

  const displayBarGraph = (data) => {
    if (data.length !== 0) {
      const filteredData = getFilteredData([...data]);
      const largestCase = getLargestCase(filteredData);
      return filteredData.map((country, index) => {
        const countryName = (country.country === "Czech Republic" || country.country === "Russia") ? country.country.substring(0, 2) : (country.country === "South Korea") ? "KR" : country.country;
        return (
          <div key={`${index}`} className="countryBarContainer" style={{width: 160 + country[`${category}`] / largestCase * 1000 + "px"}}>
            <div className="countryBar">
              <img src={"https://countryflagsapi.com/svg/" + `${countryName}`}></img>
              <p>{`${country.country}`}</p>
            </div>
          </div>
        );
      });
    }
  };

  const settingButtons = () => {
    return (
      <>
        <button onClick={handleBackButton}>Back</button>
        <button onClick={handleSortButton}>{(rankResults) ? "Refresh Data" : "Sort Data"}</button>
      </>
    );
  };

  const handleBackButton = (event) => {
    event.preventDefault();
    setHomePage(!homePage);
  }

  const handleSortButton = (event) => {
    event.preventDefault();
    setRankResults(!rankResults);
  }

  const currentDisplay = () => {
    if (homePage) {
      return (
        <>
          <div id="homePage">
            <h1>COVID Data</h1>
            <div id="optionsContainer">
              <select name="category" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">Select a category</option>
                <option value="infected">Infected</option>
                <option value="tested">Tested</option>
                <option value="recovered">Recovered</option>
              </select>
              <select name="display" value={display} onChange={(event) => setDisplay(event.target.value)}>
                <option value="">Select a display</option>
                <option value="table">Table</option>
                <option value="graph">Graph</option>
              </select>
            </div>
            <button onClick={displayResults}>Generate Data</button>
          </div>
        </>
      );
    } else if (display === "table") {
      return (
        <>
          <h1>{"Table: " + category[0].toUpperCase() + category.slice(1)}</h1>
          {settingButtons()}
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>{category[0].toUpperCase() + category.slice(1)}</th>
              </tr>
            </thead>
            <tbody>
              {displayTable(rankResults ? rankCases() : countryData)}
            </tbody>
          </table>
        </>
      );
    } else if (display === "graph") {
      return (
        <>
          <h1>{"Graph: " + category[0].toUpperCase() + category.slice(1)}</h1>
          {settingButtons()}
          <div id="barGraphContainer">
            {displayBarGraph(rankResults ? rankCases() : countryData)}
          </div>
        </>
      );
    }
  };

  return (
    <>
      {currentDisplay()}
    </>
  );
}

export default App;
