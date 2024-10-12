package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type WeatherResponse struct {
	City        string  `json:"city"`
	Temp        float64 `json:"temp"`
	Description string  `json:"description"`
}

func GetWeather(c *gin.Context) {
	city := c.Param("city")
	apiKey := "6273b4868f1b471db3d222510240306"
	url := fmt.Sprintf("https://api.weatherapi.com/v1/current.json?key=%s&q=%s&aqi=no", apiKey, city)

	resp, err := http.Get(url)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not get weather"})
		return
	}
	defer resp.Body.Close()

	var weatherResponse WeatherResponse
	if err := json.NewDecoder(resp.Body).Decode(&weatherResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not decode weather"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"city":        weatherResponse.City,
		"temp":        weatherResponse.Temp,
		"description": weatherResponse.Description,
	})
}

func main() {
	router := gin.Default()
	router.GET("/api/weather/:city", GetWeather)
	router.Run(":8080")

}