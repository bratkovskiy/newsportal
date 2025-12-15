
output "vm_ip" {
  value = google_compute_address.this.address
}

output "vm_name" {
  value = google_compute_instance.this.name
}
