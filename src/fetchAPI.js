import axios from 'axios';

// var API_KEY = '32240565-65f34599f56fadf318e8995ed';
// var URL =
//   'https://pixabay.com/api/?key=' +
//   API_KEY +
//   '&q=' +
//   encodeURIComponent('red roses');
// $.getJSON(URL, function (data) {
//   if (parseInt(data.totalHits) > 0)
//     $.each(data.hits, function (i, hit) {
//       console.log(hit.pageURL);
//     });
//   else console.log('No hits');
// });
export default async function axiosGet(question, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '32158519-15576ba172a71d2bf58c30f9b';
  const image_type = 'photo';
  const orientation = 'horizontal';
  const safesearch = 'true';
  const per_page = 40;
  const url = `${BASE_URL}?key=${KEY}&image_type=${image_type}&safesearch=${safesearch}&orientation=${orientation}&per_page=${per_page}`;

  return await axios.get(`${url}&q=${question}&page=${page}`).then(r => {
    return r.data;
  });
}
