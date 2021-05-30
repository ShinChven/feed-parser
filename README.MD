# Feed Parser

> Parse feed and opml

## Parse Feed

### Usage

```TypeScript
const data = parseFeed(feedXML) // rss or atom xml string
```

### Types

```TypeScript
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
```

## Parse OPML

Parse an opml outputted from Feedly or tinyrss.

### Usage

```TypeScript
const data = parseOPML(opml); // opml xml string
```

### Types

```TypeScript
export type IOPML = {
  title?: string;
  labels?: IOPMLLabel[];
};

export type IOPMLLabel = {
  text?: string;
  title?: string;
  channels?: IOPMLChannel[];
}

export type IOPMLChannel = {
  type?: 'rss' | 'atom'
  text?: string;
  title?: string;
  xmlUrl?: string;
  htmlUrl?: string;
}
```


