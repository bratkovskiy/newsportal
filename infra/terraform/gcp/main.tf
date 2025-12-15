
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
  credentials = var.credentials_file != null ? file(var.credentials_file) : null
}

locals {
  network_name = "${var.name}-net"
  subnet_name  = "${var.name}-subnet"
  ip_name      = "${var.name}-ip"
  tag          = "${var.name}-tag"
}

resource "google_compute_network" "this" {
  name                    = local.network_name
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "this" {
  name          = local.subnet_name
  ip_cidr_range = "10.10.0.0/24"
  region        = var.region
  network       = google_compute_network.this.id
}

resource "google_compute_address" "this" {
  name   = local.ip_name
  region = var.region
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "${var.name}-allow-ssh"
  network = google_compute_network.this.name

  direction     = "INGRESS"
  source_ranges = var.ssh_source_ranges
  target_tags   = [local.tag]

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
}

resource "google_compute_firewall" "allow_web" {
  name    = "${var.name}-allow-web"
  network = google_compute_network.this.name

  direction     = "INGRESS"
  source_ranges = var.web_source_ranges
  target_tags   = [local.tag]

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }
}

resource "google_compute_firewall" "allow_extra_tcp" {
  count   = length(var.extra_tcp_ports) > 0 ? 1 : 0
  name    = "${var.name}-allow-extra-tcp"
  network = google_compute_network.this.name

  direction     = "INGRESS"
  source_ranges = var.custom_source_ranges
  target_tags   = [local.tag]

  allow {
    protocol = "tcp"
    ports    = var.extra_tcp_ports
  }
}

resource "google_compute_instance" "this" {
  name         = var.name
  machine_type = var.machine_type
  zone         = var.zone

  tags = [local.tag]

  boot_disk {
    initialize_params {
      image = var.image
      size  = var.disk_gb
      type  = "pd-balanced"
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.this.id
    access_config {
      nat_ip = google_compute_address.this.address
    }
  }

  metadata = {
    "ssh-keys" = "${var.ssh_user}:${var.ssh_public_key}"
  }

  dynamic "service_account" {
    for_each = var.service_account_email == null ? [] : [1]
    content {
      email  = var.service_account_email
      scopes = ["https://www.googleapis.com/auth/cloud-platform"]
    }
  }
}
