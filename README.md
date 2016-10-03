# Worona Dashboard Development

## Installation

Clone this repo or [download the zip file from Github](https://github.com/worona/worona-app/archive/master.zip).

```bash
git clone https://github.com/worona/worona-app.git
cd worona-app
```

----

[**Install Node**](https://nodejs.org/en/) if you haven't installed it yet. We recommend v4.

----

Run `npm run install:all` to install all dependencies. It may take quite a while. Don't despair.

```bash
npm install # do this first to install recuersive-install
npm run install:all
```

## Development

Run the dashboard client.

```bash
cd client
npm start
```

Open another terminal and run the tests watcher.

```bash
npm test
```

---
