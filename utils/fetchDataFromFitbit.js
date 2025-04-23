import { API_ENDPOINT } from "@env";

// Fetch health metrics from Fitbit API in parallel
export const fetchDataFromFitbit = async (token, userId, date, startTime, endTime) => {
  const urls = {
    breathinRate_URL: `1/user/${userId}/br/date/${date}/all.json`,
    heartRate_URL: `1/user/${userId}/activities/heart/date/${date}/${date}/1min/time/${startTime}/${endTime}.json`,
    spo2_URL: `1/user/${userId}/spo2/date/${date}/all.json`,
    cardioScore_URL: `1/user/${userId}/cardioscore/date/${date}.json`
  };

  // Parallel fetch functions
  const fetchBreathingRate = async () => {
    const res = await fetch(`${API_ENDPOINT}/${urls.breathinRate_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("Breathing rate response:", data);
    const breathingRates = [];
    const sleepData = data.br[0]?.value || {};
    for (const key in sleepData) {
      if (sleepData[key]?.breathingRate !== undefined) {
        breathingRates.push(sleepData[key].breathingRate);
      }
    }
    const validRates = breathingRates.filter(rate => rate > 0);
    return validRates.reduce((sum, rate) => sum + rate, 0) / validRates.length;
  };

  const fetchHeartRate = async () => {
    const res = await fetch(`${API_ENDPOINT}/${urls.heartRate_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("Heart rate data:", data);
    const dataset = data["activities-heart-intraday"]?.dataset || [];
    const total = dataset.reduce((sum, d) => sum + d.value, 0);
    return total / dataset.length;
  };

  const fetchSpo2 = async () => {
    const res = await fetch(`${API_ENDPOINT}/${urls.spo2_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const filtered = (data.minutes || []).filter(entry => {
      const entryDate = new Date(entry.minute);
      return entryDate >= startTime && entryDate <= endTime;
    });
    const total = filtered.reduce((sum, e) => sum + e.value, 0);
    return total / filtered.length;
  };

  const fetchCardioScore = async () => {
    const res = await fetch(`${API_ENDPOINT}/${urls.cardioScore_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.cardioScore[0]?.value?.vo2Max || 0;
  };

  // Fetch all metrics in parallel
  const results = await Promise.all([
    fetchHeartRate(),
    fetchSpo2(),
    fetchBreathingRate(),
    fetchCardioScore()
  ]);

  return results;
};
