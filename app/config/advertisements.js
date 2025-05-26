// Advertisement configuration
export const advertisementConfig = {
  // Sidebar advertisements
  sidebar: {
    enabled: true,
    position: 'right',
    types: ['shoes', 'summer', 'food'],
  },
  
  // Home page advertisements
  home: {
    enabled: true,
    sections: {
      featured: {
        enabled: true,
        position: 'after',
        type: 'horizontal',
      },
      trending: {
        enabled: true,
        position: 'after',
        type: 'vertical',
      },
    },
  },
  
  // Blog page advertisements
  blog: {
    enabled: true,
    sections: {
      header: {
        enabled: true,
        type: 'single',
      },
      content: {
        enabled: true,
        position: 'right',
        type: 'vertical',
      },
    },
  },
  
  // Wribate page advertisements
  wribate: {
    enabled: true,
    sections: {
      discussion: {
        enabled: true,
        position: 'right',
        type: 'vertical',
      },
    },
  },
}; 