export const SCENES = [
  { 
    id: 1, 
    title: 'Euphoria Song', 
    category: 'Series', 
    mood: 'Emotional', 
    type: 'Orchestral · Labrinth-style', 
    year: '2025', 
    src: 'https://cdn.hillsmckay.art/vids/vid1.mp4', 
    img: 'https://cdn.hillsmckay.art/img/vid7.webp', 
    featured: false, 
    recent: false 
  },
  { 
    id: 2, 
    title: 'Euphoria Song', 
    category: 'Series', 
    mood: 'Dramatic', 
    type: 'Orchestral · Labrinth-style', 
    year: '2025', 
    src: 'https://cdn.hillsmckay.art/vids/vid2.mp4', 
    img: 'https://cdn.hillsmckay.art/img/vid6.webp', 
    featured: false, 
    recent: false 
  },
  { 
    id: 3, 
    title: 'Euphoria Scene Remake', 
    category: 'Series', 
    mood: 'Emotional', 
    type: 'Labrinth-style', 
    year: '2025', 
    src: 'https://cdn.hillsmckay.art/vids/vid3.mp4', 
    img: 'https://cdn.hillsmckay.art/img/vid2.webp', 
    featured: false, 
    recent: false 
  },
  { 
    id: 4, 
    title: 'Euphoria Scene Remake', 
    category: 'Series', 
    mood: 'Euphoric', 
    type: 'Labrinth-style', 
    year: '2025', 
    src: 'https://cdn.hillsmckay.art/vids/vid5.mp4', 
    img: 'https://cdn.hillsmckay.art/img/vid1.webp', 
    featured: true, 
    recent: true 
  },
  { 
    id: 5, 
    title: 'Euphoria Scene Remake', 
    category: 'Series', 
    mood: 'Cinematic', 
    type: 'Orchestral', 
    year: '2026', 
    src: 'https://cdn.hillsmckay.art/vids/vid4.mp4', 
    img: 'https://cdn.hillsmckay.art/img/vid3.webp', 
    featured: true, 
    recent: true 
  },
  { 
    id: 6, 
    title: 'Euphoria Scene Remake', 
    category: 'Series', 
    mood: 'Atmospheric', 
    type: 'Labrinth-style', 
    year: '2025', 
    src: 'https://cdn.hillsmckay.art/vids/vid6.mp4', 
    img: 'https://cdn.hillsmckay.art/img/vid4.webp', 
    featured: true, 
    recent: true 
  },
]

export const SCENE_CATEGORIES = ['Series', 'Films', 'Independant Films', 'Trailer', 'Multiple Scenes', 'Commercial', 'AI Generated Visuals']
export const SCENE_MOODS = ['Atmospheric', 'Euphoric', 'Cinematic', 'Emotional', 'Dramatic']

export const SIDEBAR_ITEMS = [
  {
    group: 'LIBRARY',
    items: [
      { icon: '▦', label: 'All' },
      { icon: '⊞', label: 'Recently Added' },
    ],
  },
  {
    group: 'CATEGORY',
    items: [
      { icon: '◈', label: SCENE_CATEGORIES[0] },
      { icon: '▶', label: SCENE_CATEGORIES[1] },
      { icon: '◉', label: SCENE_CATEGORIES[2] },
      { icon: '▷', label: SCENE_CATEGORIES[3] },
      { icon: '⊟', label: SCENE_CATEGORIES[4] },
      { icon: '◻', label: SCENE_CATEGORIES[5] },
      { icon: '✦', label: SCENE_CATEGORIES[6] },
    ],
  },
  {
    group: 'MOOD',
    items: [
      { icon: '◐', label: SCENE_MOODS[0] },
      { icon: '◑', label: SCENE_MOODS[1] },
      { icon: '◒', label: SCENE_MOODS[2] },
      { icon: '◓', label: SCENE_MOODS[3] },
      { icon: '◔', label: SCENE_MOODS[4] },
    ],
  },
]