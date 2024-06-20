export function analyzeQuery(query: string) {
  const productKeywords = ["shoes"];
  const minPriceKeywords = [
    "under",
    "less than",
    "within",
    "below",
    "lower than",
    "not more than",
    "cheaper than",
    "not over",
    "maximum",
    "at most",
    "at a maximum of",
  ];
  const maxPriceKeywords = [
    "over",
    "more than",
    "above",
    "exceeding",
    "higher than",
    "not under",
    "not less than",
    "more expensive than",
    "over",
    "minimum",
    "at least",
    "at a minimum of",
  ];
  const genderMaleKeywords = [
    "boy",
    "man",
    "gentleman",
    "dude",
    "guy",
    "brother",
    "son",
    "father",
    "uncle",
    "nephew",
    "masculine",
    "he",
    "him",
    "his",
    "Mr.",
    "men",
  ];
  const genderFemaleKeywords = [
    "girl",
    "woman",
    "women",
    "lady",
    "gal",
    "sister",
    "daughter",
    "mother",
    "aunt",
    "niece",
    "feminine",
    "she",
    "her",
    "hers",
    "Ms.",
    "Mrs.",
  ];
  const colorKeywords = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
    "white",
    "gray",
    "silver",
    "gold",
    "beige",
    "teal",
    "navy",
    "maroon",
    "olive",
    "turquoise",
    "violet",
    "indigo",
    "cyan",
    "magenta",
    "lavender",
    "ruby",
    "sapphire",
    "emerald",
    "topaz",
    "onyx",
    "pearl",
  ];

  // Initialize default values
  let product = "all";
  let minPrice = "all";
  let maxPrice = "all";
  let gender = "all";
  let color = "all";

  // Analyze query for product
  for (const keyword of productKeywords) {
    if (query.includes(keyword)) {
      product = keyword;
      break;
    }
  }

  // Analyze query for min price
  for (const keyword of minPriceKeywords) {
    if (query.includes(keyword)) {
      const match = query.match(new RegExp(`${keyword}\\s*(\\d+(\\.\\d+)?)`));
      if (match) {
        minPrice = match[1];
      }
      break;
    }
  }

  // Analyze query for max price
  for (const keyword of maxPriceKeywords) {
    if (query.includes(keyword)) {
      const match = query.match(new RegExp(`${keyword}\\s*(\\d+(\\.\\d+)?)`));
      if (match) {
        maxPrice = match[1];
      }
      break;
    }
  }

  // Analyze query for gender (male)
  for (const keyword of genderMaleKeywords) {
    if (query.includes(keyword)) {
      gender = "male+disabled";
      break;
    }
  }

  // Analyze query for gender (female)
  for (const keyword of genderFemaleKeywords) {
    if (query.includes(keyword)) {
      gender = "female+disabled";
      break;
    }
  }

  // Analyze query for color
  for (const keyword of colorKeywords) {
    if (query.includes(keyword)) {
      color = keyword;
      break;
    }
  }

  return { query, product, minPrice, maxPrice, gender, color };
}

// Function to build the final search query
export function buildSearchQuery({
  product,
  minPrice,
  maxPrice,
  gender,
  color,
  query,
}: any) {
  const queryParts = [];
  if (product) {
    if (product != "all") {
      queryParts.push(`search=${product}`);
    } else {
      queryParts.push(`search=${query}`);
    }
    if (gender && gender !== "all") {
      queryParts.push(`gender=${gender}`);
    }

    if (minPrice && minPrice !== "all") {
      queryParts.push(`max_price=${minPrice}`);
    }
    if (maxPrice && maxPrice !== "all") {
      queryParts.push(`min_price=${maxPrice}`);
    }
    if (color && color !== "all") {
      queryParts.push(`color=${color}`);
    }
  } else {
    if (gender && gender !== "all") {
      queryParts.push(`search=${gender}`);
    }

    if (minPrice && minPrice !== "all") {
      queryParts.push(`search=${minPrice}`);
    }
    if (maxPrice && maxPrice !== "all") {
      queryParts.push(`search=${maxPrice}`);
    }
    if (color && color !== "all") {
      queryParts.push(`search=${color}`);
    }
  }
  return queryParts.join("&");
}
