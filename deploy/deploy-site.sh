#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEBSITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
STACK_NAME="${STACK_NAME:-tejhas-website}"
AWS_REGION="${AWS_REGION:-ap-south-1}"

# Get API URL and bucket from stack (deploy backend first)
BUCKET=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" --query "Stacks[0].Outputs[?OutputKey=='WebsiteBucketName'].OutputValue" --output text 2>/dev/null || true)
API_URL=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" --query "Stacks[0].Outputs[?OutputKey=='ContactApiUrl'].OutputValue" --output text 2>/dev/null || true)
WEBSITE_URL=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" --output text 2>/dev/null || true)

if [ -z "$BUCKET" ]; then
  echo "Error: Stack '$STACK_NAME' not found or has no WebsiteBucketName output. Run deploy-backend.sh first."
  exit 1
fi

if [ -n "$API_URL" ]; then
  CONTACT_API_URL="${NEXT_PUBLIC_CONTACT_API_URL:-${API_URL}/send}"
else
  CONTACT_API_URL="${NEXT_PUBLIC_CONTACT_API_URL:-}"
  if [ -z "$CONTACT_API_URL" ]; then
    echo "Warning: No API URL. Form will use mailto fallback. Set NEXT_PUBLIC_CONTACT_API_URL or run deploy-backend.sh first."
  fi
fi

echo "Building site with NEXT_PUBLIC_CONTACT_API_URL=$CONTACT_API_URL"
cd "$WEBSITE_DIR"
NEXT_PUBLIC_CONTACT_API_URL="$CONTACT_API_URL" npm run build

echo "Syncing out/ to s3://$BUCKET"
aws s3 sync out/ "s3://$BUCKET" --delete --region "$AWS_REGION"

echo ""
echo "Site deployed to bucket: $BUCKET"
echo "Open your site at (use this exact URL): $WEBSITE_URL"
