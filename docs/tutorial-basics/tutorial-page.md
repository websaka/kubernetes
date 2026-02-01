---
sidebar_position: 2
title: Instalasi Kubernetes Cluster di Ubuntu Server 24.04 dengan CRI-O
---

<div class="kubernetes-category-card">
  <div class="kubernetes-category-header">
    <span class="kubernetes-icon">🛠️</span>
    <div>
      <h2 style={{color: 'white', margin: 0}}>Instalasi Kubernetes Cluster</h2>
      <span class="kubernetes-badge">Step-by-Step Guide</span>
    </div>
  </div>

  <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem'}}>
    Panduan lengkap instalasi Kubernetes Cluster produksi di Ubuntu Server 24.04 dengan CRI-O sebagai container runtime. 
    Ikuti langkah demi langkah untuk membangun cluster yang stabil dan siap produksi.
  </p>

  <div class="kubernetes-prerequisites">
    <h4 style={{color: 'white', margin: 0}}>Prasyarat & Persiapan</h4>
    <ul>
      <li>3 server/VM Ubuntu 24.04 LTS</li>
      <li>Koneksi internet stabil</li>
      <li>Akses root atau sudo</li>
      <li>Firewall dikonfigurasi</li>
    </ul>
  </div>

  <div class="kubernetes-features">
    <div class="kubernetes-feature-item">
      <h5 style={{color: 'white', margin: 0}}>CRI-O Setup</h5>
      <p style={{color: 'rgba(255,255,255,0.8)', margin: '0.5rem 0 0 0'}}>Install container runtime ringan dan aman</p>
    </div>
    <div class="kubernetes-feature-item">
      <h5 style={{color: 'white', margin: 0}}>Master Node</h5>
      <p style={{color: 'rgba(255,255,255,0.8)', margin: '0.5rem 0 0 0'}}>Konfigurasi kontrol plane cluster</p>
    </div>
    <div class="kubernetes-feature-item">
      <h5 style={{color: 'white', margin: 0}}>Worker Nodes</h5>
      <p style={{color: 'rgba(255,255,255,0.8)', margin: '0.5rem 0 0 0'}}>Setup node untuk workload aplikasi</p>
    </div>
    <div class="kubernetes-feature-item">
      <h5 style={{color: 'white', margin: 0}}>Network Plugin</h5>
      <p style={{color: 'rgba(255,255,255,0.8)', margin: '0.5rem 0 0 0'}}>Konfigurasi jaringan cluster dengan Calico</p>
    </div>
  </div>
</div>

## Langkah 1: Persiapan Sistem

### Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### Disable Swap

```bash
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

### Load Kernel Modules

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter
```

### Configure Sysctl

```bash
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

sudo sysctl --system
```

## Langkah 2: Install CRI-O Container Runtime

### Add CRI-O Repository

```bash
OS="xUbuntu_24.04"
VERSION="1.28"

echo "deb [signed-by=/usr/share/keyrings/libcontainers-archive-keyring.gpg] https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /" | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list

echo "deb [signed-by=/usr/share/keyrings/libcontainers-crio-archive-keyring.gpg] https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /" | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list
```

### Install CRI-O

```bash
sudo apt update
sudo apt install cri-o cri-o-runc cri-tools -y
```

### Start CRI-O Service

```bash
sudo systemctl enable crio
sudo systemctl start crio
sudo systemctl status crio
```

## Langkah 3: Install Kubernetes Components

### Add Kubernetes Repository

```bash
sudo curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.28/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.28/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

### Install Packages

```bash
sudo apt update
sudo apt install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

### Verify Installation

```bash
kubectl version --client
kubeadm version
```

## Langkah 4: Initialize Master Node

### Initialize Cluster

```bash
sudo kubeadm init --pod-network-cidr=192.168.0.0/16
```

### Configure kubectl

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### Install Calico Network Plugin

```bash
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/tigera-operator.yaml
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/custom-resources.yaml
```

### Verify Cluster

```bash
kubectl get nodes
kubectl get pods -n kube-system
```

## Langkah 5: Join Worker Nodes

### Get Join Command

On master node:

```bash
kubeadm token create --print-join-command
```

### Join Worker Nodes

On each worker node:

```bash
sudo kubeadm join [MASTER_IP]:6443 --token [TOKEN] --discovery-token-ca-cert-hash sha256:[HASH]
```

## Langkah 6: Verifikasi Cluster

### Check Node Status

```bash
kubectl get nodes -o wide
```

### Deploy Test Application

```bash
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=LoadBalancer
kubectl get pods,svc
```

### Clean Up

```bash
kubectl delete deployment nginx
kubectl delete service nginx
```

## Troubleshooting

### Common Issues

- **CRI-O not starting**: Check logs with `journalctl -u crio`
- **Node NotReady**: Verify network connectivity and firewall rules
- **Pod stuck in Pending**: Check resource availability and network plugin status

### Useful Commands

```bash
# Check cluster status
kubectl cluster-info
kubectl get componentstatuses

# Check node details
kubectl describe node [NODE_NAME]

# Check pod logs
kubectl logs [POD_NAME] -n [NAMESPACE]
```

## Next Steps

Setelah cluster berhasil diinstal, Anda dapat:

- Setup monitoring dengan Prometheus dan Grafana

---

<div class="kubernetes-next-steps">
  <h3 style={{color: '#326ce5'}}>🚀 Siap untuk Production!</h3>
  <p>
    Cluster Kubernetes Anda sekarang siap untuk menjalankan workload produksi. 
    Lanjutkan ke panduan deployment untuk mempelajari cara men-deploy aplikasi Anda.
  </p>
</div>
