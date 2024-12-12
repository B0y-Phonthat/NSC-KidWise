export interface Theme {
  name: string;
  colors: string[];
}

export const themes: Theme[] = [
  { name: 'Blue', colors: ['#3F9FFA', '#96E5FC'] },
  { name: 'Orange', colors: ['#FFB347', '#FFCC67'] },
  { name: 'Purple', colors: ['#A74CF2', '#3963D7'] },
  { name: 'Yellow', colors: ['#FFD700', '#FFA500'] },
  { name: 'Pink', colors: ['#AF7AC5', '#F8BBD0'] },
  { name: 'Black', colors: ['#2C3E50', '#000000'] },
];
