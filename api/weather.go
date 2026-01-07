package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type WeatherResponse struct {
	City        string  `json:"city"`
	Temp        float64 `json:"temp"`
	Description string  `json:"description"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	city := r.URL.Query().Get("city")
	if city == "" {
		http.Error(w, "City query parameter is required", http.StatusBadRequest)
		return
	}

	apiKey := os.Getenv("WEATHER_API_KEY")
	if apiKey == "" {
		http.Error(w, "Weather API key not set", http.StatusInternalServerError)
		return
	}

	url := fmt.Sprintf("https://api.weatherapi.com/v1/current.json?key=%s&q=%s&aqi=no", apiKey, city)
	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Could not get weather", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, "Weather API returned an error", http.StatusBadGateway)
		return
	}

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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(WeatherResponse{
		City:        apiResp.Location.Name,
		Temp:        apiResp.Current.TempC,
		Description: apiResp.Current.Condition.Text,
	})
}
