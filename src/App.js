import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [displayMessage, setDisplayMessage] = useState('')
  const API_ENDPOINT = "https://crio-location-selector.onrender.com";

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/countries`);
      setCountries(response.data);
    } catch (err) {
      console.error('Failed to fetch Countries');
    }
  }
  const fetchStates = async (countryName) => {
    try {
      if (countryName) {
        setDisplayMessage('')
        const response = await axios.get(`${API_ENDPOINT}/country=${countryName}/states`);
        setStates(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch States');
    }
  }
  const fetchCities = async (countryName, stateName) => {
    try {
      if (countryName && stateName) {
        setDisplayMessage('')
        const response = await axios.get(`${API_ENDPOINT}/country=${countryName}/state=${stateName}/cities`);
        setCities(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch Cities');
    }
  }
  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    fetchStates(e.target.value);
  }
  const handleStateChange = (e) => {
    setState(e.target.value);
    fetchCities(country, e.target.value);
  }
  const handleCityChange = (e) => {
    setCity(e.target.value);

    setDisplayMessage(true)
  }
  useEffect(() => {
    fetchCountries();
  }, []);


  return (
    <div className="App">
      <h1>Select Location</h1>
      <section className='main-div'>
        <select id='select-country' onChange={handleCountryChange}>
          <option value=''>Select Country</option>
          {countries.map(item => (
            <option value={item} key={item}>{item}</option>
          ))}
        </select>

        <select id='select-state' onChange={handleStateChange}>
          <option value=''>Select State</option>
          {states.map(item => (
            <option value={item} key={item}>{item}</option>
          ))}
        </select>
        <select id='select-city' onChange={handleCityChange}>
          <option value=''>Select City</option>
          {cities.map(item => (
            <option value={item} key={item}>{item}</option>
          ))}
        </select>
      </section>
      <section>
        {displayMessage &&
          <div className='display-message'>
            You selected <span className='city'>{city}</span>,
            <span className='state-country'> {state}, {country}</span>
          </div>}
      </section>
    </div>
  );
}

export default App;
