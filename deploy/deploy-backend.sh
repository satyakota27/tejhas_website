#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STACK_NAME="${STACK_NAME:-tejhas-website}"
AWS_REGION="${AWS_REGION:-ap-south-1}"

echo "Building and deploying backend (Lambda + API Gateway + S3 bucket)..."
cd "$SCRIPT_DIR"

if ! command -v sam &>/dev/null; then
  echo "Error: AWS SAM CLI is not installed. Install it: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
  exit 1
fi

sam build
sam deploy \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --capabilities CAPABILITY_IAM \
  --resolve-s3 \
  --no-confirm-changeset \
  --no-fail-on-empty-changeset

API_URL=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" --query "Stacks[0].Outputs[?OutputKey=='ContactApiUrl'].OutputValue" --output text)
WEBSITE_URL=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" --output text)
echo ""
echo "Backend deployed."
echo "  Contact API URL: ${API_URL}/send"
echo "  Website URL (use this exact address): $WEBSITE_URL"
echo ""
echo "Then run deploy-site.sh to build and upload the static site."
