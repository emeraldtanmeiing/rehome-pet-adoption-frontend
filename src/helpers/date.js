import lodash from "lodash";
const { isEmpty } = lodash;

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

const formatDate = (givenDate, showTime = false) => {
  if(isEmpty(givenDate) || givenDate == "-" ){
    return "-"
  }

  const malaysiaDate = new Date(givenDate).toLocaleString("en-US", {
    timeZone: "Asia/Kuala_Lumpur",
  });
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

  const date = malaysiaDate.split(",")[0];
  const time = malaysiaDate.split(",")[1].trim();

  const month = date.split("/")[0] - 1;
  const day = date.split("/")[1];
  const year = date.split("/")[2];

  let formattedDate = `${day} ${monthNames[month]} ${year}`;

  if (showTime) {
    const hour = time.split(":")[0];
    const minute = time.split(":")[1];
    const second = time.split(":")[2];
    const amOrPm = second.split(" ")[1];

    formattedDate = `${formattedDate}, ${hour}:${minute} ${amOrPm}`;
  }

  return formattedDate;
};

const calculateAge = (age, updatedAt) => {
  const diffInMonths = monthDifference(
    new Date(updatedAt),
    new Date(Date.now())
  );
  const ageInMonths = parseInt(age) + diffInMonths;
  
  const year = Math.floor(ageInMonths / 12);
  const month = ageInMonths % 12;

  let ageString = `${month} ${month > 1 ? "months" : "month"}`
  if(year > 0) {
    ageString = `${year} ${year > 1 ? "years" : "year"} ${ageString}`
  }
  return ageString
} 

export { monthDifference, formatDate, calculateAge };
