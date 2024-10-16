# Tests end to end

## Requirements

- You need [docker ^27.2.1](https://www.docker.com/) (or higher) to update the snapshots

## Setup:

From the root directory, add the .env and install the depdencies with:

```bash
cd e2e && npm install &
cp ./.env.example .env
```

## How to make a test?

In root/e2e/tests, add a file with a test function (for more info see [Playwright doc](https://playwright.dev/docs/intro)), then you can run:

```bash
cd e2e && npm run e2e:dev:headed
```

This runs playwright headed with chrome desktop as device.

To run it on mobile:

```bash
npm run e2e:dev:headed:mobile
```

## How to update the snapshots?

In your root directory, run:

```bash
npm run e2e:update:snapshots
```

It will use the docker compose.yaml file, use the production version of the app and update all the tests with the tag: TAGS.snapshot.

This will generate new snapshots that should be visible in git as new changes.

:::tip
In VScode, pressing **CTRL + SHIFT + G** opens the source control panel with the new changes. You can easily click on each new snapshots to make sure they are correct.
:::

### Why do we use docker?

Because snapshots can fail just because we use a different device. To fix that we use docker to make sure the environment is the same in the pipeline and locally when testing snapshots.

## CI: How can I see the test-report?

Good question, everytime I click on the test-report link it leads me to a 404 page in gitlab.

My solution is to rerun the failing tests locally and use the test report of it. To do so, grab all the tests file names that are failing from the pipeline terminal, playwright display them all at the end usually, then change `test(` for `test.only`( to the failing tests of those files on your machine and run:

```bash
cd e2e && npm run e2e
```

This run the tests with .only, these should fail and a test report should open in your browser.

### If some tests are snapshots

Add the following to the e2e service in the compose.yaml file:

```yaml
command: npx playwright test
```

:::note
You just have to comment the current command and uncomment the command given above in the compose.yaml file.
:::

Then in the root folder run:

```bash
npm run e2e:update:snapshots
```

This will trigger the tests with the docker compose but won't update the snapshots since we replaced the command of the e2e service.

When it is done, outside of the docker container, in the root directory on your machine, run:

```bash
npx playwright show-report
```

This will open the test-report generated inside the docker container.

:::warning
When you are done don't forget to put back the update snapshot command in the compose.yaml
:::
