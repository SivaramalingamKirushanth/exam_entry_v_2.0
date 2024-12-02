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
