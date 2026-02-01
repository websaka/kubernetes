---
sidebar_position: 3
title: Instalasi Sistem Monitoring Prometheus dan Grafana dengan Node Exporter
---

<div class="kubernetes-category-card">
  <div class="kubernetes-category-header">
    <span class="kubernetes-icon">📊</span>
    <div>
      <h2 style={{color: 'white', margin: 0}}>Sistem Monitoring Prometheus & Grafana</h2>
      <span class="kubernetes-badge">Step-by-Step Guide</span>
    </div>
  </div>

  <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem'}}>
    Panduan lengkap instalasi sistem monitoring produksi menggunakan Prometheus untuk metrics collection 
    dan Grafana untuk visualisasi data. Setup Node Exporter untuk monitoring semua node di cluster.
  </p>

  <div class="kubernetes-prerequisites">
    <h4 style={{color: 'white', margin: 0}}>Prasyarat & Persiapan</h4>
    <ul>
      <li>1 server untuk Prometheus & Grafana</li>
      <li>Minimal 2 node untuk monitoring (master & worker)</li>
      <li>Ubuntu 20.04/22.04/24.04 LTS</li>
      <li>Akses root atau sudo</li>
      <li>Koneksi internet stabil</li>
    </ul>
  </div>

  <div class="kubernetes-features">
    <div class="kubernetes-feature-item">
      <h5 style={{color: 'white', margin: 0}}>Node Exporter</h5>
      <p style={{color: 'rgba(255,255,255,0.8)', margin: '0.5rem 0 0 0'}}>Install di setiap node untuk metrics collection</p>
    </div>
    <div class="kubernetes-feature-item">
      <h5 style={{color: 'white', margin: 0}}>Prometheus</h5>
      <p style={{color: 'rgba(255,255,255,0.8)', margin: '0.5rem 0 0 0'}}>Setup time-series database untuk metrics</p>
    </div>
    <div class="kubernetes-feature-item">
      <h5 style={{color: 'white', margin: 0}}>Grafana</h5>
      <p style={{color: 'rgba(255,255,255,0.8)', margin: '0.5rem 0 0 0'}}>Dashboard visualisasi yang powerful</p>
    </div>
    <div class="kubernetes-feature-item">
      <h5 style={{color: 'white', margin: 0}}>Remote Monitoring</h5>
      <p style={{color: 'rgba(255,255,255,0.8)', margin: '0.5rem 0 0 0'}}>Scrape metrics dari multiple nodes</p>
    </div>
  </div>
</div>

## Langkah 1 – Instalasi Node Exporter di Setiap Node (master & worker)

### Download Node Exporter

```bash
wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
tar xvfz node_exporter-1.7.0.linux-amd64.tar.gz
sudo cp node_exporter-1.7.0.linux-amd64/node_exporter /usr/local/bin/
```

### Buat Service Node Exporter

```bash
sudo tee /etc/systemd/system/node_exporter.service > /dev/null <<EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=nobody
ExecStart=/usr/local/bin/node_exporter
Restart=on-failure

[Install]
WantedBy=default.target
EOF
```

### Jalankan Service

```bash
sudo systemctl daemon-reexec
sudo systemctl enable --now node_exporter
```

### Verifikasi

```bash
curl http://localhost:9100/metrics
# atau via IP dari server monitoring nanti
```

## Langkah 2 – Instalasi Prometheus di Server Monitoring

### Buat User Prometheus

```bash
sudo useradd --no-create-home --shell /bin/false prometheus
```

### Download & Install Prometheus

```bash
wget https://github.com/prometheus/prometheus/releases/download/v2.52.0/prometheus-2.52.0.linux-amd64.tar.gz
tar xvf prometheus-2.52.0.linux-amd64.tar.gz
cd prometheus-2.52.0.linux-amd64

sudo cp prometheus promtool /usr/local/bin/
sudo mkdir -p /etc/prometheus /var/lib/prometheus
sudo cp -r consoles console_libraries /etc/prometheus/
```

## Langkah 3 – Konfigurasi Prometheus untuk Scrape Remote Nodes

### Edit File Konfigurasi

```bash
sudo nano /etc/prometheus/prometheus.yml
```

### Tambahkan Konfigurasi

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "kubernetes-nodes"
    static_configs:
      - targets: ["192.168.1.1:9100", "192.168.1.2:9100", "192.168.1.3:9100"]
```

## Langkah 4 – Jalankan Prometheus Sebagai Service

### Buat Service Prometheus

```bash
sudo nano /etc/systemd/system/prometheus.service
```

### Tambahkan Konfigurasi Service

```ini
[Unit]
Description=Prometheus Monitoring
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=multi-user.target
```

### Setup Permission & Jalankan

```bash
sudo chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus
sudo systemctl daemon-reexec
sudo systemctl enable --now prometheus
```

## Langkah 5 – Instalasi Grafana

### Setup Repository Grafana

```bash
# Buat folder keyring (jika belum ada)
sudo mkdir -p /etc/apt/keyrings

# Download dan simpan GPG key Grafana
curl -fsSL https://packages.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null

# Tambahkan repository Grafana dengan signed-by
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
```

### Install Grafana

```bash
sudo apt update
sudo apt install grafana -y
```

### Jalankan Grafana

```bash
sudo systemctl enable --now grafana-server
```

### Akses Grafana

Setelah ini, kamu bisa akses Grafana di:

```
http://<IP-SERVER>:3000
Login: admin / admin
```

## Konfigurasi Grafana

### Tambahkan Data Source Prometheus

1. Login ke Grafana (admin/admin)
2. Navigate ke Configuration → Data Sources
3. Click "Add data source"
4. Pilih "Prometheus"
5. Set URL: `http://localhost:9090`
6. Save & Test

### Import Dashboard

1. Navigate ke Dashboard → Import
2. Gunakan dashboard ID: 1860 (Node Exporter Full)
3. Pilih Prometheus sebagai data source
4. Import dashboard

## Verifikasi & Troubleshooting

### Cek Status Service

```bash
# Cek Node Exporter
sudo systemctl status node_exporter

# Cek Prometheus
sudo systemctl status prometheus

# Cek Grafana
sudo systemctl status grafana-server
```

### Cek Port Listening

```bash
# Node Exporter: 9100
netstat -tlnp | grep 9100

# Prometheus: 9090
netstat -tlnp | grep 9090

# Grafana: 3000
netstat -tlnp | grep 3000
```

### Log Files

```bash
# Node Exporter logs
journalctl -u node_exporter -f

# Prometheus logs
journalctl -u prometheus -f

# Grafana logs
journalctl -u grafana-server -f
```

## Firewall Configuration

### Buka Port yang Diperlukan

```bash
# Untuk Node Exporter
sudo ufw allow 9100/tcp

# Untuk Prometheus
sudo ufw allow 9090/tcp

# Untuk Grafana
sudo ufw allow 3000/tcp
```

## Next Steps

Setelah monitoring berhasil diinstal, Anda dapat:

- Monitor aplikasi dengan custom metrics
- Tambahkan dashboard custom untuk kebutuhan spesifik

---

<div class="kubernetes-next-steps">
  <h3 style={{color: '#326ce5'}}>📊 Monitoring Siap Digunakan!</h3>
  <p>
    Sistem monitoring Anda sekarang aktif dan siap untuk mengumpulkan metrics dari seluruh cluster. 
    Lanjutkan ke panduan alerting untuk setup notifikasi otomatis.
  </p>
</div>
