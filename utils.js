import { useRef, useEffect } from 'react';

export const SECTION_LIST_MOCK_DATA = [
    {
      title: 'Appetizers',
      data: [
        {
          id: '1',
          title: 'Pasta',
          price: '10',
        },
        {
          id: '3',
          title: 'Pizza',
          price: '8',
        },
      ],
    },
    {
      title: 'Salads',
      data: [
        {
          id: '2',
          title: 'Caesar',
          price: '2',
        },
        {
          id: '4',
          title: 'Greek',
          price: '3',
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
