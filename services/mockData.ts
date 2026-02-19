import { Movie } from '../types';

export const CATEGORIES = [
  "Action", "Drama", "Sci-Fi", "Comedy", "Thriller"
];

// Initial Sample Data so the site isn't empty
export const MOVIES: Movie[] = [
  {
    id: '1',
    type: 'movie',
    title: 'Interstellar Mission',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival. A visually stunning masterpiece about love, time, and space.',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: '2h 49m',
    rating: 4.8,
    year: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    cast: ['Matthew M.', 'Anne H.', 'Jessica C.'],
    director: 'Christopher Nolan'
  },
  {
    id: '2',
    type: 'series',
    title: 'Cyber City Chronicles',
    description: 'In a dystopia where technology rules, one hacker tries to bring down the system. A gritty cyberpunk saga.',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    duration: '45m Avg',
    rating: 4.6,
    year: 2023,
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=1200',
    cast: ['Keanu R.', 'Carrie-Anne M.'],
    director: 'Lana W.',
    episodes: [
      {
        id: 'e1',
        title: 'The Awakening',
        season: 1,
        episodeNumber: 1,
        videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        duration: '48m',
        description: 'Neo wakes up to a new reality.'
      },
      {
        id: 'e2',
        title: 'The Training',
        season: 1,
        episodeNumber: 2,
        videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        duration: '45m',
        description: 'Learning the rules of the simulation.'
      }
    ]
  },
  {
    id: '3',
    type: 'movie',
    title: 'The Last Samurai',
    description: 'An American military advisor embraces the Samurai culture he was hired to destroy after being captured in battle.',
    genre: ['Action', 'Drama', 'History'],
    duration: '2h 34m',
    rating: 4.7,
    year: 2003,
    imageUrl: 'https://images.unsplash.com/photo-1614583225154-5fcdda07019e?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    cast: ['Tom C.', 'Ken W.'],
    director: 'Edward Zwick'
  },
  {
    id: '4',
    type: 'movie',
    title: 'Mountain Peak',
    description: 'A documentary following the most dangerous climb of K2.',
    genre: ['Documentary', 'Adventure'],
    duration: '1h 30m',
    rating: 4.2,
    year: 2022,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    cast: ['Nims Purja'],
    director: 'Torquil Jones'
  },
  {
    id: '5',
    type: 'series',
    title: 'Chef\'s Kitchen',
    description: 'World-renowned chefs share their personal stories and inspirations.',
    genre: ['Documentary', 'Lifestyle'],
    duration: '50m Avg',
    rating: 4.9,
    year: 2021,
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=1200',
    cast: ['Massimo Bottura', 'Dan Barber'],
    director: 'David Gelb',
    episodes: [
       { id: 'c1', title: 'Italy', season: 1, episodeNumber: 1, videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', duration: '50m' }
    ]
  }
];

export const FEATURED_MOVIE: Movie | null = MOVIES[0];