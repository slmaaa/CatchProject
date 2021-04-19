import {url} from "../../constants.json"

async function postData(url = '', data = {}) {
    fetch('https://example.com/profile', {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});
}
const postGame = (data) => {
return await postData(url+"/creategame")
}
