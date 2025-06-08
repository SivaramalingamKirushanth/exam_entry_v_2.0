export function parseString(input) {
  const regex = /^(\d{4})([A-Za-z()]+)(\d)(\d)$/;
  const match = input.match(regex);

  if (match) {
    const academic_year = match[1];
    const degree_name_short = match[2];
    const level = match[3];
    const sem_no = match[4];

    return {
      academic_year,
      degree_name_short,
      level,
      sem_no,
      batch_code: input,
    };
  } else {
    throw new Error("Invalid format");
  }
}

export const numberToOrdinalWord = (numStr) => {
  const ordinalWords = [
    "zeroth",
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "ninth",
    "tenth",
    "eleventh",
    "twelfth",
    "thirteenth",
    "fourteenth",
    "fifteenth",
    "sixteenth",
    "seventeenth",
    "eighteenth",
    "nineteenth",
  ];

  const tensWords = [
    "",
    "",
    "twentieth",
    "thirtieth",
    "fortieth",
    "fiftieth",
    "sixtieth",
    "seventieth",
    "eightieth",
    "ninetieth",
  ];

  const num = parseInt(numStr, 10);

  if (isNaN(num) || num < 0) {
    return "Invalid input"; // Handle non-numeric or negative inputs
  }

  if (num < 20) {
    return ordinalWords[num];
  }

  const tens = Math.floor(num / 10);
  const ones = num % 10;

  if (ones === 0) {
    return tensWords[tens];
  }

  return tensWords[tens].replace("ieth", "y-") + ordinalWords[ones];
};

export function titleCase(str) {
  const excludedWords = [
    "and",
    "or",
    "but",
    "nor",
    "the",
    "a",
    "an",
    "in",
    "on",
    "at",
    "to",
    "by",
    "for",
    "with",
    "of",
    "from",
  ];

  return str
    ?.toLowerCase()
    .split(" ")
    .map((word, index) => {
      // Find the first alphabetical character in the word
      const firstAlphaIndex = word.search(/[a-z]/i);

      if (firstAlphaIndex !== -1) {
        const firstAlpha = word[firstAlphaIndex].toUpperCase();
        word =
          word.substring(0, firstAlphaIndex) +
          firstAlpha +
          word.substring(firstAlphaIndex + 1);
      }

      // Capitalize if it's the first word or not in the excluded list
      if (index === 0 || !excludedWords.includes(word)) {
        return word;
      }

      return word;
    })
    .join(" ");
}

export const convertUTCToLocal = (utcDateStr) => {
  // Step 1: Parse the UTC date
  const date = new Date(utcDateStr);

  // Step 2: Convert to the desired time zone and format
  const options = {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23", // Use 24-hour format
  };

  // Adjust time and format to local string
  const localDateStr = date.toLocaleString("en-GB", options); // e.g., "09/12/2024, 06:50"

  // Step 3: Reformat the string to "yyyy-MM-ddThh:mm"
  const [datePart, timePart] = localDateStr.split(", ");
  return datePart.split("/").reverse().join("-") + "T" + timePart;
};

export function getModifiedDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function getUnmodifiedDate(modifiedDateStr) {
  const [day, month, year] = modifiedDateStr.split(".");
  return new Date(`${year}-${month}-${day}`);
}

export function getDayName(date) {
  let day;
  switch (date.getDay()) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
  }
  return day;
}

export const createSubjectObject = (subjects) => {
  const subjectMap = {};

  subjects?.forEach((subject) => {
    subjectMap[subject.sub_id] = subject;
  });

  return subjectMap;
};

export function sortByExamType(array) {
  const examOrder = { P: 1, M: 2, R: 3 };

  // Separate strings and objects
  const objects = array.filter((item) => typeof item === "object");
  const others = array.filter((item) => typeof item !== "object");

  // Sort only the objects
  const sortedObjects = objects.sort((a, b) => {
    const examComparison = examOrder[a.exam_type] - examOrder[b.exam_type];
    if (examComparison !== 0) return examComparison;
    return a.index_num.localeCompare(b.index_num);
  });

  // Return the sorted array (optional: re-insert strings if needed)
  return [...sortedObjects, ...others];
}

export function formatResitData(input) {
  return Object.entries(input)
    .map(([subId, attempts]) => {
      const attemptStr = [1, 2, 3]
        .map((i) =>
          attempts[i] && attempts[i].trim() !== "" ? attempts[i] : "#"
        )
        .join(",");
      return `${subId}|${attemptStr}`;
    })
    .join(";");
}

function parseObjectData(itemStr) {
  // Split by semicolon to get individual properties
  const properties = itemStr.split(";");

  // If the string has multiple semicolons, it's an object with properties
  if (properties.length >= 3) {
    return {
      s_id: parseInt(properties[0]) || properties[0],
      exam_type: properties[1],
      index_num: properties[2],
    };
  }

  // Otherwise, it might be a simple string
  return itemStr;
}

export const makePagination = (sortedArray) => {
  let examTypesRemoved = sortedArray.slice();

  let examTypeMExist = examTypesRemoved.findIndex((obj) => obj == "M");
  if (examTypeMExist >= 0) examTypesRemoved.splice(examTypeMExist, 1);

  let examTypeRExist = examTypesRemoved.findIndex((obj) => obj == "R");
  if (examTypeRExist >= 0) examTypesRemoved.splice(examTypeRExist, 1);

  let empty1Exist = examTypesRemoved.findIndex((obj) => obj == "");
  if (empty1Exist >= 0) examTypesRemoved.splice(empty1Exist, 1);

  let empty2Exist = examTypesRemoved.findIndex((obj) => obj == "");
  if (empty2Exist >= 0) examTypesRemoved.splice(empty2Exist, 1);

  let exam_type = "P";
  let grpArr = [];
  let pageArr = [];
  let pageArrInd = 0;

  for (let j = 0; j < examTypesRemoved.length; j++) {
    if (examTypesRemoved[j]?.exam_type != exam_type) {
      if (pageArrInd !== 0) {
        pageArr.push("");
        //checking availability after pushing the empty
        if (pageArrInd == 79) {
          if (pageArr.filter((item) => item).length) {
            grpArr.push(pageArr.filter((obj) => obj != undefined));
          }
          pageArr = [];
          pageArrInd = 0;
        } else {
          pageArrInd++;
        }

        pageArr.push("");
        //checking availability after pushing the empty
        if (pageArrInd == 79) {
          if (pageArr.filter((item) => item).length) {
            grpArr.push(pageArr.filter((obj) => obj != undefined));
          }
          pageArr = [];
          pageArrInd = 0;
        } else {
          pageArrInd++;
        }
      }

      pageArr.push(sortedArray[j].exam_type);
      exam_type = sortedArray[j].exam_type;
      //checking availability after pushing the exam_type
      if (pageArrInd == 79) {
        if (pageArr.filter((item) => item).length) {
          grpArr.push(pageArr.filter((obj) => obj != undefined));
        }
        pageArr = [];
        pageArrInd = 0;
      } else {
        pageArrInd++;
      }
    }

    pageArr.push(examTypesRemoved[j]);

    //checking availability after pushing a student
    if (pageArrInd == 79 || j == examTypesRemoved.length - 1) {
      if (pageArr.filter((item) => item).length) {
        grpArr.push(pageArr.filter((obj) => obj != undefined));
      }
      pageArr = [];
      pageArrInd = 0;
    } else {
      pageArrInd++;
    }

    if (j == examTypesRemoved.length - 1) {
      break;
    }
  }

  return grpArr;
};

export function deserializeString(str) {
  // Split the string by + to get each top-level key group
  if (!str) return {};

  const groups = str.split("+");
  const result = {};

  groups.forEach((group) => {
    // First split by comma to separate the key from the array contents
    const [key, restOfData] = group.split(",", 2);

    // The rest of the data contains all array elements
    const arrayDataStr = group.substring(key.length + 1);

    // Split by comma to get individual array items with their indices
    const arrayItems = arrayDataStr.split(",");

    // Initialize the top-level array for this key
    result[key] = [];

    let currentArrayIndex = -1;

    arrayItems.forEach((item) => {
      // Check if this item starts with an index (n:)
      if (item.includes(":")) {
        // This is a new sub-array
        const [indexStr, firstItem] = item.split(":", 2);
        const index = parseInt(indexStr);
        currentArrayIndex = index;

        // // Make sure the array at this index exists
        // if (!result[key][currentArrayIndex]) {
        //   result[key][currentArrayIndex] = [];
        // }

        // Process the first item
        if (firstItem) {
          // Parse the object data
          result[key].push(parseObjectData(firstItem));
        }
      } else {
        // This is an additional item in the current sub-array
        if (currentArrayIndex !== -1) {
          result[key].push(parseObjectData(item));
        }
      }
    });

    result[key] = makePagination(result[key]);
  });

  return result;
}

export function reconstructGroupsObject(venues, dates, times) {
  const venueArr = venues?.split(",") || "";
  const dateArr = dates?.split(",") || "";
  const timeArr = times?.split(",") || "";

  const result = {};

  for (let i = 0; i < venueArr.length; i++) {
    // Extract hallNo and center from the venue string
    const venue = venueArr[i];
    const hallMatch = venue?.split("@");
    let hallNo = "";
    let center = "";
    if (hallMatch?.length == 2) {
      hallNo = hallMatch[0]?.split("-")[1];
      center = hallMatch[1];
    } else {
      center = hallMatch[0];
    }

    result[i + 1] = {
      hallNo,
      center,
      actual_date: dateArr[i],
      fromTime: timeArr[i].split(" - ")[0] || "",
      toTime: timeArr[i].split(" - ")[1] || "",
    };
  }

  return result;
}
export function hasNumber(str) {
  return /\d/.test(str);
}
