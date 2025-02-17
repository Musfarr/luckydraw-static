export const timestampToFormattedTimestamp = (timeStamp) => {
  const date = new Date(timeStamp * 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const formatted = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formatted;
};

const convertISOToFormattedDateTime = (isoDateTime) => {
  const [datePart, timePart] = isoDateTime.split("T");
  const timeWithoutMilliseconds = timePart.split(".")[0];

  return `${datePart} ${timeWithoutMilliseconds}`;
};
export const dataTime = (isoDateTime) => {
  // const parsedDateTime = new Date(isoDateTime);
  // const formattedDate = parsedDateTime.toISOString().split("T")[0];
  // const formattedTime = parsedDateTime.toTimeString().split(" ")[0];
  // return formattedDate + " " + formattedTime;

  return convertISOToFormattedDateTime(isoDateTime);
};

export const calculateDaysDifference = (targetDate) => {
  let data = timestampToFormattedTimestamp(targetDate);
  const today = new Date();
  const target = new Date(data.slice(0, 11));
  const timeDifference = target - today;
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

export const convertTimestamp = (timestamp) => {
  // we are providing this format 1694009140
  const dt = new Date(timestamp * 1000); // Convert to milliseconds

  const currentDateTime = new Date();
  const timeDifference = currentDateTime - dt;

  const minutes = timeDifference / 60000; // 1 minute = 60,000 milliseconds
  const hours = minutes / 60;
  const days = hours / 24;

  if (minutes < 60) {
    if (Math.floor(minutes) < 0) {
      return `0m ago`;
    } else {
      return `${Math.floor(minutes)}m ago`;
    }
  } else if (hours < 24) {
    return `${Math.floor(hours)}h ago`;
  } else {
    const formattedDate = `${dt.getDate()} ${dt.toLocaleString("default", {
      month: "short",
    })}`;
    return formattedDate;
  }
};
export const convertTimestampLongFormat = (timestamp) => {
  // Parse the date string to create a Date object
  const dt = new Date(timestamp);

  const currentDateTime = new Date();
  const timeDifference = currentDateTime - dt;

  const minutes = timeDifference / 60000; // 1 minute = 60,000 milliseconds
  const hours = minutes / 60;
  const days = hours / 24;

  if (minutes < 60) {
    if (Math.floor(minutes) < 0) {
      return `0m ago`;
    } else {
      return `${Math.floor(minutes)}m ago`;
    }
  } else if (hours < 24) {
    return `${Math.floor(hours)}h ago`;
  } else {
    const formattedDate = `${dt.getDate()} ${dt.toLocaleString("default", {
      month: "short",
    })}`;
    return formattedDate;
  }
};

export const convertTimeWithDateIntoMinHourDate = (time) => {
  // we are providing this time format 2023-09-07T12:57:22.42813
  var timestamp = dataTime(time);
  // after after coming data it will return 2023-09-07 12:57:22.
  const dt = new Date(timestamp);

  const currentDateTime = new Date();
  const timeDifference = currentDateTime - dt;

  const minutes = timeDifference / 60000; // 1 minute = 60,000 milliseconds
  const hours = minutes / 60;
  const days = hours / 24;

  if (minutes < 60) {
    if (Math.floor(minutes) < 0) {
      return `0m ago`;
    } else {
      return `${Math.floor(minutes)}m ago`;
    }
  } else if (hours < 24) {
    return `${Math.floor(hours)}h ago`;
  } else {
    const formattedDate = `${dt.getDate()} ${dt.toLocaleString("default", {
      month: "short",
    })}`;
    return formattedDate;
  }
};

export const chatMessageDayandDateConvert = (timestamp) => {
  const currentDateTime = new Date();
  const timestampDate = new Date(timestamp * 1000); // Convert to milliseconds

  const oneDayMilliseconds = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  const twoDaysMilliseconds = 2 * oneDayMilliseconds;

  const timeDifference = currentDateTime - timestampDate;

  if (
    timeDifference < oneDayMilliseconds &&
    timestampDate.getDate() === currentDateTime.getDate()
  ) {
    return "Today";
  } else if (
    timeDifference < twoDaysMilliseconds &&
    timestampDate.getDate() === currentDateTime.getDate() - 1
  ) {
    return "Yesterday";
  } else {
    const formattedDate = `${timestampDate.getDate()} ${timestampDate.toLocaleString(
      "default",
      { month: "short" }
    )}`;
    return formattedDate;
  }
};

// // message hover function
// export const formatChatHoverDateTime = (timestamp) => {
//   const date = new Date(timestamp * 1000); // Convert to milliseconds
//   // Subtract the specified minutes
//   date.setMinutes(date.getMinutes());

//   const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
//     month: "short",
//   })} ${date.getFullYear()}`;
//   const formattedTime = date.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   return `${formattedDate}, ${formattedTime}`;
// };

// message hover function
export const formatChatHoverDateTime = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds

  const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
    month: "short",
  })} ${date.getFullYear()}`;

  // Format time in 12-hour format
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate}, ${formattedTime}`;
};

// for chat profile contact time
export const contactCreated = (originalDate) => {
  const inputDate = new Date(originalDate);

  // Format the Date object to display only the date as "12 Jun"
  const options = { day: "2-digit", month: "short" };
  return inputDate.toLocaleDateString("en-US", options);
};

export const contactTime = (dateTimeString) => {
  const inputDate = new Date(dateTimeString);
  const now = new Date();

  const timeDifference = now - inputDate;

  if (timeDifference < 60000) {
    // If less than a minute, display in seconds
    const seconds = Math.floor(timeDifference / 1000);
    // return `${seconds} seconds ago`;
    return `0 minutes ago`;
  } else if (timeDifference < 3600000) {
    // If less than an hour, display in minutes
    const minutes = Math.floor(timeDifference / 60000);
    return `${minutes} minutes ago`;
  } else if (timeDifference < 86400000) {
    // If less than a day, display in hours
    const hours = Math.floor(timeDifference / 3600000);
    return `${hours} hours ago`;
  } else {
    // If more than a day, display the date
    const options = { year: "numeric", month: "short", day: "numeric" };
    return inputDate.toLocaleDateString("en-US", options);
  }
};

export const contactTimeInternal = (timestampString) => {
  // Convert the timestamp string to an integer
  const timestamp = parseInt(timestampString, 10) * 1000;
  const inputDate = new Date(timestamp);
  const now = new Date();

  const timeDifference = now - inputDate;

  if (timeDifference < 60000) {
    // If less than a minute, display in seconds
    const seconds = Math.floor(timeDifference / 1000);
    // return `${seconds} seconds ago`;
    return `0 minutes ago`;
  } else if (timeDifference < 3600000) {
    // If less than an hour, display in minutes
    const minutes = Math.floor(timeDifference / 60000);
    return `${minutes} minutes ago`;
  } else if (timeDifference < 86400000) {
    // If less than a day, display in hours
    const hours = Math.floor(timeDifference / 3600000);
    return `${hours} hours ago`;
  } else {
    // If more than a day, display the date
    const options = { year: "numeric", month: "short", day: "numeric" };
    return inputDate.toLocaleDateString("en-US", options);
  }
};


// for chat profile
export const profileDateTime = (inputDateTime) => {
  // const inputDateTime = "2023-09-08T19:03:12.487337";

  // Parse the input date string into a JavaScript Date object
  const dateObject = new Date(inputDateTime);

  // Format the date and time
  const formattedDate = dateObject.toLocaleDateString("en-US", {
    // weekday: 'short', // Short day name (e.g., "Thu")
    year: "numeric", // Numeric year (e.g., "2023")
    month: "short", // Short month name (e.g., "Sep")
    day: "numeric", // Numeric day of the month (e.g., "08")
  });

  const formattedTime = dateObject.toLocaleTimeString("en-US", {
    hour: "numeric", // Numeric hour (e.g., "19")
    minute: "numeric", // Numeric minute (e.g., "22")
  });

  // Combine the formatted date and time
  return `${formattedDate}, ${formattedTime}`;
};

// for events
export const eventDateTime = (inputDateTime) => {
  const dateObject = new Date(inputDateTime);
  const now = new Date();

  // Check if the date is today
  if (
    dateObject.getDate() === now.getDate() &&
    dateObject.getMonth() === now.getMonth() &&
    dateObject.getFullYear() === now.getFullYear()
  ) {
    return `Today, ${dateObject.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Check if the date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    dateObject.getDate() === yesterday.getDate() &&
    dateObject.getMonth() === yesterday.getMonth() &&
    dateObject.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday, ${dateObject.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Otherwise, format as "d MMM yyyy, HH:mm"
  return (
    dateObject.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    dateObject.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

export const dateWithAtTime = (inputDate) => {
  // e.g provided input 2023-09-04T09:12:40.665890
  // return data 14/07/2022 at 07:55 PM
  const date = new Date(inputDate);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Month is zero-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours %= 12;
  hours = hours || 12; // Convert 0 to 12

  return `${day}/${month}/${year} at ${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${ampm}`;
};

export function formatDate(inputDateTime) {
  // provided inputs 2023-09-21 17:59:13, 2023-09-15T16:14:38.622971
  // converted time Sep 21, 2023, 05:59 PM
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const date = new Date(inputDateTime);
  return date.toLocaleDateString("en-US", options);
}

export const convertDateAndTimeIndividually = (inputDate, dateOrTime) => {
  //  input e.g. 2023-09-28T15:35:07.426053200
  const dateTime = new Date(inputDate);

  // if (!isNaN(dateTime.getTime())) {
  const shortDate = dateTime.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
  });
  const time = dateTime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  if (dateOrTime === "date") {
    return shortDate;
  }

  if (dateOrTime === "time") {
    return time;
  }
  // }
};

// for chat expiration timer
export const timeStampConvertIntoExpiration = (timestamp) => {
  const unixTimestamp = parseInt(timestamp); // Convert the input string to a Unix timestamp

  if (!isNaN(unixTimestamp)) {
    const date = new Date(unixTimestamp * 1000); // Convert the Unix timestamp to milliseconds and create a Date object

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    const isoString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;
    return isoString;
  } else {
    return "Invalid input string";
  }
};

// export const isChatExpired = (timestamp) => {
//   const timestampDate = new Date(timestamp);

//   // Add 24 hours (86400000 milliseconds) to the timestamp
//   const adjustedTime = new Date(timestampDate.getTime() + 86400000);
//   // Get the current time
//   const currentTime = new Date();

//   if (currentTime > adjustedTime) {
//     return true;
//   } else {
//     return false;
//   }
// };

export const currentYear = () => {
  let currentDate = new Date();
  return currentDate.getFullYear();
};


export const convertTimestampToDate = (timestamp) => {
  // Create a Date object from the timestamp (Unix timestamp is in seconds)
  const date = new Date(timestamp * 1000);

  // Array of month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get day and month from the Date object
  const day = date.getDate();
  const month = monthNames[date.getMonth()];

  // Return the formatted date
  return `${day} ${month}`;
};


export const convertTimestampToProfileDateTime = (timestamp) => {
  // input: "2323232323"
  // output: "15/08/2024 11:58:20"
  const date = new Date(parseInt(timestamp) * 1000);

  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  const year = date.getFullYear();

  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const filterDropdown = [
  "Last 30 days",
  "This week",
  "Last week",
  "This month",
  "Custom range",
];