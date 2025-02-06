# How to deploy the app?

## Review

When creating a merge request (MR) to develop, a review environment running the MR code will be created to run the end-to-end tests on it.

## Integration

When merging to develop, an integration environment is deployed with the latest code from develop.

## Production

TL;DR: merge in main and it will be deploy to production automatically

:::warning
You need the maintainer role in gitlab.
:::

1. create a release branch from develop

```bash
git switch develop &&
git pull &&
git checkout -b release-[YEAR].[MONTH]-[ID]
```
You don't have to follow the naming convention for the release branch, it is easier to track what is merged to main with it though.

ID: first release of the month means id = 1, second id = 2 and so on.

2. Update the root package.json version key with "[YEAR].[MONTH]-[ID]"

3. Merge the release branch to main (with a [create a merge request](https://gitlab.kuleuven.be/ae/sustainable-construction/dg-grow-eu-scenariotool/scenario-explorer/-/merge_requests/new?merge_request%5Bsource_branch%5D=release-[YEAR].[MONTH]-[ID]&merge_request%5Btarget_branch%5D=main
) or force push)

:::warning
Do not squash the commits, it will conflict when merging main to develop
:::

4. Merge the main branch to develop to avoid merge conflicts next time

:::info
In case you get merge conflicts you can also force push to main:<br/>
Settings > repository > Protected branches > [allow force push](https://gitlab.kuleuven.be/ae/sustainable-construction/dg-grow-eu-scenariotool/scenario-explorer/-/settings/repository) for main and:

```bash
git push origin develop:main --force
```
:::

Ressource:
- [example release merge request to main](https://gitlab.kuleuven.be/ae/sustainable-construction/dg-grow-eu-scenariotool/scenario-explorer/-/merge_requests/67#note_282317)


