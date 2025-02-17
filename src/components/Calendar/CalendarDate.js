import React, { useState } from "react";
import PropTypes from "prop-types";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { addDays, subDays, isAfter, isBefore } from "date-fns";
import moment from "moment";

const CalendarDate = ({ onChange }) => {
  let startDate = moment().startOf("month");
  let endDate = moment().endOf("month");
  let currentData = moment(new Date());
  let forStartCount = currentData.diff(startDate, "days");
  let forEndCount = endDate.diff(currentData, "days");
  const [state, setState] = useState([
    {
      startDate: subDays(new Date(), forStartCount),
      endDate: addDays(new Date(), forEndCount),
      key: "selection",
    },
  ]);

  const handleOnChange = (ranges) => {
    const { selection } = ranges;

    // Check if the selected end date is in the future
    if (isAfter(selection.endDate, new Date())) {
      selection.endDate = new Date(); // Set it to the current date
    }

    // Check if the selected start date is in the future
    if (isAfter(selection.startDate, new Date())) {
      selection.startDate = new Date(); // Set it to the current date
    }

    onChange(selection);
    setState([selection]);
  };

  return (
    <DateRangePicker
      onChange={handleOnChange}
      showSelectionPreview={true}
      moveRangeOnFirstSelection={false}
      months={2}
      ranges={state}
      direction="horizontal"
    />
  );
};

CalendarDate.propTypes = {
  onChange: PropTypes.func,
};

export default CalendarDate;
