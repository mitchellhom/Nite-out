import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { TextField, Link } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddLocation from "./Geomap";
import { addLocation } from "./app/locations.js";
// import { useCreateTripMutation } from "./app/tripsApi";

const theme = createTheme();

export default function Trip() {
  let locations = useSelector((state) => state.addLocations.value);
  // const [createTrip, result] = useCreateTripMutation;
  const [notFinished, setNotFinished] = useState(true);
  const locationsMapRef = useRef();
  const date = new Date();
  const dateTime = date.getTime().toString();

  const [tripName, setTripName] = useState("");
  const [description, setDescription] = useState("");
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // createTrip(tripName, locations, description, dateTime);
    const data = {
      trip_name: tripName,
      locations: locations,
      description: description,
      created_on: dateTime,
    };
    const tripUrl = "http://localhost:8001/trips";
    const fetchConfig = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const tripResponse = await fetch(tripUrl, fetchConfig);
    if (tripResponse.ok) {
      const newTrip = await tripResponse.json();
      const tripId = newTrip.id;
      locations.forEach(async (bar_id, position) => {
        const data = {
          trip_id: tripId,
          bar_id: bar_id,
          positions: position,
        };
        const middleUrl = "http://localhost:8001/middletable";
        const fetchConfig = {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        };
        const middleResponse = await fetch(middleUrl, fetchConfig);
        if (middleResponse.ok) {
          return true;
        }
      });
      clearState();
    }
  };
  const clearState = () => {
    setTripName("");
    setDescription("");
    dispatch(addLocation([]));
  };

  useEffect(() => {
    if (locations.length > 0) {
      setNotFinished(false);
      setClicked(false);
    }
  }, [locations]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {" "}
            Create a Trip{" "}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              required
              onChange={(event) => setTripName(event.target.value)}
              value={tripName}
              margin="normal"
              fullWidth
              id=""
              label="Trip Name"
              name=""
            />
            <Link to="#yelpMap">
              <Button
                type="button"
                fullWidth
                variant="outlined"
                onClick={(event) => setClicked(true)}
                sx={{ mt: 3, mb: 2 }}
              >
                {" "}
                Add Locations{" "}
              </Button>
            </Link>
            <TextField
              required
              margin="normal"
              fullWidth
              id="outlined-multiline-static"
              multiline
              label="Description"
              name=""
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            {!clicked && locations.length > 0 && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {" "}
                Submit{" "}
              </Button>
            )}
          </Box>

          {clicked && notFinished && (
            <>
              <div ref={locationsMapRef}>
                <AddLocation key="234" />
              </div>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}