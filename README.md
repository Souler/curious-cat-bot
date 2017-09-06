# CuriousCat Telegram Bot
[![Build Status](https://travis-ci.org/Souler/curious-cat-bot.svg?branch=master)](https://travis-ci.org/Souler/curious-cat-bot)

A bot for interacting with [CuriousCat](https://curiouscat.me) on Telegram. Currently available at [@CuriousCat_bot](https://telegram.me/CuriousCat_bot).

## Running locally

### Prerequisites
- A Telegram Bot API key. You can get one via [BotFather](https://telegram.me/BotFather).
- A [CuriousCat](https://curiouscat.me) API key.
- [nvm](https://github.com/creationix/nvm) or [nodejs](https://nodejs.org/) v6 or greater.
- [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/).

### Configuration
```
git clone git@bitbucket.org:Souler/curious-cat-bot.git
nvm use # Skip this step if you don't have nvm installed
cp .env.example .env
nano .env # Edit the file with your tokens
yarn install # or npm install
```

### Starting
```
yarn run start # or npm test
```

## Disclamer
This project and its developers are not associated in any way with CuriousCat or its brand. If you represent said brand and have
any problem with this project feel free to contact any of the project developers via github or email.
