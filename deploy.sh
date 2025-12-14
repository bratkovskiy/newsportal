#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting deployment process..."

# 1. Initialize Terraform
echo "🔧 Initializing Terraform..."
cd infra/terraform/gcp
terraform init

# 2. Apply Terraform changes
echo "🚀 Applying Terraform configuration..."
terraform apply -auto-approve

# 3. Get the server IP from Terraform output
SERVER_IP=$(terraform output -raw server_ip)
echo "🌐 Server IP: $SERVER_IP"

# 4. Go back to project root
cd ../../..

# 5. Update Ansible inventory with the new IP
echo "📝 Updating Ansible inventory..."
cat > infra/ansible/inventory/prod.ini <<EOL
[web]
$SERVER_IP

[all:vars]
ansible_python_interpreter=/usr/bin/python3
ansible_user=root
EOL

# 6. Run Ansible playbook
echo "⚙️  Running Ansible playbook..."
ansible-playbook -i infra/ansible/inventory/prod.ini infra/ansible/site.yml -l web

echo "✅ Deployment completed successfully!"
echo "🌍 Your application should be available at: http://$SERVER_IP"
