variable "project_id" { type = string }
variable "region"     { type = string }
variable "zone"       { type = string }

variable "credentials_file" {
  type    = string
  default = null
}

variable "name" {
  type    = string
  default = "newsportal-vm"
}

variable "machine_type" {
  type    = string
  default = "e2-medium"
}

variable "disk_gb" {
  type    = number
  default = 30
}

variable "image" {
  type    = string
  default = "ubuntu-os-cloud/ubuntu-2204-lts"
}

variable "ssh_user" { type = string }
variable "ssh_public_key" { type = string }

variable "ssh_private_key_path" { type = string }

variable "ssh_source_ranges" {
  type    = list(string)
  default = ["0.0.0.0/0"]
}

variable "web_source_ranges" {
  type    = list(string)
  default = ["0.0.0.0/0"]
}

variable "extra_tcp_ports" {
  type    = list(string)
  default = []
}

variable "custom_source_ranges" {
  type    = list(string)
  default = ["0.0.0.0/0"]
}

variable "service_account_email" {
  type    = string
  default = null
}

variable "repo_url" { type = string }
variable "repo_branch" { type = string }
