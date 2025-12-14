terraform {
  required_version = ">= 1.6.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.30"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

resource "google_compute_instance" "webapp" {
  name         = var.instance_name
  machine_type = var.machine_type
  zone         = var.zone

  tags = concat(["webapp"], var.additional_tags)

  boot_disk {
    initialize_params {
      image = var.boot_image
      size  = var.boot_disk_size_gb
      type  = var.boot_disk_type
    }
  }

  network_interface {
    network = var.network

    access_config {
      // Ephemeral external IP
    }
  }

  metadata = {
    ssh-keys = "${var.ssh_user}:${var.ssh_public_key}"
  }

  metadata_startup_script = var.startup_script

  labels = merge({
    environment = var.environment
    role        = "webapp"
  }, var.extra_labels)

  # Wait for SSH to be ready before running Ansible
  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      host        = self.network_interface[0].access_config[0].nat_ip
      user        = var.ssh_user
      private_key = var.ssh_private_key
      timeout     = "5m"
    }

    inline = [
      "echo 'SSH connection established'",
      "sudo apt-get update"
    ]
  }

  # Run Ansible after VM is ready
  provisioner "local-exec" {
    command = <<-EOT
      cd ../../ansible
      ansible-playbook -i inventory/prod.ini site.yml \
        -e ansible_host=${self.network_interface[0].access_config[0].nat_ip} \
        -e ansible_user=${var.ssh_user} \
        -e ansible_ssh_private_key_file=${var.ssh_private_key_path} \
        --limit web
    EOT
  }
}

resource "google_compute_firewall" "vault_access" {
  name    = "vault-access"
  network = var.network
  
  allow {
    protocol = "tcp"
    ports    = ["8200"]
  }
  
  source_tags = ["webapp"]
  
  description = "Allow Vault access from webapp server"
}
