import { useState, type ChangeEvent } from 'react';
import './App.css';

type Hotel = { _id: string, chain_name: string; hotel_name: string; city: string, country: string };
type City = { _id: string, name: string };
type Country = { _id: string, country: string; countryisocode: string };

const fetchAndFilterHotels = async (value: string) => {
  const hotelsData = await fetch('http://localhost:3001/hotels');
  const hotels = (await hotelsData.json()) as Hotel[];
  return hotels.filter(
    ({ chain_name, hotel_name, city, country }) =>
      chain_name.toLowerCase().includes(value.toLowerCase()) ||
      hotel_name.toLowerCase().includes(value.toLowerCase()) ||
      city.toLowerCase().includes(value.toLowerCase()) ||
      country.toLowerCase().includes(value.toLowerCase())
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ hotels: [], cities: [], countries: [] });
  // const [hotels, setHotels] = useState<Hotel[]>([]);
  const [showClearBtn, setShowClearBtn] = useState(false);

  const fetchData = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      // setHotels([]);
      setShowClearBtn(false);
      return;
    }
    const value = event.target.value;
    setQuery(value);

    if (value.length > 2) {
      const response = await fetch(`/search?q=${value}`);
      const data = await response.json();
      setResults(data);
    } else {
      setResults({ hotels: [], cities: [], countries: [] });
    }

    // const filteredHotels = await fetchAndFilterHotels(event.target.value)
    setShowClearBtn(true);
    // setHotels(filteredHotels);
  };

  const clearSearch = () => {
    setQuery('');
    setResults({ hotels: [], cities: [], countries: [] });
  };

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="dropdown">
              <div className="form">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Search accomodation..."
                  onChange={fetchData}
                />
                {showClearBtn && (
                  <span className="left-pan">
                    <i className="fa fa-close"></i>
                  </span>
                )}
              </div>
              {
                !!results.hotels.length && (
                <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
                  <h2>Hotels</h2>
                  <ul>
                    {results.hotels.map((hotel: any, index: number) => (
                        <li key={index}>{hotel.hotel_name} - {hotel.city}, {hotel.country}</li>
                    ))}
                  </ul>
                  {results.hotels.length ? results.hotels.map((hotel: any, index) => (
                    <li key={index}>
                      <a href={`/hotels/${hotel._id}`} className="dropdown-item">
                        <i className="fa fa-building mr-2"></i>
                        {hotel.hotel_name}
                      </a>
                      <hr className="divider" />
                    </li>
                  )) : <p>No hotels matched</p>}
                  <h2>Countries</h2>
                  <ul>
                    {results.countries.map((country: any, index: number) => (
                        <li key={index}>{country.country}</li>
                    ))}
                  </ul>
                  <p>No countries matched</p>
                  <h2>Cities</h2>
                  <ul>
                    {results.cities.map((city: any, index: number) => (
                        <li key={index}>{city.name}</li>
                    ))}
                  </ul>
                  <p>No cities matched</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
