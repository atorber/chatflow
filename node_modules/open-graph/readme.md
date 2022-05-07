# Open Graph for Node.js

An [Open Graph](http://ogp.me/) implementation for Node.js.
Simple to use; give it a URL and it'll give you the open graph meta properties scraped from that URL.

## Install
```
npm install open-graph
```

## Usage

```js
const og = require('open-graph');

const url = 'http://github.com/samholmes/node-open-graph/raw/master/test.html';

og(url, function (err, meta) {
  console.log(meta);
});
```

Outputs:

```js
{
  title: 'OG Testing',
  type: 'website',
  url: 'http://github.com/samholmes/node-open-graph/raw/master/test.html',
  site_name: 'irrelavent',
  description: 'This is a test bed for Open Graph protocol.',
  image: {
    url: 'http://google.com/images/logo.gif',
    width: '100',
    height: '100'
  }
}
```

# Todo

1. **Better parser**
  Meta data should be parsed into pure JSON and arrays should be handled at root nodes, not leaf nodes
2. **Better data types**
  Convert properties to numbers, etc.
3. **Fallback data**
  If Open Graph data isn't present, scrap img elements and document titles off the page.
