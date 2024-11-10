// Copy the SensorDashboard code we had before
// frontend/src/components/SensorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ThermometerSun, Droplets } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const SensorDashboard = () => {
  const [sensorData, setSensorData] = useState({
    temperature: null,
    humidity: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching sensor data...');

      // First try to add test data if none exists
      try {
        await axios.post(`${API_BASE_URL}/test-data`);
      } catch (e) {
        console.log('Test data might already exist');
      }

      // Get all readings
      const response = await axios.get(`${API_BASE_URL}/readings`);
      console.log('Received data:', response.data);

      // Organize data by sensor type
      const tempData = response.data.filter(reading => reading.type === 'temperature');
      const humData = response.data.filter(reading => reading.type === 'humidity');

      setSensorData({
        temperature: tempData[0]?.value || null,
        humidity: humData[0]?.value || null,
        readings: response.data
      });

      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch sensor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !sensorData.readings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg animate-pulse">Loading sensor data...</div>
      </div>
    );
  }

  const chartData = sensorData.readings?.map(reading => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    [reading.type]: reading.value
  })) || [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Infrastructure Monitoring Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Real-time sensor monitoring and analysis
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Temperature Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ThermometerSun className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Temperature</h2>
                <p className="text-sm text-gray-500">Current Reading</p>
              </div>
            </div>
            <div className="mt-4 text-4xl font-bold text-gray-800">
              {sensorData.temperature !== null ? `${sensorData.temperature.toFixed(1)}°C` : 'N/A'}
            </div>
          </div>

          {/* Humidity Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Humidity</h2>
                <p className="text-sm text-gray-500">Current Reading</p>
              </div>
            </div>
            <div className="mt-4 text-4xl font-bold text-gray-800">
              {sensorData.humidity !== null ? `${sensorData.humidity.toFixed(1)}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Sensor Readings Over Time</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ef4444" 
                  name="Temperature (°C)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3b82f6" 
                  name="Humidity (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDashboard;