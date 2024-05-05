import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

function StockSearch() {
  const [options, setOptions] = useState([]);
  const history = useNavigate();

  const handleInputChange = (event, value) => {
    if (value) {
      fetch(`/api/autocomplete?query=${value}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setOptions(data || []);
        })
        .catch((error) => {
          console.error("Error fetching autocomplete suggestions:", error);
        });
    } else {
      setOptions([]);
    }
  };

  const handleOptionClick = (event, option) => {
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
          variant="outlined"
          size="small" // Make the TextField smaller
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
            style: { borderRadius: 20 }, // Rounded edges
          }}
          InputLabelProps={{
            style: { color: "var(--text-color)" }, // Using CSS variable for label color
          }}
        />
      )}
      onInputChange={(event, value) => handleInputChange(event, value)}
      onChange={handleOptionClick}
    />
  );
}

export default StockSearch;
