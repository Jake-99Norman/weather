package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type WeatherResponse struct {
	City        string  `json:"city"`
	Temp        float64 `json:"temp"`
	Description string  `json:"description"`
}

// Handler is the exported function Vercel expects
func Handler(w http.ResponseWriter, r *http.Request) {
	// Get the "city" query parameter: /api/weather?city=London
	city := r.URL.Query().Get("city")
	if city == "" {
		http.Error(w, "City query parameter is required", http.StatusBadRequest)
		return
	}

	apiKey := "6273b4868f1b471db3d222510240306"
	url := fmt.Sprintf("https://api.weatherapi.com/v1/current.json?key=%s&q=%s&aqi=no", apiKey, city)

	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Could not get weather", http.StatusBadRequest)
		return
	}
	defer resp.Body.Close()

	// Decode the API response into a struct
	var apiResp struct {
		Location struct {
			Name string `json:"name"`
		} `json:"location"`
		Current struct {
			TempC     float64 `json:"temp_c"`
			Condition struct {
				Text string `json:"text"`
			} `json:"condition"`
		} `json:"current"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		http.Error(w, "Could not decode weather data", http.StatusInternalServerError)
		return
	}

	// Build our simplified response
	weather := WeatherResponse{
		City:        apiResp.Location.Name,
		Temp:        apiResp.Current.TempC,
		Description: apiResp.Current.Condition.Text,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(weather)
}
