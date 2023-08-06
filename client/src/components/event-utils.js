let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
const host = process.env.REACT_APP_PORT
export let INITIAL_EVENTS = [
  {
      "_id": "64ce1cee52b5dd13a1e226d9",
      "author": "64cd3818d3d6f8e37a85f478",
      "id": "1",
      "title": "new event but i don't know",
      "start": "2023-08-17T00:00:00.000Z",
      "end": "2023-08-17T18:30:00.000Z",
      "allDay": "true",
      "collaborators": [
          {
              "user": "64cd3818d3d6f8e37a85f478",
              "_id": "64ce1cee52b5dd13a1e226da"
          }
      ],
      "__v": 0
  },
  {
      "_id": "64ce1f3252b5dd13a1e226ee",
      "author": "64cd3818d3d6f8e37a85f478",
      "id": "2",
      "title": "new event",
      "start": "2023-08-10T00:00:00.000Z",
      "end": "2023-08-10T18:30:00.000Z",
      "allDay": "true",
      "collaborators": [
          {
              "user": "64cd3818d3d6f8e37a85f478",
              "_id": "64ce1f3252b5dd13a1e226ef"
          }
      ],
      "__v": 0
  },
  {
      "_id": "64ce284952b5dd13a1e2286b",
      "author": "64cd3818d3d6f8e37a85f478",
      "id": "0",
      "title": "latest event",
      "start": "2023-08-25T00:00:00.000Z",
      "end": "2023-08-25T18:30:00.000Z",
      "allDay": "true",
      "collaborators": [
          {
              "user": "64cd3818d3d6f8e37a85f478",
              "_id": "64ce284952b5dd13a1e2286c"
          }
      ],
      "__v": 0
  }
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
