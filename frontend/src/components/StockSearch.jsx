import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function StockSearch() {
  const [options, setOptions] = useState([]);
  const history = useNavigate();

  const handleInputChange = (event, value) => {
    if (value) {
      // Fetch autocomplete suggestions from backend
      fetch(`/autocomplete?query=${value}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Parse JSON response
        })
        .then((data) => {
          setOptions(data || []); // Update options state with fetched suggestions
        })
        .catch((error) => {
          console.error("Error fetching autocomplete suggestions:", error);
        });
    } else {
      // Clear options when input is empty
      setOptions([]);
    }
  };

  const handleOptionClick = (event, option) => {
    // Redirect to the stock page using React Router
    history(`/stock/${option.symbol}`);
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      value={null}
      getOptionLabel={(option) => `${option.symbol} | ${option.name}`}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for a stock..."
          variant="filled"
          onChange={(event) => handleInputChange(event, event.target.value)}
        />
      )}
      onInputChange={(event, value) => handleInputChange(event, value)}
      onChange={handleOptionClick}
    />
  );
}

export default StockSearch;
