import React, { useState,useEffect } from 'react';
import { Calendar, formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import {createEventId} from './event-utils';
import {useNavigate} from 'react-router-dom';
import suprsend from "@suprsend/web-sdk";

Modal.setAppElement('#root');

export default function Home(props) {
  const host = process.env.REACT_APP_PORT;
  const [INITIAL_EVENTS, setInitial] = useState([]);
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  
  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate("/login");
    }
    const filldata = async () => {
      try {
        const response = await fetch(`${host}/fetchallevents`, {
          method: "GET",
          headers: {
            'Content-Type': "application/json",
            "auth-token": localStorage.getItem('token')
          }
        });
        const json = await response.json();
        setInitial(json);
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); 
      }
    };
  
    filldata();
  }, []);
  

  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible);
  };
  

  const handleDateSelect = async(selectInfo) => {
    let title = prompt('Please enter a new title for your event');
    let calendarApi = selectInfo.view.calendar;
    // console.log(selectInfo);
    calendarApi.unselect();
    if (title) {
      const nid = createEventId();
      calendarApi.addEvent({
        id: nid,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
      const response = await fetch(`${host}/addevent`,{
        method : "POST",
        headers:{
          'Content-Type':"application/json",
          "auth-token" : localStorage.getItem('token')
        },
        body: JSON.stringify({id:nid,title:title,start:selectInfo.startStr,end:selectInfo.endStr,allDay:selectInfo.allDay})
      })
      const json = await response.json();

      const dateString = json.start;
      const dateObject = new Date(dateString);
      const formattedDate = dateObject.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      
      // Format time as 'hh:mm AM/PM'
      const formattedTime = dateObject.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
       
      const property = {
      "title":json.title,
      "date":formattedDate,
      "time":formattedTime
      }
      suprsend.track("EVENTCREATED", property);
    }
  };

  const handleEventClick = (clickInfo) => {
    setIsConfirmationOpen(true);
    setEventToDelete(clickInfo.event);
  };

  const handleConfirmationResponse = async(response) => {
    if (response) {
      const id = eventToDelete._def.extendedProps._id;
      // console.log(id);
      const response = await fetch(`${host}/deleteevent/${id}`,{
        method : "DELETE",
        headers :{
          'Content-Type':"application/json",
          'auth-token':localStorage.getItem('token')
        },
       })
       const json = await response.json();
      //  console.log(json);
       eventToDelete.remove();
    }
    setIsConfirmationOpen(false);
    setEventToDelete(null);
  };

  const handleEvents = (events) => {
    setCurrentEvents(events);
  };

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  };

  const renderSidebarEvent = (event) => {
    return (
      <li style={{ margin: "1.5em 0", padding: "0" }} key={event.id}>
        <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
        <i>{event.title}</i>
      </li>
    );
  };

  const renderSidebar = () => {
    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>
          <div className="container3 my-3">
            <a className="github" href="https://github.com/SuprSend-NotificationAPI/Suprsend-DoodleCalender"  target="_blank"></a>
            <a className="suprsend" href="https://www.suprsend.com"  target="_blank"></a>
          </div>
        </div>
        <div className='demo-app-sidebar-section text-center'>
          <label className='my-4 '>
            <input
              type='checkbox'
              checked={weekendsVisible}
              onChange={handleWeekendsToggle}
              className='mx-2'
            ></input>
           <strong>Toggle Weekends</strong>
          </label>
        </div>
        <div className='demo-app-sidebar-section text-center'>
          <h2>All Events ({currentEvents.length})</h2>
          <ul>
            {currentEvents.map(renderSidebarEvent)}
          </ul>
        </div>
      </div>
    );
  };

  const [email, setEmail] = useState('');
  const [newtitle,setnewtitle] = useState('');

  return (
    <div className='demo-app'>
      {renderSidebar()}
      <div className='demo-app-main'>
        {loading?
         ( <div>Loading...</div>):
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          initialEvents={INITIAL_EVENTS}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
        />
}
      </div>

      <Modal
      isOpen={isConfirmationOpen}
      onRequestClose={() => setIsConfirmationOpen(false)}

      style={{
        overlay: {
          zIndex: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
        content: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '600px',
          minHeight:"600px",
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#fff',
        },
      }}
    >
      
      <div style={{ textAlign: 'center' }}>
        <h1 style={{marginBottom:"40px"}}>{eventToDelete?.title}</h1>
        <h2 style={{marginBottom:"20px"}}>Share the event with your friend :</h2>
        <input
          type="email"
          placeholder="Enter receiver's email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            marginBottom: '20px',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />

        {/* Share Button */}
        <button
          style={{
            marginBottom: '40px',
            padding: '10px 20px',
            backgroundColor: '#4285F4',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '30%',
          }}
          onClick={async() => {
            const response = await fetch(`${host}/shareevent`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
              },
              body: JSON.stringify({ share:email, eventid:eventToDelete._def.extendedProps._id})
            });
            const json = await response.json();
            if(!json.success){
              props.showAlert("No such email exists on the doodle calender","danger");
            }
            else{
              props.showAlert("Event succesfully shared with the user","success");
            }
            setEmail('');
          }}
        >
          Share
        </button>


        <h2 style={{marginBottom:"20px"}}>Edit Title of the Event :</h2>
        <input
          type="text"
          placeholder="Enter New Title"
          value={newtitle}
          onChange={(e) => setnewtitle(e.target.value)}
          style={{
            marginBottom: '20px',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />

        <button
          style={{
            marginBottom: '40px',
            padding: '10px 20px',
            backgroundColor: '#4285F4',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '30%',
          }}
          onClick={async() => {
            const response = await fetch(`${host}/editevent/${eventToDelete._def.extendedProps._id}`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
              },
              body: JSON.stringify({ title : newtitle})
            });
            const json = await response.json();
            setnewtitle('');
            window.location.reload();
          }}
        >
          Edit
        </button>


        {/* Confirmation Message */}
        <h2 style={{ color: '#555', marginBottom: '20px' }}>Delete the event</h2>
        <p style={{ color: '#777', marginBottom: '30px' }}>
          Are you sure you want to delete the event{' '}
          {eventToDelete?.title}?
        </p>

        {/* Delete Confirmation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: '#ff4444',
              color: '#fff',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => handleConfirmationResponse(true)}
          >
            Yes
          </button>
          <button
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: '#999',
              color: '#fff',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => handleConfirmationResponse(false)}
          >
            No
          </button>
        </div>
      </div>
    </Modal>

    </div>
  );
}
