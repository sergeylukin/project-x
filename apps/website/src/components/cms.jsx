import React from 'react';
import CMS from 'netlify-cms-app';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import * as acorn from 'acorn';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { sanitize } from 'hast-util-sanitize';
import { raw } from 'hast-util-raw';
import { mdxJsx } from 'micromark-extension-mdx-jsx';
import { toHast } from 'mdast-util-to-hast';
import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';

import {
  CONFIG,
  IEnvironment,
} from '@astro-nx-depla/shared/util/config-provider';

const isProd = CONFIG.get('app.env') === IEnvironment.Prod;

const components = {
  h1: (props) => <h1 style={{ color: 'tomato' }} {...props} />,
};

const scope = {
  TestComp: (props) => <h1>asdasdsa</h1>,
};

const allowedImports = {
  wherever: {
    ImportDefault: (props) => <h1>This is a demo component</h1>,
  },
};

const MdxControl = ({ value }) => <p>Use OKMDX here</p>;

const MdxPreview = ({ value }) => {
  const mdast = fromMarkdown(value, {
    extensions: [mdxJsx({ acorn: acorn, addResult: true })],
    mdastExtensions: [mdxJsxFromMarkdown()],
  });
  window.mdast = mdast;
  mdast.children = mdast.children.filter(
    (child) =>
      !child.children[0]?.value?.startsWith('import ') &&
      !child.children[0]?.value?.startsWith('export ')
  );
  const hast = raw(
    toHast(mdast, {
      allowDangerousHtml: true,
      handlers: {
        mdxJsxFlowElement(h, /** @type {Paragraph} */ node) {
          /** @type {Element} */
          switch (node.name) {
            case 'Picture':
              const obj = {
                type: 'element',
                tagName: 'img',
                properties: {
                  src: 'https://placeholder.com/assets/images/150x150-500x500.png',
                },
                children: [],
              };
              h.patch(node, obj);
              return h.applyData(node, obj);
              break;
            default:
              return null;
              break;
          }
        },
      },
    })
  );
  const safeHast = sanitize(hast);
  return toJsxRuntime(safeHast, { Fragment, jsx, jsxs });
};

CMS.registerWidget('mdx', MdxControl, MdxPreview);
console.log(
  isProd ? 'I am in PROD' : 'I am in DEV',
  isProd,
  CONFIG.get('app')
);

CMS.init({
  config: {
    backend: isProd
      ? {
          name: 'git-gateway',
          branch: 'main',
        }
      : {
          name: 'proxy',
          proxy_url: 'http://localhost:8081/api/v1git-gateway',
          branch: 'main',
        },
    local_backend: isProd ? false : true,
    load_config_file: false,
    media_folder: 'apps/website/src/assets/images',
    public_folder: '~/assets/images',
    publish_mode: 'editorial_workflow',
    collections: [
      {
        label: isProd ? 'Posts' : 'Shmosts',
        name: 'post',
        folder: 'apps/website/src/content/post',
        create: true,
        delete: true,
        extension: 'mdx',
        format: 'frontmatter',
        fields: [
          { name: 'title', widget: 'string', label: 'Post Title' },
          { name: 'image', widget: 'image', label: 'Cover' },
          { name: 'body', widget: 'markdown', label: 'Post Body' },
          { label: 'Description', name: 'description', widget: 'text' },
          { label: 'Tags', name: 'tags', widget: 'list' },
          { label: 'Author', name: 'author', widget: 'string' },
          {
            label: 'Author Twitter Handle',
            name: 'authorTwitter',
            widget: 'string',
          },
          { label: 'Publish Date', name: 'date', widget: 'datetime' },
        ],
      },
    ],
  },
});
