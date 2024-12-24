# How to setup kubectl?

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
