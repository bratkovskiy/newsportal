#!/bin/bash
set -euo pipefail

echo "🚀 Starting deployment process..."

echo "🔧 Initializing Terraform..."
terraform -chdir=infra/terraform/gcp init -reconfigure -input=false

echo "🚀 Applying Terraform configuration..."
terraform -chdir=infra/terraform/gcp apply -auto-approve -input=false

SERVER_IP=$(terraform -chdir=infra/terraform/gcp output -raw vm_ip)
echo "🌐 Server IP: $SERVER_IP"

if [ -f infra/ansible/site.yml ]; then
  echo "📝 Updating Ansible inventory..."
  mkdir -p infra/ansible
  cat > infra/ansible/inventory.ini <<EOL
[web]
newsportal ansible_host=$SERVER_IP ansible_user=deploy
EOL

  echo "⚙️  Running Ansible playbook..."
  ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i infra/ansible/inventory.ini infra/ansible/site.yml
else
  echo "⚠️  infra/ansible/site.yml not found. Terraform finished, skipping Ansible."
fi

echo "✅ Deployment completed successfully!"
echo "🌍 Your application should be available at: http://$SERVER_IP"
