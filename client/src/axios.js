import axios from 'axios';
const URL =
  process.env.NODE_ENV === 'production'
    ? 'https://word-tune.herokuapp.com/server/'
    : 'http://127.0.0.1:5000/server/';
// const URL = 'https://word-tune.herokuapp.com/server/';

export const getContinent = async (continent, language) => {
  console.log('getContinent!:');
  console.log('Contintnt:', continent);
  console.log('lang:', language);
  try {
    const result = await axios.get(URL + continent + '?lang=' + language);
    console.log(result);
    return result.data;
  } catch (e) {
    console.warn(e);
  }
};

export const getCountry = async (continent, country, language) => {
  console.log('Contintnt:', continent);
  console.log('Contry:', country);
  console.log('lang:', language);
  try {
    const result = await axios.get(
      URL + continent + '/' + country + '?lang=' + language
    );
    return result.data;
  } catch (e) {
    console.warn(e);
  }
};
