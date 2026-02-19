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

# For production SEO: canonical URLs, sitemap.xml, robots.txt and Open Graph use this base URL (default: https://www.tejhas.com)
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://www.tejhas.com}"
echo "Building site with NEXT_PUBLIC_CONTACT_API_URL=$CONTACT_API_URL NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL"
cd "$WEBSITE_DIR"
NEXT_PUBLIC_CONTACT_API_URL="$CONTACT_API_URL" NEXT_PUBLIC_SITE_URL="$NEXT_PUBLIC_SITE_URL" npm run build

echo "Syncing out/ to s3://$BUCKET"
aws s3 sync out/ "s3://$BUCKET" --delete --region "$AWS_REGION"

# Ensure sitemap.xml and robots.txt are served with correct Content-Type (helps Google and other crawlers)
aws s3 cp "s3://$BUCKET/sitemap.xml" "s3://$BUCKET/sitemap.xml" --content-type "application/xml" --metadata-directive REPLACE --region "$AWS_REGION" 2>/dev/null || true
aws s3 cp "s3://$BUCKET/robots.txt" "s3://$BUCKET/robots.txt" --content-type "text/plain" --metadata-directive REPLACE --region "$AWS_REGION" 2>/dev/null || true

# Invalidate CloudFront cache so the new content is served (lookup by Comment first; override with CLOUDFRONT_DISTRIBUTION_ID if needed)
CF_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='Tejhas marketing site'].Id" --output text 2>/dev/null | head -1)
if [ -z "$CF_ID" ] && [ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]; then
  CF_ID="$CLOUDFRONT_DISTRIBUTION_ID"
fi
if [ -n "$CF_ID" ]; then
  echo "Invalidating CloudFront distribution $CF_ID (paths: /*)"
  aws cloudfront create-invalidation --distribution-id "$CF_ID" --paths "/*" --output text --query "Invalidation.Id"
  echo "CloudFront invalidation created. New content will be visible at your custom domain within a few minutes."
else
  echo "Tip: To refresh CloudFront after each deploy, set CLOUDFRONT_DISTRIBUTION_ID to your distribution ID, or run: aws cloudfront create-invalidation --distribution-id <ID> --paths '/*'"
fi

echo ""
echo "Site deployed to bucket: $BUCKET"
echo "Open your site at (use this exact URL): $WEBSITE_URL"
echo "Sitemap (for Google Search Console): https://www.tejhas.com/sitemap.xml"
