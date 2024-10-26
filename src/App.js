import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const API_ENDPOINT = "https://crio-location-selector.onrender.com";

  const [location, setLocation] = useState({ country: '', state: '', city: '' });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [displayMessage, setDisplayMessage] = useState(false);

  const fetchData = async (endpoint, setter, disableSetter = null) => {
    try {
      const response = await axios.get(endpoint);
      setter(response.data);
      if (disableSetter) disableSetter(false);
    } catch (err) {
      console.error(`Failed to fetch data from ${endpoint}`);
    }
  };

  useEffect(() => {
    fetchData(`${API_ENDPOINT}/countries`, setCountries);
  }, []);

  useEffect(() => {
    if (location.country) {
      setStates([]);
      fetchData(`${API_ENDPOINT}/country=${location.country}/states`, setStates, () => setDisplayMessage(false));
    }
  }, [location.country]);

  useEffect(() => {
    if (location.state) {
      setCities([]);
      fetchData(`${API_ENDPOINT}/country=${location.country}/state=${location.state}/cities`, setCities, () => setDisplayMessage(false));
    }
  }, [location.state]);

  const handleChange = (e, type) => {
    const value = e.target.value;
    setLocation(prev => ({
      ...prev,
      [type]: value,
      ...(type === 'country' ? { state: '', city: '' } : type === 'state' ? { city: '' } : {})
    }));
    setDisplayMessage(false);
  };

  useEffect(() => {
    if (location.city) setDisplayMessage(true);
  }, [location.city]);

  return (
    <div className="App">
      <h1>Select Location</h1>
      <section className='main-div'>
        <select onChange={(e) => handleChange(e, 'country')} value={location.country}>
          <option value='' disabled>Select Country</option>
          {countries.map(item => <option value={item} key={item}>{item}</option>)}
        </select>

        <select onChange={(e) => handleChange(e, 'state')} value={location.state} disabled={!location.country}>
          <option value='' disabled>Select State</option>
          {states.map(item => <option value={item} key={item}>{item}</option>)}
        </select>

        <select onChange={(e) => handleChange(e, 'city')} value={location.city} disabled={!location.state}>
          <option value='' disabled>Select City</option>
          {cities.map(item => <option value={item} key={item}>{item}</option>)}
        </select>
      </section>

      {displayMessage && (
        <section className='display-message'>
          You selected <span className='city'>{location.city}</span>,
          <span className='state-country'> {location.state}, {location.country}</span>
        </section>
      )}
    </div>
  );
}

export default App;
