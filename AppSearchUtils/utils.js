import { useRef, useEffect } from 'react';

export const SECTION_LIST_MOCK_DATA = [
  {
    title: 'starters',
    data: [
      {
        id: '1',
        title: 'Greek Salad',
        price: 12.99,
        description: 'Our delicious salad is served with Feta cheese and peeled cucumber. Includes tomatoes, onions, olives, salt and oregano in the ingredients.',
        image: 'greekSalad.jpg',
      },
      {
        id: '2',
        title: 'Bruschetta',
        price: 7.99,
        description: 'Delicious grilled bread rubbed with garlic and topped with olive oil and salt. Our Bruschetta includes tomato and cheese.',
        image: 'bruschetta.jpg',
      },
    ],
  },
  {
    title: 'mains',
    data: [
      {
        id: '3',
        title: 'Grilled Fish',
        price: 20.00,
        description: 'Fantastic grilled fish seasoned with salt.',
        image: 'grilledFish.jpg',
      },
      {
        id: '4',
        title: 'Pasta',
        price: 6.99,
        description: 'Delicious pasta for your delight.',
        image: 'pasta.jpg',
      },
    ],
  },
  {
    title: 'desserts',
    data: [
      {
        id: '5',
        title: 'Lemon Dessert',
        price: 4.99,
        description: "You can't go wrong with this delicious lemon dessert!",
        image: 'lemonDessert.jpg',
      },
    ],
  },
];

export function getSectionListData(menuItems) {
  const sections = {};

  for (const item of menuItems) {
    if (!sections[item.category]) {
      sections[item.category] = [];
    }
    sections[item.category].push(item);
  }

  const dataObject = {}; // add declaration here

  const data = Object.entries(sections).map(([title, data]) => ({
    title,
    data: data.sort((a, b) => a.title.localeCompare(b.title)),
  })).sort((a, b) => a.title.localeCompare(b.title));

  return data.map(section => ({
    title: section.title,
    data: section.data.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
    })),
  }));
}


export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
