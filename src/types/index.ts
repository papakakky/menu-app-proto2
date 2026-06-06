export type Dish = {
  name: string;
  ingredients: string[];
  steps: string[];
};

export type Menu = {
  id: string;
  title: string;
  main: Dish;
  side1?: Dish;
  side2?: Dish;
  soup?: Dish;
  point: string;
};
