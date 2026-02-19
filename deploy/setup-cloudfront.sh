#!/usr/bin/env bash
# Run all AWS steps for custom domain (tejhas.com + www) with HTTPS.
# You still add the CNAME and forwarding in GoDaddy manually (see CUSTOM_DOMAIN_HTTPS.md).
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AWS_REGION_CF="${AWS_REGION_CF:-us-east-1}"
S3_WEBSITE_ENDPOINT="${S3_WEBSITE_ENDPOINT:-tejhas-website.s3-website.ap-south-1.amazonaws.com}"

echo "=== 1. Request ACM certificate (us-east-1) for tejhas.com + www.tejhas.com ==="
CERT_ARN=$(aws acm request-certificate \
  --region "$AWS_REGION_CF" \
  --domain-name "tejhas.com" \
  --subject-alternative-names "www.tejhas.com" \
  --validation-method DNS \
  --query "CertificateArn" \
  --output text)
echo "Certificate ARN: $CERT_ARN"

echo ""
echo "=== Add these CNAMEs in GoDaddy (certificate validation). Then press Enter to continue. ==="
aws acm describe-certificate --certificate-arn "$CERT_ARN" --region "$AWS_REGION_CF" \
  --query "Certificate.DomainValidationOptions[*].ResourceRecord.{Name:Name,Value:Value}" \
  --output table
read -r

echo "Waiting for certificate to be validated (may take 5-30 min after you add the CNAMEs in GoDaddy)..."
aws acm wait certificate-validated --certificate-arn "$CERT_ARN" --region "$AWS_REGION_CF"
echo "Certificate issued."

echo ""
echo "=== 2. Create CloudFront distribution ==="
CONFIG_FILE="/tmp/tejhas-cf-config-$$.json"
sed -e "s|S3_WEBSITE_ENDPOINT|$S3_WEBSITE_ENDPOINT|g" -e "s|CERT_ARN|$CERT_ARN|g" "$SCRIPT_DIR/cloudfront-config.json" > "$CONFIG_FILE"
CF_DOMAIN=$(aws cloudfront create-distribution --distribution-config "file://$CONFIG_FILE" --query "Distribution.DomainName" --output text)
rm -f "$CONFIG_FILE"
echo "CloudFront domain: $CF_DOMAIN"

echo ""
echo "=== 3. In GoDaddy only ==="
echo "  - CNAME   www  ->  $CF_DOMAIN"
echo "  - Forward  tejhas.com  ->  https://www.tejhas.com  (301, forward only)"
echo "  - Do not change erp or other subdomains."
