#!/usr/bin/env bash
# Check what DNS resolves for tejhas.com and www.tejhas.com.
# Run from deploy/ or pass CLOUDFRONT_DOMAIN to verify www points to CloudFront.
set -euo pipefail
echo "=== DNS check for tejhas.com and www.tejhas.com ==="
echo ""

echo "1. Apex (tejhas.com)"
echo "   A:   $(dig +short A tejhas.com 2>/dev/null || echo 'none')"
echo "   AAAA: $(dig +short AAAA tejhas.com 2>/dev/null || echo 'none')"
echo ""

echo "2. www.tejhas.com"
echo "   CNAME: $(dig +short CNAME www.tejhas.com 2>/dev/null || echo 'none')"
echo "   A:     $(dig +short A www.tejhas.com 2>/dev/null || echo 'none')"
echo ""

if [[ -n "${CLOUDFRONT_DOMAIN:-}" ]]; then
  echo "3. Expected: www should CNAME to $CLOUDFRONT_DOMAIN"
  CURRENT=$(dig +short CNAME www.tejhas.com 2>/dev/null | head -1)
  if [[ "$CURRENT" == *"$CLOUDFRONT_DOMAIN"* ]]; then
    echo "   OK — www points to CloudFront"
  else
    echo "   Not yet — add CNAME www -> $CLOUDFRONT_DOMAIN in GoDaddy"
  fi
fi

echo ""
echo "If you see 'none' or empty: add the missing record in GoDaddy."
echo "  - www: add CNAME  www  ->  <your-cloudfront-domain>.cloudfront.net"
echo "  - apex: use GoDaddy Forwarding  tejhas.com  ->  https://www.tejhas.com  (do not remove A record unless forwarding is on)"
