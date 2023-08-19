let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
const host = process.env.REACT_APP_PORT
export let INITIAL_EVENTS = [
 
]

export function createEventId() {
  return String(eventGuid++);
}

export async function fetchAndSetEvents() {
  try {
    const response = await fetch(`${host}/fetchallevents`,{
      method : "GET",
      headers:{
        'Content-Type':"application/json",
        "auth-token" : localStorage.getItem('token')
      }
    })
    const json = await response.json();
    INITIAL_EVENTS = json;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}
