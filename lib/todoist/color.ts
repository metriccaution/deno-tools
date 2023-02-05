// TODO - Complete change

/**
 * Todoist color codes
 *
 * https://developer.todoist.com/guides/#colors
 */
export enum Color {
  BERRY_RED = "berry_red",
  RED = "red",
  ORANGE = "orange",
  YELLOW = "yellow",
  OLIVE_GREEN = "olive_green",
  LIME_GREEN = "lime_green",
  GREEN = "green",
  MINT_GREEN = "mint_green",
  TEAL = "teal",
  SKY_BLUE = "sky_blue",
  LIGHT_BLUE = "light_blue",
  BLUE = "blue",
  GRAPE = "grape",
  VIOLET = "violet",
  LAVENDER = "lavender",
  MAGENTA = "magenta",
  SALMON = "salmon",
  CHARCOAL = "charcoal",
  GREY = "grey",
  TAUPE = "taupe",
}

const metadata: Record<Color, { hexCode: string; name: string }> = {
  [Color.BERRY_RED]: { hexCode: "b8256f", name: "berry_red" },
  [Color.RED]: { hexCode: "db4035", name: "red" },
  [Color.ORANGE]: { hexCode: "ff9933", name: "orange" },
  [Color.YELLOW]: { hexCode: "fad000", name: "yellow" },
  [Color.OLIVE_GREEN]: { hexCode: "afb83b", name: "olive_green" },
  [Color.LIME_GREEN]: { hexCode: "7ecc49", name: "lime_green" },
  [Color.GREEN]: { hexCode: "299438", name: "green" },
  [Color.MINT_GREEN]: { hexCode: "6accbc", name: "mint_green" },
  [Color.TEAL]: { hexCode: "158fad", name: "teal" },
  [Color.SKY_BLUE]: { hexCode: "14aaf5", name: "sky_blue" },
  [Color.LIGHT_BLUE]: { hexCode: "96c3eb", name: "light_blue" },
  [Color.BLUE]: { hexCode: "4073ff", name: "blue" },
  [Color.GRAPE]: { hexCode: "884dff", name: "grape" },
  [Color.VIOLET]: { hexCode: "af38eb", name: "violet" },
  [Color.LAVENDER]: { hexCode: "eb96eb", name: "lavender" },
  [Color.MAGENTA]: { hexCode: "e05194", name: "magenta" },
  [Color.SALMON]: { hexCode: "ff8d85", name: "salmon" },
  [Color.CHARCOAL]: { hexCode: "808080", name: "charcoal" },
  [Color.GREY]: { hexCode: "b8b8b8", name: "grey" },
  [Color.TAUPE]: { hexCode: "ccac93", name: "taupe" },
};

/**
 * Get the human-readable name of a color code
 */
export const name = (colorCode: Color): string => metadata[colorCode].name;

/**
 * Get the hex code associated with a particular color code
 */
export const hexCode = (colorCode: Color): string =>
  metadata[colorCode].hexCode;
