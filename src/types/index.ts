export type Dish = {
  name: string;
  ingredients?: string[];
  steps?: string[];
};

export type Menu = {
  main: Dish;
  side1?: Dish;
  side2?: Dish;
  soup?: Dish;
  point: string;
};

export type ThemeProposal = {
  id: string;
  themeTitle: string;
  themeDescription: string;
  imagePrompt: string;
  imageUrl?: string; // Generated later by /api/image
  menu: Menu;
};
