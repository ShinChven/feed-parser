// @ts-ignore
import fs from 'fs-extra';
import {parseOPML} from "../src";
// @ts-ignore
import path from "path";
// @ts-ignore
import assert from "assert";

describe('OPML Parser', () => {
  const opml = fs.readFileSync(path.join(__dirname, './opml-sample-feedly.opml'), "utf-8");
  const data = parseOPML(opml);
  it('parseOPML', () => {
    assert.ok(data !== undefined, 'no data');
    // @ts-ignore
    assert.ok(data?.labels?.length > 0, 'found no labels');
    // @ts-ignore
    assert.ok(data?.labels[0]?.channels.length > 0, 'found no channels');
  });
  it('view data', () => {
    console.log(JSON.stringify(data, null, 2));
  });
});
