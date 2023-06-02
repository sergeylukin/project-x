export const config = {
  name: 'tag',
  disabled: false,
  itemsPerPage: 4,

  item: {
    permalink: '/%year%/%slug%', // Variables: %slug%, %year%, %month%, %day%, %hour%, %minute%, %second%, %category%
    noindex: false,
    disabled: false,
  },

  list: {
    pathname: 'blog', // Blog main path, you can change this to "articles" (/articles)
    noindex: false,
    disabled: false,
  },

  taxonomies: {
    category: {
      name: 'category',
      pathname: 'category', // Category main path /category/some-category
      noindex: true,
      disabled: false,
      itemsPerPage: 6,
    },
    tag: {
      name: 'tag',
      pathname: 'tag', // Tag main path /tag/some-tag
      noindex: true,
      disabled: false,
      itemsPerPage: 2,
    },
  },
};
