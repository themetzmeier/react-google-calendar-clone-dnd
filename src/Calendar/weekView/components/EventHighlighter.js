import React, { useState, useEffect } from 'react';
import moment from 'moment';
import AddEventModal from './AddEventModal';
import {generateWeekViewCoordinates} from '../../utils';
import {eventHighlighter} from '../styles';

function EventHighlighter({ isDragging, calendarPosition, event, onEventDelete, onEventUpdate, startDate }) {
  const [eventState, setEventState] = useState({
    showEditEventModal: false,
    eventNewStart: null,
    eventNewEnd: null,
  });
  const [dragAndDropDimensions, setDragAndDropDimensions] = useState('');

  const setEventStateFunc = (updateObject) => {
    setEventState((prevEventState) => {
        let returnObject = { ...prevEventState, ...updateObject };
        return returnObject;
    });
};

  /**
   * Deletes the event from the event list
  */
  const deleteEvent = () => {
    onEventDelete(event.id);
    setEventStateFunc({
      showEditEventModal: false,
    });
  };

  /**
   * Updates the event
   * @param {string} title - Updated title of the event
   */
  const updateEvent = (title) => {
    onEventUpdate(event.id, { title, start: eventState.eventNewStart, end: eventState.eventNewEnd });
    setEventStateFunc({
      showEditEventModal: false,
    });
  };

  /**
   * Open the edit event modal and initializes the start and end time
   */
  const openEditEventModal = () => {
    setEventStateFunc({
      showEditEventModal: true,
      eventNewStart: event.start,
      eventNewEnd: event.end,
    });
  };

  /**
   * Set the updated start and end times the state of the event being edited
   * @param {arr: moment, moment} - Array containing start and end date of the event
   */
  const onCurrentEventTimeChange = (dates) => {
    setEventStateFunc({
      eventNewStart: +dates[0],
      eventNewEnd: +dates[1],
    });
  };

  /**
   * Closes modal and does nothing more!
   */
  const closeModal = () => {
    setEventStateFunc({
      showEditEventModal: false,
    });
  };

  useEffect(() => {
    let eventDiv = document.querySelector(`#calendarEvent${event.id}`)
    let eventHeight = eventDiv.offsetHeight;
    let eventWidth =  eventDiv.offsetWidth;
    setDragAndDropDimensions({ "width": `${eventWidth}px`, "height": `${eventHeight}px` });
  }, []);

  useEffect(() => {
        if(isDragging) {
          setDragAndDropDimensions({ ...dragAndDropDimensions });
        }
    }, [isDragging]);

  return (
    <React.Fragment>
      <AddEventModal
        editMode={true}
        eventTitle={event.title}
        visible={eventState.showEditEventModal}
        onCancel={deleteEvent}
        onClose={closeModal}
        onOk={updateEvent}
        eventStart={eventState.eventNewStart}
        eventEnd={eventState.eventNewEnd}
        onTimeChange={onCurrentEventTimeChange}
      />
      <div
        id={`calendarEvent${event.id}`}
        onClick={openEditEventModal}
        style={{ ...generateWeekViewCoordinates(event, startDate), ...eventHighlighter, ...dragAndDropDimensions }}
      >
        {event.title}
        <br />
        <span style={{fontSize: 10}}>
          {moment(event.start).format ('hh:mm a')}
          {' '}
          -
          {' '}
          {moment(event.end).format('hh:mm a')}
        </span>
      </div>
    </React.Fragment>
  );
}

export default EventHighlighter;
