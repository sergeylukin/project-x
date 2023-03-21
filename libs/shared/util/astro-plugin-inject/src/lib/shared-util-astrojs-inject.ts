export const inject = ({ filePath }) => {
  return {
    name: '@depl/astrojs-inject',
    hooks: {
      'astro:config:setup': async ({ injectScript }) => {
        const CONFIG_LOAD_JS = fs.readFileSync(filePath).toString();
        injectScript('page-ssr', CONFIG_LOAD_JS);
      },
    },
  };
};
