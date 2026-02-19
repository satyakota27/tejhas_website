#!/usr/bin/env bash
# Validate ACM certificate status and DNS propagation for tejhas.com cert (us-east-1).
# Usage: ./validate-acm.sh [CERT_ARN]
# If CERT_ARN is omitted, uses the first issued cert for tejhas.com in us-east-1.
set -euo pipefail
AWS_REGION_CF="${AWS_REGION_CF:-us-east-1}"

if [[ -n "${1:-}" ]]; then
  CERT_ARN="$1"
else
  echo "Looking up ACM certificate for tejhas.com in us-east-1..."
  CERT_ARN=$(aws acm list-certificates --region "$AWS_REGION_CF" \
    --query "CertificateSummaryList[?DomainName=='tejhas.com' || DomainName=='www.tejhas.com'].CertificateArn" \
    --output text | head -1)
  if [[ -z "$CERT_ARN" ]]; then
    echo "No certificate found for tejhas.com. Pass CERT_ARN as first argument."
    exit 1
  fi
  echo "Using: $CERT_ARN"
fi

echo ""
echo "=== ACM certificate status ==="
aws acm describe-certificate --certificate-arn "$CERT_ARN" --region "$AWS_REGION_CF" \
  --query "Certificate.{Status:Status,DomainName:DomainName,SubjectAlternativeNames:SubjectAlternativeNames}" \
  --output table

STATUS=$(aws acm describe-certificate --certificate-arn "$CERT_ARN" --region "$AWS_REGION_CF" \
  --query "Certificate.Status" --output text)
if [[ "$STATUS" == "ISSUED" ]]; then
  echo "Result: Certificate is ISSUED — validation succeeded."
  exit 0
fi

echo ""
echo "=== Per-domain validation status ==="
aws acm describe-certificate --certificate-arn "$CERT_ARN" --region "$AWS_REGION_CF" \
  --query "Certificate.DomainValidationOptions[*].{Domain:DomainName,Status:ValidationStatus,Name:ResourceRecord.Name,Value:ResourceRecord.Value}" \
  --output table

echo ""
echo "=== DNS propagation check (CNAME resolution) ==="
aws acm describe-certificate --certificate-arn "$CERT_ARN" --region "$AWS_REGION_CF" \
  --query "Certificate.DomainValidationOptions[*].ResourceRecord.Name" --output text | tr '\t' '\n' | while read -r NAME; do
  [[ -z "$NAME" ]] && continue
  Q="${NAME%.}"   # strip trailing dot
  echo -n "  $Q -> "
  RESOLVED=$(dig +short CNAME "$Q" 2>/dev/null | head -1)
  if [[ -n "$RESOLVED" ]]; then
    echo "$RESOLVED"
    if [[ "$RESOLVED" == *"acm-validations.aws"* ]]; then
      echo "    OK (points to ACM)"
    else
      echo "    (unexpected target)"
    fi
  else
    echo "  (no CNAME record yet or not propagated)"
  fi
done

echo ""
if [[ "$STATUS" != "ISSUED" ]]; then
  echo "Certificate not yet ISSUED. Wait for DNS to propagate (up to 30 min) then run again."
  echo "Or wait in one go: aws acm wait certificate-validated --certificate-arn $CERT_ARN --region $AWS_REGION_CF"
fi
