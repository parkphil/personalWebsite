// Add a new object for each project. Set image to a local file path when ready.
// Set href to an external URL or a case-study page; leave it blank for "coming soon".
window.PORTFOLIO_PROJECTS = [
  {
    id: 'nobel',
    shortName: 'Daily Cal',
    title: 'The Daily Californian',
    subtitle: 'Nobel Week · Data journalism',
    description: 'I pitched and led a scrollytelling feature on the 63 Nobel laureates connected to UC Berkeley.',
    video: 'media/nobel/laureates-card.mp4',
    poster: 'media/nobel/01_portrait_grid.jpg',
    href: './nobel.html'
  },
  {
    id: 'atlas',
    shortName: 'Atlas',
    title: 'Atlas',
    subtitle: 'Research platform · Product design',
    description: 'A research workspace that connects emerging patterns to the items and sources behind them.',
    video: 'media/atlas/revised/hero_screen_wall-user-web.mp4',
    poster: 'media/atlas/revised/hero_screen_wall_clean-poster.jpg',
    href: './atlas.html'
  },
  {
    id: 'workninja',
    shortName: 'WorkNinja',
    title: 'WorkNinja',
    subtitle: 'iOS · Design engineering',
    description: 'Designing the AI chat experience from early flows through SwiftUI implementation.',
    previewImages: [
      'media/workninja/chat.png',
      'media/workninja/actions.png',
      'media/workninja/models.png'
    ],
    href: './workninja.html'
  },
  {
    id: 'curation',
    shortName: 'Curation',
    title: 'Curation',
    subtitle: 'OCMA · Exhibition design',
    description: 'The House America Built. Curation and title-wall design at the Orange County Museum of Art.',
    image: 'media/curation/gallery-installation.jpg',
    imageAlt: 'Installed title wall seen through the museum gallery',
    href: './curation.html',
    paired: true
  },
  {
    id: 'forma',
    shortName: 'Forma',
    title: 'Forma',
    subtitle: 'A curator’s tool',
    description: 'A custom downloadable tool for planning exhibitions in 3D.',
    video: 'media/forma/forma-card.mp4',
    poster: 'media/forma/forma-card-poster.jpg',
    href: './forma.html',
    paired: true
  }
];
