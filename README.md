# Tejhas – ERP for MSMEs

Marketing website for Tejhas MRP and CRM Software. Dark mode, static export, deployable to AWS S3 (and Netlify, GoDaddy).

## Setup

```bash
npm install
```

## Contact form (AWS SES)

The contact form sends submissions to **sales@tejhas.com** via an API (Lambda + API Gateway) that uses AWS SES.

- **With backend deployed:** Set `NEXT_PUBLIC_CONTACT_API_URL` at **build time** to your API Gateway URL plus `/send` (e.g. `https://xxxxx.execute-api.us-east-1.amazonaws.com/prod/send`). The deploy script sets this from the CloudFormation stack output.
- **Without backend:** The form falls back to opening a `mailto:sales@tejhas.com` link so users can still send their message from their email client.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build (static export)

```bash
npm run build
```

Output is in the `out/` directory. For production, set `NEXT_PUBLIC_CONTACT_API_URL` so the form posts to your API:

```bash
NEXT_PUBLIC_CONTACT_API_URL=https://your-api-id.execute-api.region.amazonaws.com/prod/send npm run build
```

## Deployment (AWS S3 + Lambda + SES)

Backend (Lambda, API Gateway, S3 bucket) and frontend deploy are in the `deploy/` folder.

**Prerequisites**

- AWS CLI configured with credentials
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) installed
- SES: the sender **support@tejhas.com** is configured in the template (must be verified in SES). Deployment defaults to **ap-south-1** (Mumbai) where SES is used.

**1. Deploy backend (once)**

```bash
cd deploy
./deploy-backend.sh
```

This runs `sam build` and `sam deploy`, creating the Lambda, API Gateway (POST `/send`), and S3 bucket. Override parameters if needed (e.g. a unique bucket name):

```bash
sam deploy ... --parameter-overrides WebsiteBucketName=tejhas-website-yourcompany FromEmail=noreply@tejhas.com
```

**2. Deploy site**

```bash
./deploy-site.sh
```

This builds the Next.js site with the API URL from the stack, then syncs `out/` to the S3 bucket. The script reads the API URL from CloudFormation outputs.

**Optional:** Set `STACK_NAME` or `AWS_REGION` before running (default region is `ap-south-1` for SES):

```bash
export STACK_NAME=tejhas-website
export AWS_REGION=ap-south-1
./deploy-backend.sh
./deploy-site.sh
```

After deployment, use the **exact** website URL printed by the deploy scripts (or from the stack output **WebsiteURL** in the AWS Console). For ap-south-1 the correct format is `http://<bucket>.s3-website.ap-south-1.amazonaws.com` (dot between `s3-website` and the region, not a hyphen).

**Custom domain (tejhas.com) with HTTPS:** See **[deploy/CUSTOM_DOMAIN_HTTPS.md](deploy/CUSTOM_DOMAIN_HTTPS.md)** for step-by-step instructions to point https://tejhas.com (and www) to this site via CloudFront and GoDaddy DNS, without changing erp.tejhas.com.

## Logo

The Tejhas logo is in `public/logo.png`. Replace it with your own asset if needed.
