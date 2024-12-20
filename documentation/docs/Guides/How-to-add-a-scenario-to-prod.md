# How to add or remove a scenario from an environment?

## Requirements:

- [kubectl](https://kubernetes.io/docs/tasks/tools) v1.31.3 or higher

## Setup kubernetes config {#setup-kubernetes-config}

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
This config will include a token to authenticate you, which I believe is linked to the account you used to connect to the Rancher instance.
:::

## Copy local files to _pod_

1- Pick the target namespace:

- scenario-explorer-19853-review
- scenario-explorer-19853-integration
- scenario-explorer-19853-production

2- Get the pod

```bash
kubectl -n scenario-explorer-19853-review get pods
```

:::warning
If no ressources are found you are probably using the review namespace. Creating a merge request to develop will trigger the pipeline that creates pods.
I guess there are better way to do it but I'm no kubernetes expert so this work around should do the trick for now
:::

<details>
<summary>If you get an error 403 click here</summary>

### The error:
```bash
E1219 14:52:33.271046   69406 memcache.go:265] "Unhandled Error" err="couldn't get current server API group list:
```

```json
{
  "Code": { "Code": "Forbidden", "Status": 403 },
  "Message": "clusters.management.cattle.io \"c-m-mv6j8shj\" is forbidden: User \"system:unauthenticated\" cannot get resource \"clusters\" in API group \"management.cattle.io\" at the cluster scope",
  "Cause": null,
  "FieldName": ""
}
```

### Solution:
The token in your kubernetes config expired you need to redo the Setup [kubernetes config section](#setup-kubernetes-config)

</details>

3- Copy the local files to it

```bash
kubectl -n NAMESPACE cp path/to/local/file POD_NAME:path/in/pod/to/drop/file
```

Example:

```bash
kubectl -n scenario-explorer-19853-review cp ./BASE.parquet scenario-explorer-backend-review-style-char-pj6t7i-654b9f7vc74z:/app/data
```

## How to delete previous scenarios ?

To delete all previous scenarios, get in the pod with:

```bash
kubectl -n NAMESPACE exec -it POD_NAME -- bash
```

Now run:

```bash
rm -Rf path/to/scenarios
```

:::danger
Recently, scenarios were located at `/app/data/scenarios` this may have changed, MAKE SURE YOU ARE DELETING ON THE RIGHT PATH
:::

## Ressrouces

- [Ronny explanation](https://gitlab.kuleuven.be/ae/sustainable-construction/dg-grow-eu-scenariotool/scenario-explorer/-/issues/17#note_286548)
