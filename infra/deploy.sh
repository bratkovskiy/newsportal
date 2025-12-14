#!/usr/bin/env bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directory setup
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
TERRAFORM_DIR="${ROOT_DIR}/infra/terraform/gcp"
ANSIBLE_DIR="${ROOT_DIR}/infra/ansible"

# Configuration
ENV_FILE="${ROOT_DIR}/.env.local"
KEY_PATH="${ANSIBLE_SSH_KEY:-$HOME/.ssh/id_ed25519}"

# Load environment variables
if [[ -f "${ENV_FILE}" ]]; then
  echo -e "${YELLOW}Loading environment from ${ENV_FILE}${NC}"
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

# Required variables check
: "${GCP_PROJECT_ID:?Set GCP_PROJECT_ID before running (export or put in .env.local)}"
: "${SSH_PUBLIC_KEY:?Set SSH_PUBLIC_KEY before running (export or put in .env.local)}"
: "${SSH_PRIVATE_KEY_PATH:?Set SSH_PRIVATE_KEY_PATH before running (export or put in .env.local)}"

# Function to print colored output
print_step() {
  echo -e "${GREEN}=== $1 ===${NC}"
}

print_error() {
  echo -e "${RED}ERROR: $1${NC}"
}

# Step 1: Terraform
print_step "Step 1: Creating infrastructure with Terraform"
cd "${TERRAFORM_DIR}"

# Terraform variables file logic
TF_VARS_IN_DIR="${TERRAFORM_DIR}/terraform.tfvars"
TF_VARS_PARENT="${ROOT_DIR}/infra/terraform/terraform.tfvars"
if [[ -f "${TF_VARS_IN_DIR}" ]]; then
  TF_VARS_ARG=(-var-file="${TF_VARS_IN_DIR}")
elif [[ -f "${TF_VARS_PARENT}" ]]; then
  TF_VARS_ARG=(-var-file="${TF_VARS_PARENT}")
else
  TF_VARS_ARG=()
fi

# Initialize Terraform
echo "Initializing Terraform..."
terraform init -input=false

# Apply Terraform
echo "Applying Terraform changes..."
terraform apply -auto-approve "${TF_VARS_ARG[@]}"

# Get outputs from Terraform
INSTANCE_IP=$(terraform output -raw instance_ip)
INSTANCE_NAME=$(terraform output -raw instance_name)
SSH_USER=$(terraform output -raw ssh_user)

echo "Created VM: ${INSTANCE_NAME} with IP: ${INSTANCE_IP}"

# Step 2: Wait for SSH to be available
print_step "Step 2: Waiting for SSH to be available"
cd "${ROOT_DIR}"

echo "Testing SSH connection to ${INSTANCE_IP}..."
for i in {1..30}; do
  if ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -i "${SSH_PRIVATE_KEY_PATH}" "${SSH_USER}@${INSTANCE_IP}" "echo 'SSH ready'" 2>/dev/null; then
    echo "SSH connection established!"
    break
  fi
  echo "Attempt $i/30: SSH not ready, waiting 10 seconds..."
  sleep 10
done

if [[ $i -eq 30 ]]; then
  print_error "SSH connection failed after 30 attempts"
  exit 1
fi

# Step 3: Ansible
print_step "Step 3: Configuring server with Ansible"
cd "${ANSIBLE_DIR}"

# Create/update inventory with new server IP
echo "Updating inventory with new server IP..."
cat > inventory/prod.ini << EOF
[web]
webapp ansible_host=${INSTANCE_IP} ansible_user=${SSH_USER} ansible_ssh_private_key_file=${SSH_PRIVATE_KEY_PATH}
EOF

# Ensure SSH key is available for Ansible
EVAL_RESULT="$(ssh-agent -s)"
eval "${EVAL_RESULT}" >/dev/null
trap 'ssh-agent -k >/dev/null' EXIT
ssh-add -q "${SSH_PRIVATE_KEY_PATH}"

# Install Ansible collections if needed
echo "Installing Ansible collections..."
ansible-galaxy collection install community.hashi_vault >/dev/null 2>&1 || true

# Run Ansible playbook
echo "Running Ansible playbook..."
if ansible-playbook -i inventory/prod.ini site.yml --limit web; then
  print_step "Deployment completed successfully!"
  echo ""
  echo "Server details:"
  echo "  IP: ${INSTANCE_IP}"
  echo "  User: ${SSH_USER}"
  echo "  Name: ${INSTANCE_NAME}"
  echo ""
  echo "To connect: ssh -i ${SSH_PRIVATE_KEY_PATH} ${SSH_USER}@${INSTANCE_IP}"
  echo "To check services: ssh -i ${SSH_PRIVATE_KEY_PATH} ${SSH_USER}@${INSTANCE_IP} 'docker compose ps'"
else
  print_error "Ansible playbook failed"
  exit 1
fi

# Cleanup
echo ""
echo "To destroy infrastructure later, run: terraform destroy -auto-approve \"${TF_VARS_ARG[@]}\""
