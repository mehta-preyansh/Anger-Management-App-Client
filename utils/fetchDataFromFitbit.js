import { API_ENDPOINT } from "@env"
export const fetchDataFromFitbit = async (token, userId, date, startTime, endTime) => {
  let result = []

  const urls = {
    breathinRate_URL: `1/user/${userId}/br/date/${date}/all.json`,
    heartRate_URL: `1/user/${userId}/activities/heart/date/${date}/${date}/1min/time/${startTime}/${endTime}.json`,
    spo2_URL: `1/user/${userId}/spo2/date/${date}/all.json`,
    cardioScore_URL: `1/user/${userId}/cardioscore/date/${date}.json`
  }

  const fetchBreathingRate = async () => {
    fetch(`${API_ENDPOINT}/${urls.breathinRate_URL}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(async response => {
        console.log("Breathing rate response: ", response);
        const breathingRates = [];
        const sleepData = response.br[0].value;
        for (const key in sleepData) {
          if (sleepData[key].breathingRate !== undefined) {
            breathingRates.push(sleepData[key].breathingRate);
          }
        }
        const validBreathingRates = breathingRates.filter(rate => rate > 0);
        const meanBreathingRate = validBreathingRates.reduce((sum, rate) => sum + rate, 0) / validBreathingRates.length;
        result.push(meanBreathingRate)
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }

  const fetchHeartRate = async () => {
    fetch(`${API_ENDPOINT}/${urls.heartRate_URL}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(async response => {
        console.log("Heart rate data: ", response);
        const dataset = data["activities-heart-intraday"].dataset;
        const totalValue = dataset.reduce((sum, entry) => sum + entry.value, 0);
        const meanValue = totalValue / dataset.length;
        result.push(meanValue);
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }

  const fetchSpo2 = async () => {
    fetch(`${API_ENDPOINT}/${urls.spo2_URL}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      return res.json();
    }).then(res => {
      const filteredMinutes = res.minutes.filter(entry => {
        const entryDate = new Date(entry.minute);
        return entryDate >= startTime && entryDate <= endTime;
      });
      const totalValue = filteredMinutes.reduce((sum, entry) => sum + entry.value, 0);
      const meanValue = totalValue / filteredMinutes.length;
      result.push(meanValue);
    }).catch(err => {
      console.log(err);
      throw err;
    })
  }

  const fetchCardioScore = async () => {
    fetch(`${API_ENDPOINT}/${urls.cardioScore_URL}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      return res.json();
    }).then(res => {
      const value = res.cardioScore[0].value.vo2Max
      result.push(value)
    }).catch(err => {
      console.log(err);
      throw err;
    })
  }

  await fetchHeartRate();
  await fetchSpo2();
  await fetchBreathingRate();
  await fetchCardioScore();

  return result;
}