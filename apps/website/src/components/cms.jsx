import React, { useEffect } from 'react';
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

export const Cms = () => {
  useEffect(() => {
    CMS.registerWidget('mdx', MdxControl, MdxPreview);

    CMS.init();
  }, []);
  return <div />;
};
