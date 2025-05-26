# Getting started

## Introduction

🚀 Welcome to the WLC Scenario Explorer source code!

This tool allows exploration of different future scenarios for **W**hole **L**ife **C**ycle greenhouse gas (GHG) emissions of buildings across Europe

THE GOAL: help policymakers and practitioners as well as researchers to explore the impact of various strategies on carbon footprints like:

- Increase of circularity measures
- Reduce space per capita
- Reduce transport and construction emissions
- Shift to low carbon and bio-based solutions
- Reduce operational emissions
- Increase use of improved materials

Users can view emissions for each building type, country, material, and more!

You can download the displayed data as an image or as a spreadsheet and visualize it with three type of graphs in the app.

The data comes from building LCAs and building stock modelling of KU Leuven and TU Graz developed as part of the ‘Analysis of Life-cycle Greenhouse Gas Emissions and Removals of EU Buildings and Construction’ study funded by the European Commission.

https://c.ramboll.com/life-cycle-emissions-of-eu-building-and-construction.

The app is accessible at [https://ae-scenario-explorer.cloud.set.kuleuven.be](https://ae-scenario-explorer.cloud.set.kuleuven.be) and is hosted on the [KU Leuven university](https://architectuur.kuleuven.be/architectural-engineering) infrastructure.

Disclaimer: The terminal commands in this documentation are for linux machines.

## Installation

You need [python ^3.12.6](https://www.python.org/downloads/), [node ^20.13.1](https://nodejs.org/en/download/package-manager), [poetry ^1.8.3](https://python-poetry.org/docs/) and [pnpm ^9.4.0](https://pnpm.io/installation#using-other-package-managers) installed on your machine (or higher versions).

<details><summary>You don't need the following to start the app locally (click to see more)</summary>

- docker (required to update the tests snapshots , see more in [Tests end to end section](./Guides/Tests/end-to-end.md))
- pulse secure (required to access non production deployments, see more in [the VPN section](./Guides/How-to-setup-the-VPN.md))
</details>

<br/>

- clone the project through ssh and install the dependencies with this command:

```bash
git clone git@gitlab.kuleuven.be:ae/sustainable-construction/dg-grow-eu-scenariotool/scenario-explorer.git &&
cd scenario-explorer/backend && poetry install &&
cd ../frontend && pnpm install &&
cd ../e2e && npm install &&
cd ../documentation && pnpm install
```

If needed see [giltab documentation related to ssh](https://docs.gitlab.com/ee/user/ssh.html)

<br/>
<br/>

- add the env files

```bash
cd ../backend && cp ./.env.example .env &
cd ../frontend && cp ./.env.example .env
```

<br/>

- Open the project in the root directory with your favorite code editor

```bash
code ../
```

<br/>

- Create the root/data/scenarios folder and generate the seeds

```bash
mkdir ../data/scenarios &&
pnpm dlx tsx ./scripts/generateSeeds.ts
```

<br/>

## Start the app

- Start the dev servers from the root directory (one terminal for each):

```bash
cd backend && poetry run task dev
```

```bash
cd frontend && pnpm run dev
```

```bash
cd documentation && pnpm run start
```

The app should be running on [localhost:3000](http://localhost:3000) and the documentation on [localhost:4000](http://localhost:4000).

For more info: see the documentation.
If somehow you can't run the documentation server, you can still access the doc in repo/documentation/docs

<br/>

## Example usage

### Video:

[![Watch the video](https://img.youtube.com/vi/S7O1V5hLee8/maxresdefault.jpg)](https://www.youtube.com/watch?v=S7O1V5hLee8)

## API documentation

There is only one API endpoint. After starting the documentation server (see intallation) go to:

```url
http://localhost:4000/docs/API/scenario
```

or open the file at:

```
./documentation/docs/API/scenario.md
```

There is also a [bruno](https://www.usebruno.com/) collection at:

```
./backend/bruno
```

## Contacts

- **KU Leuven IT Support**: it-support@set.kuleuven.be (DevOps referent)
- **Benjamin Lesné**: benjamin.lesne@outlook.fr (contracted developer to build the app)
