import axios from "axios";

export const BASE_URL = "https://youtube-v31.p.rapidapi.com";

const options = {
  params: { maxResults: 50 },
  headers: {
    "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
    "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
  },
};

export const fetchFromAPI = async (url) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);

    if (!data.items || data.items.lenght === 0) {
      console.log("No results found for the query.");
    }

    console.log(`Inside fetchFromAPI, complete serach URL : ${BASE_URL}/${url}`);
    console.log("Data fetched from URL :", data);
    return data;
  } catch (error) {
    console.error("Errro fetching data from API: ", error);
    throw error; //rilascia se c'è qualche errore
  }

};
