# Getting started

## Introduction

Welcome to the Scenario Explorer, an application designed to visualize scenarios generated as parquet files by the [study](https://c.ramboll.com/life-cycle-emissions-of-eu-building-and-construction) team. The app is accessible at [https://ae-scenario-explorer.cloud.set.kuleuven.be](https://ae-scenario-explorer.cloud.set.kuleuven.be).

It is hosted on the [KU Leuven university](https://architectuur.kuleuven.be/architectural-engineering) infrastructure, and the DevOps referent is Ronny Moreas.

The terminal commands in this documentation are for linux machines.

### Contacts

- **Ronny Moreas**: it-support@set.kuleuven.be (DevOps referent)
- **Benjamin Lesné**: benjamin.lesne@outlook.fr (contracted developer to build the app)

## Start the app

You need [python ^3.12.6](https://www.python.org/downloads/), [node ^20.13.1](https://nodejs.org/en/download/package-manager), [poetry ^1.8.3](https://python-poetry.org/docs/) and [pnpm ^9.4.0](https://pnpm.io/installation#using-other-package-managers) installed on your machine (or higher versions).

:::info
You don't need the following to start the app locally:

- docker (required to update the tests snapshots , see more in [Tests end to end section](./Guides/Tests/end-to-end.md))
- pulse secure (required to access non production deployments, see more in [the VPN section](./Guides/How-to-setup-the-VPN.md))
  :::

<br/>

- clone the project through ssh and install the dependencies with this command:

```bash
git clone git@gitlab.kuleuven.be:ae/sustainable-construction/dg-grow-eu-scenariotool/scenario-explorer.git &&
cd scenario-explorer/backend && poetry install &&
cd ../frontend && pnpm install &&
cd ../e2e && npm install &&
cd ../documentation && pnpm install
```

<br/>
<br/>

- add the env files

```
cd ../backend && cp ./.env.example .env &
cd ../frontend && cp ./.env.example .env
```

<br/>

- Open the project in the root directory with your favorite code editor

```bash
code ../
```

<br/>

- Setup kubectl

1- Browse to the [Rancher instance](https://kaas.cloud.set.kuleuven.be/dashboard/auth/login)

2- Click on the [ae-01 cluster](https://kaas.cloud.set.kuleuven.be/dashboard/c/c-m-mv6j8shj/explorer#cluster-events)

3- At the top right of the page, click on the icon showing the following text when hovered:

```text
Copy KubeConfig to Clipboard
```

4- Add the config from the clipboard to your machine

```bash
xclip -selection clipboard -o > $HOME/.kube/config
```

:::warning
if you copy/paste the command above, make sure to copy the kubernetes config before executing the command
:::

:::info
This config will include a token to authenticate you, which I believe is linked to the account you used to connect to the Rancher instance. This token can expired after a while.
:::

- Place the Parquet files for testing into your data folder using [kubectl](https://kubernetes.io/docs/tasks/tools/)

1. get the backend pod name

```bash
kubectl -n scenario-explorer-19853-integration get pods
```

2. copy the parquet files from the pod to your local machine

```bash
kubectl cp <some-namespace>/<some-pod>:/app/data /path/to/repo/data/
```

Example:

```bash
kubectl cp scenario-explorer-19853-integration/scenario-explorer-backend-integration-6b4d698fcb-md4w5:/app/data ~/code/scenario-explorer/data/
```

<br/>

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

#### Useful links:

- [giltab documentation related to ssh](https://docs.gitlab.com/ee/user/ssh.html)
