# How to verify files in pod storage?

## Requirements

- [kubectl is setup](./How-to-setup-kubectl)


## Steps
Run the following commands:

```bash
kubectl -n NAMESPACE exec POD_NAME -- ls -la /app/data
```

Example:

```bash
kubectl -n scenario-explorer-19853-integration exec scenario-explorer-backend-integration-844f9b68c9-5zd7v -- ls -la /app/data
```

:::info
To check sceanarios files, update `/app/data` for `/app/data/scenarios`
:::

### Alternative
You can also exec in the pod and navigate with bash commands as you'd liked.

Connect to the pod with:
```bash
kubectl -n scenario-explorer-19853-integration exec -it scenario-explorer-backend-integration-844f9b68c9-5zd7v -- bash
```