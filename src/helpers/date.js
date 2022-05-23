const monthDifference = (date1, date2, roundUpFractionalMonths = true) => {
  //Months will be calculated between start and end dates.
  //Make sure start date is less than end date.
  //But remember if the difference should be negative.
  var startDate = date1;
  var endDate = date2;
  var inverse = false;
  if (date1 > date2) {
    startDate = date2;
    endDate = date1;
    inverse = true;
  }

  //Calculate the differences between the start and end dates
  var yearsDifference = endDate.getFullYear() - startDate.getFullYear();
  var monthsDifference = endDate.getMonth() - startDate.getMonth();
  var daysDifference = endDate.getDate() - startDate.getDate();

  var monthCorrection = 0;
  //If roundUpFractionalMonths is true, check if an extra month needs to be added from rounding up.
  //The difference is done by ceiling (round up), e.g. 3 months and 1 day will be 4 months.
  if (roundUpFractionalMonths === true && daysDifference > 0) {
    monthCorrection = 1;
  }
  //If the day difference between the 2 months is negative, the last month is not a whole month.
  else if (roundUpFractionalMonths !== true && daysDifference < 0) {
    monthCorrection = -1;
  }

  return (
    (inverse ? -1 : 1) *
    (yearsDifference * 12 + monthsDifference + monthCorrection)
  );
};

const formatDate = (givenDate) => {
  const date = new Date(givenDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

export { monthDifference, formatDate };
