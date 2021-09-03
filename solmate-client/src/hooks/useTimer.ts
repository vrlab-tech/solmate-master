import moment, { Moment } from "moment";
import React, { useState } from "react";

export const useTimer = (datetime) => {
    const locale = 'en';
    const [today, setDate] = React.useState(new Date()); // Save the current date to be able to trigger an update
    React.useEffect(() => {
        const timer = setInterval(() => {
            // Creates an interval which will update the current data every second
        // This will trigger a rerender every component that uses the useDate hook.
        setDate(new Date());
      }, 1000);
      return () => {
        clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
      }
    }, []);
    let firstArg:string | Moment= "";
    let secondArg : string | Moment = "";
    const isFuture = moment(datetime).isAfter(today);

    if (isFuture) {
        firstArg = moment(datetime);
        secondArg = moment(today)
    } else {
        firstArg = moment(today);
        secondArg = moment(datetime);
    }
    const years = moment(firstArg).diff(secondArg, 'years');
    const months = moment(firstArg).diff(secondArg, 'months');
    const days = moment(firstArg).diff(secondArg, 'days');
    const hours = moment(firstArg).diff(secondArg, 'hours');
    const minutes = moment(firstArg).diff(secondArg, 'minutes');
    const seconds = moment(firstArg).diff(secondArg, 'second');
    return {
        isFuture,
        years,
        months,
        days:days - (months*30),
        hours:hours - (days*24),
        minutes: minutes - (hours*60),
        seconds: seconds - (minutes*60),
    };
  };