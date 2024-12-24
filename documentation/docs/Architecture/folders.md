# Folders

## Frontend

```text
.
└── src/
    ├── assets
    ├── components/
    │   ├── ui/
    │   │   └── shadcn-component.tsx
    │   └── component1.tsx
    ├── lib
    ├── routes/
    │   ├── -route1/
    │   │   ├── components/
    │   │   │   └── route1-component1.tsx
    │   │   └── index.tsx
    │   └── route1.tsx
    ├── tests
    └── env.ts
```

With this architecture we try to keep the code closer to where it is used, this is why we have a components folder in `route1` folder because those components are only used for this route. 
For components used in many area of the app we add them in the src/components folder.

`src/components/ui` is where the [shadcn-ui](https://ui.shadcn.com/) components gets generated

The `src/lib` folder is for shared utilities, constants, schemas shared with the backend, queries, etc.

To use env variables you should access them through the env variable in the env.ts file. This file provide type safety for env variables and early errors when variables are missing.


## e2e

```
.
├── scripts
└── tests/
    ├── features
    ├── pages/
    │   └── page1/
    │       ├── features/
    │       │   └── feature1.spec.ts
    │       ├── base.spec.ts
    │       └── functions.ts
    ├── functions.ts
    └── env.ts
```

Same logic as frontend, functions.ts stores functions used by all the current directory or subdirectories.

Same env.ts file as frontend.


## Backend

Too small for a folder architecture.


