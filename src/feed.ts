import {xml2js} from "xml-js";

export type IFeed = {
  type: 'rss' | 'atom';
  version?: string;
  title?: string;
  link?: string;
  description?: string;
  rssLink?: string;
  copyright?: string;
  guid?: string;
  updated?: string;
  items: IFeedItem[];
}

export type IFeedItem = {
  title?: string;
  content?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  isoDate?: string;
  guid?: string;
  comments?: number;
  creator?: string;
  author?: string;
  categories: IFeedItemCategory[];
}

export type IFeedItemCategory = {
  name: string;
  link?: string;
}

/**
 * Read text or CDATA from xml node
 * @param rssElement
 */
let getTextOrCDATA = (rssElement: any) => {
  let data;
  if (rssElement.type === 'cdata') {
    data = rssElement.cdata;
  } else if (rssElement.type === 'text') {
    data = rssElement.text;
  }
  return data;
};

/**
 * Read text or CDATA from the first element
 * @param elements
 */
let getTextOrCDATAAtElementZero = (elements: Array<any>) => {
  try {
    if (Array.isArray(elements) && elements.length > 0) {
      return getTextOrCDATA(elements[0]);
    }
  } catch (e) {// noinspection JSUnresolvedFunction
    console.error(e);
  }
};

/**
 * Detect feed type, rss or atom.
 * @param rootElements
 */
const getElementType = (rootElements: Array<any>) => {
  if (Array.isArray(rootElements)) {
    for (let i = 0; i < rootElements.length; i++) {
      const element = rootElements[i]
      if (element.name === 'rss') {
        return 'rss'
      } else if (element.name === 'feed') {
        return 'atom'
      }
    }
  }
}

/**
 * Parse RSS feed
 * @param root xml root
 */
const parseRSS = (root: any) => {
  const feed: IFeed = {
    type: 'rss',
    items: [],
  }

  const bodyElement = root.elements[0];

  try {
    feed.version = bodyElement.attributes.version;
  } catch (e) {
    console.error(e);
  }

  const rssElements = bodyElement.elements[0].elements;

  rssElements.forEach((rssElement: any) => {
    // Parse feed info
    if (rssElement.name === 'title') {
      feed.title = getTextOrCDATAAtElementZero(rssElement.elements);
    } else if (rssElement.name === 'link') {
      feed.link = getTextOrCDATAAtElementZero(rssElement.elements);
    } else if (rssElement.name === 'description') {
      feed.description = getTextOrCDATAAtElementZero(rssElement.elements);
    } else if (rssElement.name === 'copyright') {
      feed.copyright = getTextOrCDATAAtElementZero(rssElement.elements);
    } else if (rssElement.name === 'atom:link') {
      try {
        feed.rssLink = rssElement.attributes.href;
      } catch (e) {
        console.error(e);
      }

      // Parse feed entries
    } else if (rssElement.name === 'item') {
      const itemElements = rssElement.elements;
      itemElements.forEach((itemElement: any) => {
        const item: IFeedItem = {categories: []};
        if (itemElement.name === 'title') {
          item.title = getTextOrCDATAAtElementZero(itemElement.elements);
        } else if (itemElement.name === 'content:encoded' || itemElement.name === 'content') {
          item.content = getTextOrCDATAAtElementZero(itemElement.elements);
        } else if (itemElement.name === 'link') {
          item.link = getTextOrCDATAAtElementZero(itemElement.elements);
        } else if (itemElement.name === 'description') {
          item.description = getTextOrCDATAAtElementZero(itemElement.elements);
        } else if (itemElement.name === 'pubDate') {
          item.pubDate = getTextOrCDATAAtElementZero(itemElement.elements);
        } else if (itemElement.name === 'isoDate') {
          item.isoDate = getTextOrCDATAAtElementZero(itemElement.elements);
        } else if (itemElement.name === 'guid') {
          item.guid = getTextOrCDATAAtElementZero(itemElement.elements);
        } else if (itemElement.name === 'comments') {
          item.comments = getTextOrCDATAAtElementZero(itemElement.elements);
        } else if (itemElement.name === 'dc:creator' || itemElement.name === 'creator') {
          item.creator = getTextOrCDATAAtElementZero(itemElement.elements);
        } else if (itemElement.name === 'author') {
          item.author = getTextOrCDATAAtElementZero(itemElement.elements);
        } else if (itemElement.name === 'category') {
          item.categories.push({name: getTextOrCDATAAtElementZero(itemElement.elements)});
        }
        feed.items.push(item);
      });
    }
  });

  return feed;
}

/**
 * Parser Atom feed
 * @param root xml root
 */
const parseAtom = (root: any): IFeed => {
  const feed: IFeed = {
    type: 'atom',
    items: [],
  }

  const bodyElement = root.elements[0];
  const elements = bodyElement.elements;

  elements.forEach((itemElement: any) => {
    // Parse feed info
    if (itemElement.name === 'title') {
      feed.title = getTextOrCDATAAtElementZero(itemElement.elements);
    } else if (itemElement.name === 'link') {
      if (itemElement.attributes) {
        if ('alternate' === itemElement.attributes.rel) {
          feed.link = itemElement.attributes.href;
        } else if ('self' === itemElement.attributes.rel) {
          feed.rssLink = itemElement.attributes.href;
        }
      }
    } else if (itemElement.name === 'id') {
      feed.link = getTextOrCDATAAtElementZero(itemElement.elements);
      feed.guid = getTextOrCDATAAtElementZero(itemElement.elements);
    } else if (itemElement.name === 'updated') {
      feed.updated = getTextOrCDATAAtElementZero(itemElement.elements);

      // Parse feed entries
    } else if (itemElement.name === 'entry') {
      const item: IFeedItem = {
        categories: [],
      };
      if (Array.isArray(itemElement.elements) && itemElement.elements.length > 0) {
        itemElement.elements.forEach((entry: any) => {
          if (entry.name === 'title') {
            item.title = getTextOrCDATAAtElementZero(entry.elements);
          } else if (entry.name === 'link') {
            if (entry.attributes) {
              item.link = entry.attributes.href;
            }
          } else if (entry.name === 'published') {
            item.pubDate = getTextOrCDATAAtElementZero(entry.elements);
          } else if (entry.name === 'summary') {
            item.description = getTextOrCDATAAtElementZero(entry.elements);
          } else if (entry.name === 'content') {
            item.content = getTextOrCDATAAtElementZero(entry.elements);
          } else if (entry.name === 'category') {
            item.categories.push({name: entry?.attributes?.term, link: entry?.attributes?.scheme});
          }
        });
        feed.items.push(item);
      }
    }
  });

  return feed;
}

/**
 * Parse feed xml string to object.
 * RSS and Atom are supported.
 * @param feedXMl feed xml
 */
export const parseFeed = (feedXMl: string): IFeed | undefined => {
  let root = xml2js(feedXMl);
  if (!root) {
    return undefined;
  }
  const type = getElementType(root.elements);
  switch (type) {
    case "rss":
      return parseRSS(root);
    case "atom":
      return parseAtom(root);
  }
};
