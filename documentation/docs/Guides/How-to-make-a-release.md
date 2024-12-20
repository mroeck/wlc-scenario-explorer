# How to make a release?

## Review

## Integration

## Production

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

2. [create a merge request](https://gitlab.kuleuven.be/ae/sustainable-construction/dg-grow-eu-scenariotool/scenario-explorer/-/merge_requests/new) from the release branch to main


