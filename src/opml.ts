import {xml2js} from "xml-js";

//region Types
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
//endregion


//region OPML to Object

/**
 * parse OPML Channels from label element
 * @param labelElement
 */
const parseOPMLChannels = (labelElement: any) => {
  const channels = new Array<IOPMLChannel>();
  labelElement.elements.forEach((channelElement: any) => {
    try {
      const channel: IOPMLChannel = {
        type: channelElement.attributes.type,
        text: channelElement.attributes.text,
        title: channelElement.attributes.title,
        xmlUrl: channelElement.attributes.xmlUrl,
        htmlUrl: channelElement.attributes.htmlUrl,
      }
      channels.push(channel);
    } catch (e) {
      console.error(e)
    }
  });

  return channels;
}

/**
 * Parse OPML labels from body element
 * @param bodyElement
 */
const parseOPMLLabels = (bodyElement: any) => {
  const labels = new Array<IOPMLLabel>();
  bodyElement.elements.forEach((labelElement: any) => {
    try {
      const label: IOPMLLabel = {
        text: labelElement.attributes.text,
        title: labelElement.attributes.title,
      }
      label.channels = parseOPMLChannels(labelElement);
      labels.push(label);
    } catch (e) {
      console.error(e);
    }
  });

  return labels;
}

/**
 * Parse opml to object
 * @param opml
 */
export const parseOPML = (opml: string) => {
  if (!opml) {
    return undefined;
  }

  const OPML = xml2js(opml)

  if (!OPML) {
    return undefined;
  }

  const opmlObject: IOPML = {}

  const root = OPML.elements[0];
  root.elements.forEach((rootElement: any) => {
    switch (rootElement.name) {
      case 'head':
        try {
          opmlObject.title = rootElement.elements[0].elements[0].text;
        } catch (e) {
          console.warn('no title from opml');
        }
        break;
      case 'body':
        opmlObject.labels = parseOPMLLabels(rootElement);
        break;
      default:
        break;
    }
  });
  return opmlObject;
}
//endregion

