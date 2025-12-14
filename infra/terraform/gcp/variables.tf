variable "project_id" {
  description = "GCP project where the VM will be created"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "europe-west3"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "europe-west3-c"
}

variable "instance_name" {
  description = "Name of the compute instance"
  type        = string
  default     = "webapp-vm"
}

variable "machine_type" {
  description = "GCE machine type"
  type        = string
  default     = "e2-standard-2"
}

variable "boot_image" {
  description = "Image used for the boot disk"
  type        = string
  default     = "ubuntu-os-cloud/ubuntu-2204-lts"
}

variable "boot_disk_size_gb" {
  description = "Boot disk size in GB"
  type        = number
  default     = 40
}

variable "boot_disk_type" {
  description = "Boot disk type (pd-standard, pd-ssd, etc.)"
  type        = string
  default     = "pd-balanced"
}

variable "network" {
  description = "VPC network name (default for default network)"
  type        = string
  default     = "default"
}

variable "ssh_user" {
  description = "Linux user to authorize with provided SSH key"
  type        = string
  default     = "deploy"
}

variable "ssh_public_key" {
  description = "Contents of the SSH public key to add to authorized_keys"
  type        = string
}

variable "ssh_private_key" {
  description = "SSH private key content for connection"
  type        = string
  sensitive   = true
}

variable "ssh_private_key_path" {
  description = "Path to SSH private key file"
  type        = string
}

variable "startup_script" {
  description = "Optional startup script executed on VM boot"
  type        = string
  default     = ""
}

variable "environment" {
  description = "Environment label (prod/stage/dev)"
  type        = string
  default     = "prod"
}

variable "additional_tags" {
  description = "Extra network tags"
  type        = list(string)
  default     = []
}

variable "extra_labels" {
  description = "Extra labels to attach to the VM"
  type        = map(string)
  default     = {}
}
