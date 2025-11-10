# Do your Daily (DyDaily)

DyDaily is a simple tracker web app for completing daily login quest that is usually found in many Gacha / Online games (Genshin, ZZZ, Blue Archive, etc).

## Features

### Daily Tracker with Streak Counter

- Add tasks with name and server refresh time, with optional url
- Mark your task when completed, url task will both open and mark it
- Streak counter *(currently kinda buggy...)*

![DyDaily Preview 1](/docs/dydaily-preview-1.jpg)

![DyDaily Preview 2](/docs/dydaily-preview-2.jpg)

### Calendar View

- Show all completion with a monthly calendar view

![DyDaily Preview 3](/docs/dydaily-preview-3.jpg)

### Data Export / Import

- Data stored fully locally on your browser
- Export / Import your data as plain json file
- Version support, your data is safe even with major updates

### PWA and Full Offline Support

- PWA ready, can be installed as an app on supported browser / device
- DyDaily works fully offline after the first load

## Future Plans
1. Task Editing
2. Streak Logic Improvement
3. Streak Break Protection
4. Reminders / Notifications
5. Dark Mode
6. and more... suggestions are welcome!

## Tech Stack
- Language: TypeScript
- Frontend: Vue.js
- Backend: Nuxt.js
- Styling: CSS, Tailwind CSS
- Deployment: Github Pages

# Development

## Setup

### Install

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run generate
```

or 

```bash
npx nuxt build --preset github_pages
```

## Deploy to Github Pages

This repo uses Github Action based on the official documentation [here](https://nuxt.com/deploy/github-pages)


