output "instance_ip" {
  description = "External IP address of the webapp VM"
  value       = google_compute_instance.webapp.network_interface[0].access_config[0].nat_ip
}

output "instance_name" {
  description = "Name of the created VM"
  value       = google_compute_instance.webapp.name
}

output "ssh_user" {
  description = "SSH user configured on the VM"
  value       = var.ssh_user
}
