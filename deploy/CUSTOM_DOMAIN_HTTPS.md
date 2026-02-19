# Custom domain (tejhas.com) with HTTPS

This guide sets up **https://tejhas.com** (and **https://www.tejhas.com**) to point to your static website, using CloudFront and a certificate in AWS. It does **not** change **erp.tejhas.com**; you will only add or edit records for the root domain and `www`.

**Overview**

- DNS stays at **GoDaddy**.
- **CloudFront** serves the site over HTTPS and uses your S3 bucket as origin.
- **One ACM certificate** in **us-east-1** covers **both** tejhas.com and www.tejhas.com (required for CloudFront).
- **www.tejhas.com** → CNAME to CloudFront.
- **tejhas.com** (apex) → GoDaddy “Forwarding” to **https://www.tejhas.com** (so apex and www both work with HTTPS without touching `erp`).

---

## Prerequisites

- Backend and site already deployed (S3 bucket has the site; you have the S3 website URL).
- Access to **GoDaddy** DNS for tejhas.com (add/edit only records for `@` and `www`; leave `erp` and any other subdomains as they are).
- AWS CLI configured (for the command-line section below).

**Certificate note:** Your existing ACM certificate for **erp.tejhas.com** only covers that subdomain. CloudFront needs a certificate whose domain names include **tejhas.com** and **www.tejhas.com** for this site. So you either: (1) **Use a new certificate** that includes both tejhas.com and www.tejhas.com (steps below), or (2) **Use your existing cert** only if it already lists tejhas.com and/or www.tejhas.com (or is a wildcard `*.tejhas.com` — then it works for www but not for apex tejhas.com). If in doubt, request a new cert for the marketing site; it does not affect the erp cert.

---

## Step 1: Request one SSL certificate for both domains (us-east-1)

A **single certificate** covers both **tejhas.com** and **www.tejhas.com**. CloudFront only uses certificates from **us-east-1**, so create the cert there.

1. In **AWS Console**, switch region to **US East (N. Virginia) / us-east-1**.
2. Open **Certificate Manager (ACM)** → **Request certificate**.
3. Choose **Request a public certificate**.
4. Add **both** domain names to the same certificate:
   - **tejhas.com**
   - **www.tejhas.com**
5. Choose **DNS validation**.
6. Click **Request**.
7. On the certificate detail page, for each domain you’ll see a **CNAME name** and **CNAME value** (e.g. `_abc123.tejhas.com` → `_xyz.acm-validations.aws.`). Leave this tab open for Step 2.

Do **not** add **erp.tejhas.com** to this certificate; it’s only for the marketing site.

---

## Step 2: Validate the certificate in GoDaddy (DNS only)

You only add **validation** CNAMEs. These are for names like `_xxxxx.tejhas.com`. They do **not** affect **erp.tejhas.com**.

1. In **GoDaddy** → **My Products** → **Domains** → **tejhas.com** → **DNS** (or **Manage DNS**).
2. For **each** validation CNAME shown in ACM:
   - **Type**: CNAME  
   - **Name**: the part ACM gives (e.g. `_a1b2c3d4e5f6` — often “Name” is shown without the domain; enter exactly what ACM shows, or `_a1b2c3d4e5f6` if the full name is `_a1b2c3d4e5f6.tejhas.com`).  
   - **Value**: the target ACM gives (e.g. `_xyz.acm-validations.aws.`).  
   - **TTL**: 600 or default.
3. Save. Do **not** remove or change any existing record for **erp** (or other subdomains).
4. In ACM, wait until the certificate status is **Issued** (can take up to 30 minutes).

---

## Step 3: Create a CloudFront distribution

1. In **AWS Console**, stay in **us-east-1** (or switch to it).
2. Open **CloudFront** → **Create distribution**.
3. **Origin**:
   - **Origin domain**: choose the **S3 website endpoint** for your bucket, e.g.  
     `tejhas-website.s3-website.ap-south-1.amazonaws.com`  
     (do **not** pick the bucket from the dropdown that looks like `tejhas-website.s3.amazonaws.com`; pick the one that looks like `*.s3-website.ap-south-1.amazonaws.com`).
   - **Name**: e.g. `TejhasWebsite`.
   - **Protocol**: **HTTP only** (S3 website endpoints are HTTP).
   - Leave other origin settings as default.
4. **Default cache behavior**:
   - **Viewer protocol policy**: **Redirect HTTP to HTTPS**.
   - **Allowed HTTP methods**: GET, HEAD, OPTIONS.
   - **Cache policy**: e.g. **CachingOptimized** (or **SimpleCaching**).
5. **Settings**:
   - **Alternate domain names (CNAMEs)**:
     - `tejhas.com`
     - `www.tejhas.com`
   - **Custom SSL certificate**: select the **ACM certificate** you created in Step 1 (must be in us-east-1).
   - **Default root object**: `index.html`.
6. Create the distribution. Note the **Distribution domain name** (e.g. `d1234abcd.cloudfront.net`). You’ll use this in GoDaddy.

---

## Step 4: Point www to CloudFront in GoDaddy

1. In **GoDaddy** → **DNS** for **tejhas.com**.
2. **Add** or **edit** the **www** record (do not touch **erp** or other subdomains):
   - **Type**: CNAME  
   - **Name**: `www`  
   - **Value**: your CloudFront domain, e.g. `d1234abcd.cloudfront.net` (no `https://`, no trailing dot unless GoDaddy requires it).  
   - **TTL**: 600 or default.
3. Save. Wait a few minutes for DNS to propagate.

After propagation, **https://www.tejhas.com** should open your site over HTTPS.

---

## Step 5: Point apex (tejhas.com) to the site without disturbing erp

GoDaddy does not support CNAME on the apex (`tejhas.com`). The safe way to get **https://tejhas.com** without changing DNS for **erp.tejhas.com** is to use **domain forwarding** to **www**:

1. In **GoDaddy** → **Domains** → **tejhas.com** → **Additional Settings** (or **Forwarding**).
2. **Domain Forwarding** (or **Forwarding**):
   - **Forward to**: `https://www.tejhas.com`
   - **Forward type**: **Permanent (301)**.
   - **Settings**: “Forward only” (no masking), so the browser URL becomes `https://www.tejhas.com`.
3. Save.

Result:

- **https://tejhas.com** and **http://tejhas.com** → redirect to **https://www.tejhas.com** (your CloudFront site).
- **https://www.tejhas.com** → your site.
- **https://erp.tejhas.com** → unchanged (whatever A/CNAME you already have for `erp` stays as is).

---

## Summary of DNS at GoDaddy (what you touch)

| Record / feature | Action | Purpose |
|------------------|--------|---------|
| **CNAME** `_xxxxx` (from ACM) | Add | Certificate validation only |
| **CNAME** `www` → `dxxxx.cloudfront.net` | Add or edit | HTTPS site at www.tejhas.com |
| **Forwarding** `tejhas.com` → `https://www.tejhas.com` | Enable | Apex redirects to HTTPS www |
| **erp** (and any other subdomains) | **Do not change** | Keeps erp.tejhas.com as it is |

---

## All AWS steps from the command line

You can do every AWS step below with the CLI. **Only the GoDaddy DNS and forwarding steps** (at the end) need to be done in the GoDaddy UI.

**Quick option:** From `deploy/` run `./setup-cloudfront.sh`. It requests the cert, prints validation CNAMEs, waits for issuance, then creates the CloudFront distribution. Set `S3_WEBSITE_ENDPOINT` if your bucket/region differ. You still add the CNAMEs and www/apex settings in GoDaddy when prompted.

**Variables** (set these first; use your bucket and region):

```bash
export AWS_REGION_CF=us-east-1          # CloudFront and ACM must be us-east-1
export S3_WEBSITE_ENDPOINT="tejhas-website.s3-website.ap-south-1.amazonaws.com"   # your S3 website endpoint
export BUCKET_NAME=tejhas-website
```

### 1. Request ACM certificate (us-east-1)

```bash
aws acm request-certificate \
  --region "$AWS_REGION_CF" \
  --domain-name "tejhas.com" \
  --subject-alternative-names "www.tejhas.com" \
  --validation-method DNS \
  --output text
```

Copy the returned **CertificateArn**. Then get the DNS validation records (you will add these in GoDaddy):

```bash
export CERT_ARN="arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID"   # from above

aws acm describe-certificate --certificate-arn "$CERT_ARN" --region "$AWS_REGION_CF" \
  --query "Certificate.DomainValidationOptions[*].{Name:ResourceRecord.Name,Value:ResourceRecord.Value,Type:ResourceRecord.Type}" \
  --output table
```

**GoDaddy (manual):** For each row, add a **CNAME** record: **Name** = the left part (e.g. `_abc123.tejhas.com` → use `_abc123` if GoDaddy appends the domain), **Value** = the target. Do not change **erp** or any other records.

Wait until the certificate is issued (usually 5–30 minutes):

```bash
aws acm wait certificate-validated --certificate-arn "$CERT_ARN" --region "$AWS_REGION_CF"
# Or poll: aws acm describe-certificate --certificate-arn "$CERT_ARN" --region "$AWS_REGION_CF" --query "Certificate.Status"
```

### 2. Create CloudFront distribution

Use the template `deploy/cloudfront-config.json` (replace placeholders `CERT_ARN` and `S3_WEBSITE_ENDPOINT` with your values). CloudFront is global; the command is run without `--region`.

```json
{
  "CallerReference": "tejhas-website-1",
  "Comment": "Tejhas marketing site",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-TejhasWebsite",
        "DomainName": "S3_WEBSITE_ENDPOINT",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-TejhasWebsite",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"], "CachedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] } },
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "Aliases": { "Quantity": 2, "Items": ["tejhas.com", "www.tejhas.com"] },
  "ViewerCertificate": {
    "ACMCertificateArn": "CERT_ARN",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  }
}
```

Then create the distribution (use a small script to substitute variables):

```bash
cd "$(dirname "$0")"
CERT_ARN="arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID"   # your cert ARN
sed -e "s|S3_WEBSITE_ENDPOINT|$S3_WEBSITE_ENDPOINT|g" -e "s|CERT_ARN|$CERT_ARN|g" cloudfront-config.json > /tmp/cf-config.json
aws cloudfront create-distribution --distribution-config file:///tmp/cf-config.json
```

Or create the config inline (one-liner) with `jq`:

```bash
CERT_ARN="arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT-ID"
aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "tejhas-website-1",
  "Comment": "Tejhas marketing site",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-TejhasWebsite",
      "DomainName": "'"$S3_WEBSITE_ENDPOINT"'",
      "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "http-only"
      }
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-TejhasWebsite",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"], "CachedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] } },
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "Aliases": { "Quantity": 2, "Items": ["tejhas.com", "www.tejhas.com"] },
  "ViewerCertificate": {
    "ACMCertificateArn": "'"$CERT_ARN"'",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  }
}'
```

From the command output, note **Distribution.DomainName** (e.g. `d1234abcd.cloudfront.net`) and **Distribution.Id**.

### 3. GoDaddy only (you do these in the GoDaddy UI)

- **CNAME for certificate validation** (from step 1): Add each CNAME name/value from `describe-certificate` so the cert shows **Issued**.
- **CNAME for www**: Name = `www`, Value = your CloudFront domain (e.g. `d1234abcd.cloudfront.net`).
- **Forwarding for apex**: Forward `tejhas.com` to `https://www.tejhas.com` (301, forward only). Do not change **erp** or other subdomains.

After DNS propagates, **https://www.tejhas.com** and (after redirect) **https://tejhas.com** will serve the site over HTTPS.

### 4. Optional: Use an existing certificate

If you already have an ACM certificate in **us-east-1** that includes **www.tejhas.com** (and optionally **tejhas.com**), skip step 1 and use its ARN in step 2:

```bash
aws acm list-certificates --region us-east-1 --query "CertificateSummaryList[*].{Arn:CertificateArn,Domain:DomainName}" --output table
```

Use the **Arn** of the cert that covers www.tejhas.com (and tejhas.com if you want apex HTTPS) in the CloudFront `ViewerCertificate.ACMCertificateArn` in step 2.

---

## Optional: Serve https://tejhas.com on the apex (no redirect to www)

If you want **https://tejhas.com** to show the site directly (same content, no redirect to www), you need an **ALIAS/ANAME**-style record for the apex. GoDaddy does not support that for a CloudFront hostname. Two options:

1. **Move DNS to Route 53** (recommended): Create a hosted zone for **tejhas.com**, add the same ACM validation CNAMEs and the same **www** CNAME to CloudFront. For the apex, add an **A** record **Alias** to your CloudFront distribution. Then point the domain’s nameservers at GoDaddy to the Route 53 NS set. **erp.tejhas.com** stays as a record in Route 53 (you re-create the same A or CNAME you had in GoDaddy). No change to how erp works.
2. **Keep GoDaddy DNS**: Keep using forwarding from **tejhas.com** to **https://www.tejhas.com** (Step 5). No apex A/ALIAS, so erp and other subdomains are untouched.

---

## After changes

- **https://www.tejhas.com** and **https://tejhas.com** (after redirect) → your Tejhas marketing site with HTTPS.
- **https://erp.tejhas.com** → unchanged.
- Re-deploy the site with `./deploy-site.sh` as usual; CloudFront will serve new content after cache expiry or invalidation (you can create an invalidation for `/*` in the CloudFront console if needed).
