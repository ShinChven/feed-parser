// @ts-ignore
import fs from 'fs-extra';
import {parseFeed} from "../src";
// @ts-ignore
import path from "path";
// @ts-ignore
import assert from "assert";

// @ts-ignore
import http from 'superagent';

const url = 'https://www.vgtime.com/rss.jhtml';
const atom = 'https://atlassc.net/atom.xml';

describe('RSS parser',  () => {
  it('parse rss', async () => {
    const resp = await http.get(url)
      .timeout({
        response: 5000,  // Wait 5 seconds for the server to start sending,
        deadline: 10000, // but allow 1 minute for the file to finish loading.
      });
    let xmlText = resp.text;
    const data = parseFeed(xmlText);
    console.log(JSON.stringify(data, null, 2));
  });

  it('view rss source', async () => {
    const resp = await http.get(url)
      .timeout({
        response: 5000,  // Wait 5 seconds for the server to start sending,
        deadline: 10000, // but allow 1 minute for the file to finish loading.
      });
    let xmlText = resp.text;
    console.log(xmlText)
  });

  it('parse atom', async () => {
    const resp = await http.get(atom)
      .timeout({
        response: 5000,  // Wait 5 seconds for the server to start sending,
        deadline: 10000, // but allow 1 minute for the file to finish loading.
      });
    let xml = Buffer.from(resp.body).toString('utf-8');
    const data = parseFeed(xml);
    console.log(JSON.stringify(data, null, 2));
  });

  it('view atom source', async () => {
    const resp = await http.get(atom)
      .timeout({
        response: 5000,  // Wait 5 seconds for the server to start sending,
        deadline: 10000, // but allow 1 minute for the file to finish loading.
      });
    let xmlText = resp.body;
    let xml = Buffer.from(xmlText).toString('utf-8');
    console.log(xml);
  });


});
