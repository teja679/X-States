import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { isDisabled } from '@testing-library/user-event/dist/utils';

function App() {
  const [isStateDisabled, setIsStateDisabled] = useState(true);
  const [isCityDisabled, setIsCityDisabled] = useState(true);

  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')

  const [states, setStates] = useState([])
  const [countries, setCountries] = useState([])
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
        setIsStateDisabled(false);
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
        setIsCityDisabled(false)
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

        <select id='select-state' onChange={handleStateChange} disabled={isStateDisabled}>
          <option value=''>Select State</option>
          {states.map(item => (
            <option value={item} key={item}>{item}</option>
          ))}
        </select>
        <select id='select-city' onChange={handleCityChange} disabled={isCityDisabled}>
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
