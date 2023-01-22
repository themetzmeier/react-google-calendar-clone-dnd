import React, { useEffect, useState } from 'react';
import moment from 'moment';
import AddEventModal from './AddEventModal';
import WeekToolbar from './WeekToolbar';
import WeekHeader from './WeekHeader';
import TimeSlotGroup from './TimeSlotGroup';
import CalendarEvent from './CalendarEvent';
import { times, getAllDaysInTheWeek } from '../../utils';
import { DragDropContext } from "react-beautiful-dnd";

function WeekView({ date, events, onNewEvent, onEventUpdate, onEventDelete }) {

  const [weekViewState, setWeekViewState] = useState('');


  useEffect(() => {
    let startDate = moment();
    if (date) {
      startDate = moment(date);
    }
    setWeekViewState({
      startDate: +moment(+startDate),
      weekDays: getAllDaysInTheWeek(startDate),
      showAddEventModal: false,
      start: null,
      end: null,
    });
  }, [date]);

  const setWeekViewStateFunc = (updateObject) => {
    setWeekViewState((prevWeekViewState) => {
      let returnObject = { ...prevWeekViewState, ...updateObject };
      // console.log(returnObject);
      return returnObject;
    });
  };

  /**
   * Sets next week days in the state
  */
  const goToNextWeek = () => {
    const dateAfter7Days = moment(weekViewState.startDate).add(7, 'days');
    setWeekViewState({
      startDate: +dateAfter7Days,
      weekDays: getAllDaysInTheWeek(dateAfter7Days),
    });
  };

  /**
   * Sets previous week days in the state
  */
  const goToPreviousWeek = () => {
    const dateBefore7Days = moment(weekViewState.startDate).subtract(7, 'days');
    setWeekViewState({
      startDate: +dateBefore7Days,
      weekDays: getAllDaysInTheWeek(dateBefore7Days),
    });
  };

  /**
   * Brings today's date in the view
   */
  const goToToday = () => {
    setWeekViewState({
      startDate: +moment(),
      weekDays: getAllDaysInTheWeek(),
    });
  };

  /**
   * Opens the add event modal and initialize the date from the cell
   * @param {timeStamp} dateStamp - DateStamp of the cell the user clicked
   * @param {number} time - Time of the cell the user clicked
  */
  const openAddEventModal = (dateStamp, time) => {
    const start = moment(dateStamp).set('hour', time);
    const end = start.clone().add(1, 'hour');

    setWeekViewStateFunc({
      showAddEventModal: true,
      eventStart: +start,
      eventEnd: +end,
    });
  };

  /**
   * Closes the add event modal
  */
  const onCloseAddEventModal = () => {
    setWeekViewStateFunc({
      showAddEventModal: false,
    });
  };

  /**
   * Adds the new event and closes the add event modal
   * @param {string} title - Title of the new event
  */
  const onOkAddEventModal = (title) => {
    onNewEvent({
      title,
      start: weekViewState.eventStart,
      end: weekViewState.eventEnd,
    });
    setWeekViewStateFunc({
      showAddEventModal: false,
    });
  };

  /**
   * Saves the timeStamps of the new event in the state
   * @param {arr: moment, moment} - Array containing start and end date of the new event
  */
  const onCurrentEventTimeChange = (dates) => {
    setWeekViewStateFunc({
      eventStart: +dates[0],
      eventEnd: +dates[1],
    });
  };

  if (weekViewState) {
    return (
      <div>
        <AddEventModal
          visible={weekViewState.showAddEventModal}
          onCancel={onCloseAddEventModal}
          onClose={onCloseAddEventModal}
          onOk={onOkAddEventModal}
          eventStart={weekViewState.eventStart}
          eventEnd={weekViewState.eventEnd}
          onTimeChange={onCurrentEventTimeChange}
        />
        <WeekToolbar
          goToPreviousWeek={goToPreviousWeek}
          goToNextWeek={goToNextWeek}
          startDate={weekViewState.startDate}
          goToToday={goToToday}
        />
        <WeekHeader headerArray={weekViewState.weekDays} />
        <DragDropContext onDragEnd={onEventUpdate}>
          {times.map((time) => {
            return (
              <TimeSlotGroup
                key={time}
                time={time}
                resources={weekViewState.weekDays}
                openAddEventModal={openAddEventModal}
              >
                {
                  (date) => {
                    return (
                      <React.Fragment>
                        {events[time] && events[time].map((event, index) => {
                          if (event.startWeek <= moment(weekViewState.startDate).week() && event.endWeek >= moment(weekViewState.startDate).week() && moment(event.start).date() === date) {
                            return (
                              <CalendarEvent
                                key={event.id}
                                id={event.id}
                                index={index}
                                event={{ ...event }}
                                onEventDelete={onEventDelete}
                                onEventUpdate={onEventUpdate}
                                startDate={weekViewState.startDate}
                              />
                            );
                          }
                        })}
                      </React.Fragment>
                    )
                  }
                }
              </TimeSlotGroup>
            );
          })}
        </DragDropContext>
      </div>
    );
  } else {
    return null;
  }
}

export default WeekView;
