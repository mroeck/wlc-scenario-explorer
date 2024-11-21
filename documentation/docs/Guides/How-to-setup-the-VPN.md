# How to setup the VPN?

### 1. **Install pulse secure**

For Arch linux users with [yay](https://github.com/Jguer/yay?tab=readme-ov-file#installation):

```bash
yay pulse-secure
```

Here is [the official arch documentation page to setup pulse secure](https://wiki.archlinux.org/title/Pulse_Connect_Secure)

Others: good luck

### 2. **Start the pulsesecure.service:**

```bash
systemctl start pulsesecure.service
```

### 3. **Execute a VPN connection to the B-zone:**

```bash
/opt/pulsesecure/bin/pulselauncher -U https://extranet.kuleuven.be/b -r b-realm -u u-nummer
```

They will ask you for the crendentials to connect to KU Leuven (same as https://account.kuleuven.be/login).

:::warning

the username should follow this format: u0123456 (emails don't work)

::::

### 4. **Gain full access to the KU Leuven network by navigating to:**

```
https://uafw.icts.kuleuven.be
```

The page should show: You now have a secure VPN connection to the KU Leuven network

### 5. **Verify you have access to the integration environment**

Browse to the integration address:

```bash
https://scenario-explorer-integration.ae-01.cloud.set.kuleuven.be
```

You should see the app running. Congratulations, you have a successfully setup the VPN!

### What if I want to connect to an other zone?

Replace [zone] with the zone name (a or b) in the following command to connect to the VPN:

```bash
/opt/pulsesecure/bin/pulselauncher -U https://extranet.kuleuven.be/[zone] -r [zone]-realm -u u-nummer
```

sources:

* [https://wiki.archlinux.org/title/Pulse_Connect_Secure](https://wiki.archlinux.org/title/Pulse_Connect_Secure)
* [https://admin.kuleuven.be/icts/services/vpn/pulse-secure-client-configuration-for-Linux](https://admin.kuleuven.be/icts/services/vpn/pulse-secure-client-configuration-for-Linux)
