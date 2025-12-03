# GitHub Enterprise FAQ & Compliance Guide for Zyeuté

> **For:** Solo developers, early-stage teams, and small organizations in Quebec  
> **Updated:** December 3, 2025  
> **Purpose:** Onboarding, support tickets, regulatory audits, and compliance

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
3. [Canada Data Residency](#canada-data-residency)
4. [Self-Hosted GPU Runner Setup](#self-hosted-gpu-runner-setup)
5. [GitHub Actions Usage](#github-actions-usage)
6. [GitHub Enterprise Server](#github-enterprise-server)
7. [Migration Support](#migration-support)
8. [Law 25 Compliance](#law-25-compliance-quebec-privacy-law)
9. [Audit & Logging Guidance](#audit--logging-guidance)
10. [Next Steps Checklist](#next-steps-checklist)
11. [Resources & Links](#resources--links)

---

## Overview

This guide helps **Zyeuté** and other Quebec-based projects understand GitHub Enterprise features, comply with **Quebec Law 25** (privacy legislation), ensure **Canada data residency**, and leverage advanced DevOps capabilities like self-hosted GPU runners for AI workloads.

**Key Focus Areas:**
- ✅ Privacy and data sovereignty for Quebec organizations
- ✅ Cost-effective solutions for small teams and solo developers
- ✅ Practical setup guidance for AI/ML workloads (Ti-Guy, DALL-E, GPT-4)
- ✅ Compliance documentation for audits and support tickets
- ✅ Scalable architecture from prototype to production

---

## Frequently Asked Questions (FAQ)

### General Questions

#### Q1: What is GitHub Enterprise, and do I need it?

**Answer:**  
GitHub Enterprise includes **GitHub Enterprise Cloud** (SaaS) and **GitHub Enterprise Server** (self-hosted). It provides:
- Advanced security features (CodeQL, secret scanning, Dependabot)
- Centralized billing and user management
- Audit logs and compliance tools
- Premium support and SLAs
- SAML/SSO integration

**For Zyeuté (solo/early-stage):**
- **Start with:** GitHub Teams or Pro (most features, lower cost)
- **Upgrade to Enterprise when:** You need SSO, audit log streaming, or regional data hosting

#### Q2: How much does GitHub Enterprise cost?

**Answer:**  
- **GitHub Enterprise Cloud:** $21 USD/user/month (annual billing)
- **GitHub Enterprise Server:** $21 USD/user/month + infrastructure costs
- **GitHub Copilot Enterprise:** Additional $39 USD/user/month

**Small Team Tip:**  
For 1-5 developers, GitHub Teams ($4/user/month) + GitHub Copilot Individual ($10/user/month) is more cost-effective unless you need enterprise-specific compliance features.

#### Q3: Can I use GitHub Actions for free with Enterprise?

**Answer:**  
- **Public repos:** Unlimited GitHub Actions minutes (free)
- **Private repos:** 50,000 minutes/month included with Enterprise Cloud
- **Self-hosted runners:** Free compute (you pay for infrastructure)

**For Zyeuté:** Use self-hosted runners for AI workloads (GPU-intensive) to save costs.

#### Q4: What's the difference between Enterprise Cloud and Enterprise Server?

**Answer:**

| Feature | Enterprise Cloud | Enterprise Server |
|---------|------------------|-------------------|
| **Hosting** | GitHub SaaS | Self-hosted on your infrastructure |
| **Data Location** | GitHub's data centers (regional options) | Your servers (full control) |
| **Maintenance** | Managed by GitHub | You manage updates/backups |
| **Cost** | Lower (no infrastructure) | Higher (requires servers) |
| **Best For** | Most teams, startups | High security/compliance needs |

**For Zyeuté:** Start with **Enterprise Cloud** unless you have strict on-premises requirements.

---

### Quebec & Canada-Specific Questions

#### Q5: Does GitHub Enterprise support Canada data residency?

**Answer:**  
**Partially.** GitHub Enterprise Cloud does not guarantee Canadian data residency for all services:
- **Code repositories:** Stored in GitHub's global infrastructure (primarily US)
- **GitHub Actions logs:** Stored in US regions
- **Audit logs:** Can be exported and stored in Canada

**Compliance Strategy for Law 25:**
1. **Use Enterprise Cloud for code** (acceptable under Law 25 if data is adequately protected)
2. **Export audit logs** to Canadian storage (S3 Canada, Azure Canada)
3. **Self-host sensitive data** (e.g., user PII in Supabase Canada region)
4. **Document data flows** for regulatory audits

**Full Canadian Data Residency:** Use **GitHub Enterprise Server** hosted in Canada (AWS ca-central-1, Azure Canada Central, or on-premises).

#### Q6: What is Quebec Law 25, and how does it affect GitHub usage?

**Answer:**  
**Law 25** (Bill 64) is Quebec's privacy law, similar to GDPR. Key requirements:
- **Consent:** Explicit user consent for data collection
- **Data protection:** Adequate safeguards for personal information
- **Breach notification:** Report breaches within 72 hours
- **Data residency:** Preferential storage in Canada (not strictly required but recommended)

**GitHub Enterprise Compliance:**
- ✅ **Audit logs:** Track all access to user data
- ✅ **Encryption:** Data encrypted in transit (TLS) and at rest
- ✅ **Access controls:** RBAC, SSO, 2FA enforcement
- ✅ **Data processing agreements:** GitHub provides DPAs for Enterprise customers

**Action Item:** Document your data flows and include GitHub in your **Data Protection Impact Assessment (DPIA)**.

#### Q7: Can I host GitHub Enterprise Server in Canada?

**Answer:**  
**Yes!** Deploy GitHub Enterprise Server on:
- **AWS Canada (ca-central-1):** Montreal region
- **Azure Canada Central:** Toronto region
- **Google Cloud North America (northamerica-northeast1):** Montreal
- **On-premises:** Your own data center in Quebec

**Estimated Costs (AWS ca-central-1):**
- **EC2 instance:** r5.2xlarge (~$500 CAD/month)
- **Storage:** 500GB EBS (~$60 CAD/month)
- **Backup:** S3 + snapshots (~$50 CAD/month)
- **Total:** ~$600-700 CAD/month for small team

**Recommendation:** Start with Enterprise Cloud, migrate to Server if Law 25 audits require Canadian hosting.

---

### AI/ML and GPU Workloads

#### Q8: How do I set up self-hosted GPU runners for AI workloads?

**Answer:**  
Self-hosted runners with GPUs are essential for Zyeuté's AI features:
- **Ti-Guy Artiste** (DALL-E 3 via OpenAI API)
- **Ti-Guy Studio** (video processing)
- **Ti-Guy Assistant** (GPT-4 inference)

**See detailed setup in:** [Self-Hosted GPU Runner Setup](#self-hosted-gpu-runner-setup) section below.

#### Q9: Can GitHub Actions run AI/ML workflows?

**Answer:**  
**Yes!** GitHub Actions supports:
- **Docker containers:** Run TensorFlow, PyTorch, JAX
- **Self-hosted runners:** Connect GPUs for training/inference
- **Secrets management:** Store OpenAI API keys securely
- **Artifact storage:** Save model weights, datasets

**Example workflow for Zyeuté:**
```yaml
name: Train Ti-Guy Model
on: [push]
jobs:
  train:
    runs-on: self-hosted-gpu
    steps:
      - uses: actions/checkout@v4
      - name: Train model
        run: python train_tiguy.py
      - name: Upload model
        uses: actions/upload-artifact@v4
        with:
          name: tiguy-model
          path: models/
```

---

### Compliance & Auditing

#### Q10: How do I export audit logs for Law 25 compliance?

**Answer:**  
GitHub Enterprise provides comprehensive audit logs:

**Methods:**
1. **Web UI:** Organization Settings > Audit log (manual export)
2. **API:** `GET /orgs/{org}/audit-log` (automated exports)
3. **Streaming:** Real-time streaming to SIEM (Splunk, Datadog, S3)

**Compliance Workflow:**
1. Enable audit log streaming to **AWS S3 (Canada)**
2. Retain logs for **minimum 3 years** (Law 25 requirement)
3. Review logs **quarterly** for unauthorized access
4. Document findings in compliance reports

**See:** [Audit & Logging Guidance](#audit--logging-guidance) section below.

#### Q11: Do I need a Data Protection Impact Assessment (DPIA) for GitHub?

**Answer:**  
**Likely yes** if Zyeuté processes Quebec residents' personal information. GitHub is a "data processor" under Law 25.

**DPIA Checklist for GitHub:**
- [ ] Document what data is stored in GitHub (code, issues, comments)
- [ ] Identify personal information (e.g., user emails, names in commits)
- [ ] Assess risks (unauthorized access, data breaches)
- [ ] Implement safeguards (2FA, branch protection, secret scanning)
- [ ] Review GitHub's DPA and Terms of Service
- [ ] Document data retention policies

**Template:** Use Quebec's CNIL DPIA template adapted for software development.

---

### Small Team & Solo Developer Questions

#### Q12: I'm a solo developer. Is GitHub Enterprise worth it?

**Answer:**  
**Probably not yet.** For solo developers:
- **Use:** GitHub Pro ($4/month) + Copilot Individual ($10/month)
- **Upgrade when:** You hire employees, need SSO, or face audit requirements

**GitHub Pro includes:**
- Unlimited private repos
- Advanced code review tools
- GitHub Actions (3,000 minutes/month)
- GitHub Pages

**For Zyeuté's current stage:** GitHub Pro is sufficient. Plan for Enterprise when scaling to 5+ team members or seeking enterprise customers.

#### Q13: How do I scale from GitHub Free/Pro to Enterprise?

**Answer:**  
**Migration Path:**
1. **GitHub Free/Pro** (current): Perfect for prototyping and MVPs
2. **GitHub Teams** (5-10 users): Add SAML, required reviewers, CODEOWNERS
3. **GitHub Enterprise** (10+ users or compliance needs): Full audit logs, advanced security, regional hosting

**No disruption:** Upgrading preserves all repos, issues, and settings. Billing changes take effect immediately.

**Zyeuté Timeline:**
- **Now (2025):** GitHub Pro
- **Q2 2026:** GitHub Teams (when hiring first employees)
- **2027:** GitHub Enterprise (if Law 25 audits require it)

#### Q14: Can I use GitHub Copilot with my own AI models?

**Answer:**  
**Not directly**, but you can:
- Use **GitHub Copilot** for code suggestions (GPT-4-based)
- Host **Ti-Guy models** separately (Supabase Edge Functions, AWS Lambda)
- Integrate via GitHub Actions (trigger model inference on push)

**Best Practice:** Keep GitHub Copilot for developer productivity, host Zyeuté's Ti-Guy features on dedicated AI infrastructure.

---

## Canada Data Residency

### Why Data Residency Matters for Quebec

**Quebec Law 25** and federal **PIPEDA** encourage (but don't strictly require) storing personal information in Canada:
- **Trust:** Quebec users prefer Canadian hosting
- **Legal clarity:** Avoid US CLOUD Act jurisdiction
- **Audit simplicity:** Regulators favor Canadian data centers

### GitHub's Data Residency Options

#### Option 1: GitHub Enterprise Cloud (US Hosting)
- **Code repos:** US data centers (GitHub does not offer Canadian region)
- **Actions logs:** US data centers
- **Cost:** $21/user/month
- **Compliance:** Acceptable if you document data flows and implement safeguards

**Mitigation:**
- Store PII in Supabase (Canada region: `ca-central-1`)
- Export audit logs to S3 Canada
- Use Data Processing Agreement (DPA) with GitHub

#### Option 2: GitHub Enterprise Server (Self-Hosted in Canada)
- **Full control:** Host on AWS ca-central-1, Azure Canada, or on-prem
- **Cost:** ~$600-1000 CAD/month (infrastructure + license)
- **Compliance:** 100% Canadian data residency

**Recommended for:**
- Government contracts
- Healthcare/finance sectors
- Strict Law 25 interpretations

### Recommended Architecture for Zyeuté

```
┌─────────────────────────────────────────┐
│   GitHub Enterprise Cloud (US)          │
│   - Source code                         │
│   - CI/CD pipelines                     │
│   - Issue tracking                      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│   AWS ca-central-1 (Canada)             │
│   - Supabase (user data, PII)           │
│   - S3 (audit logs, backups)            │
│   - Self-hosted GPU runners (AI)        │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│   Vercel/Netlify (Global CDN)           │
│   - Static frontend                     │
│   - Edge functions                      │
└─────────────────────────────────────────┘
```

**Rationale:**
- Code in GitHub (low sensitivity, no PII)
- User data in Canada (Supabase ca-central-1)
- AI compute in Canada (self-hosted GPU runners)

---

## Self-Hosted GPU Runner Setup

### Why Self-Hosted GPU Runners?

**Zyeuté's AI features** (Ti-Guy Artiste, Ti-Guy Studio) require GPU compute:
- **DALL-E 3:** Via OpenAI API (no GPU needed)
- **Video processing:** GPU-accelerated encoding (FFmpeg + CUDA)
- **Future models:** Fine-tuned GPT, Stable Diffusion XL

**Benefits:**
- **Cost savings:** GitHub Actions charges $0.016/minute for GPU runners (expensive!)
- **Control:** Optimize hardware for your workloads
- **Privacy:** Process sensitive data on your infrastructure

### Hardware Requirements

#### Minimum (Development)
- **GPU:** NVIDIA RTX 3060 (12GB VRAM)
- **CPU:** 6-core (Intel i5/Ryzen 5)
- **RAM:** 32GB
- **Storage:** 500GB NVMe SSD
- **OS:** Ubuntu 22.04 LTS
- **Cost:** ~$1,500 CAD (one-time) or $150 CAD/month (cloud)

#### Recommended (Production)
- **GPU:** NVIDIA A10G (24GB VRAM) or RTX 4090 (24GB VRAM)
- **CPU:** 16-core (AMD EPYC or Intel Xeon)
- **RAM:** 64GB
- **Storage:** 1TB NVMe SSD
- **OS:** Ubuntu 22.04 LTS
- **Cost:** ~$5,000 CAD (one-time) or $500 CAD/month (AWS g5.2xlarge in ca-central-1)

### Setup Steps

#### 1. Provision GPU Instance (AWS Canada Example)

```bash
# Launch EC2 g5.2xlarge in ca-central-1
aws ec2 run-instances \
  --region ca-central-1 \
  --image-id ami-0c55b159cbfafe1f0 \  # Ubuntu 22.04 Deep Learning AMI
  --instance-type g5.2xlarge \
  --key-name my-key \
  --security-group-ids sg-xxxxxx \
  --subnet-id subnet-xxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=zyeute-gpu-runner}]'
```

#### 2. Install GitHub Actions Runner

```bash
# SSH into instance
ssh -i my-key.pem ubuntu@<instance-ip>

# Download runner
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure runner
./config.sh --url https://github.com/brandonlacoste9-tech/Zyeute \
  --token <YOUR_RUNNER_TOKEN> \
  --name zyeute-gpu-runner \
  --labels self-hosted,gpu,cuda

# Install as service
sudo ./svc.sh install
sudo ./svc.sh start
```

#### 3. Install NVIDIA Drivers & CUDA

```bash
# Install NVIDIA driver
sudo apt update
sudo apt install -y nvidia-driver-535

# Install CUDA Toolkit
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt update
sudo apt install -y cuda-toolkit-12-3

# Verify installation
nvidia-smi
nvcc --version
```

#### 4. Install Docker with NVIDIA Runtime

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt update && sudo apt install -y nvidia-container-toolkit

# Configure Docker
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# Test GPU access in Docker
docker run --rm --gpus all nvidia/cuda:12.3.0-base-ubuntu22.04 nvidia-smi
```

#### 5. Create GitHub Actions Workflow

```yaml
# .github/workflows/ai-video-processing.yml
name: Process Video with Ti-Guy Studio
on:
  workflow_dispatch:
    inputs:
      video_url:
        description: 'Video URL to process'
        required: true

jobs:
  process-video:
    runs-on: [self-hosted, gpu, cuda]
    steps:
      - uses: actions/checkout@v4
      
      - name: Download video
        run: |
          curl -L ${{ github.event.inputs.video_url }} -o input.mp4
      
      - name: Process with GPU acceleration
        run: |
          docker run --rm --gpus all \
            -v $(pwd):/workspace \
            nvidia/cuda:12.3.0-base-ubuntu22.04 \
            ffmpeg -hwaccel cuda -i /workspace/input.mp4 \
            -vf "scale=1920:1080" /workspace/output.mp4
      
      - name: Upload result
        uses: actions/upload-artifact@v4
        with:
          name: processed-video
          path: output.mp4
```

### Cost Comparison

| Option | Cost/Month | GPU | Use Case |
|--------|------------|-----|----------|
| GitHub-hosted (gpu) | ~$1,200 USD | 1x T4 | Not recommended (expensive) |
| AWS g5.2xlarge (ca-central-1) | ~$450 CAD | 1x A10G | Production workloads |
| AWS g4dn.xlarge (ca-central-1) | ~$200 CAD | 1x T4 | Development/testing |
| On-premises (RTX 4090) | ~$150 CAD (amortized) | 1x RTX 4090 | Small teams |

**Recommendation for Zyeuté:**  
Start with **AWS g4dn.xlarge** ($200 CAD/month) for development. Upgrade to **g5.2xlarge** or on-premises RTX 4090 when processing volume increases.

### Security Best Practices

- [ ] **Restrict runner access:** Use GitHub's runner groups (Enterprise feature)
- [ ] **Network isolation:** Place runners in private subnet with NAT gateway
- [ ] **Secrets management:** Store OpenAI API keys in GitHub Secrets, not runner
- [ ] **Monitoring:** Use CloudWatch or Prometheus to track GPU utilization
- [ ] **Auto-scaling:** Implement auto-scaling for burst workloads (AWS Auto Scaling Groups)

---

## GitHub Actions Usage

### Best Practices for Zyeuté

#### 1. Optimize for Cost

**Public repos:** Unlimited Actions minutes (use for open-source work)

**Private repos:**
- GitHub Pro: 3,000 minutes/month
- GitHub Teams: 3,000 minutes/month
- GitHub Enterprise: 50,000 minutes/month

**Strategies:**
- Use self-hosted runners for heavy workloads (AI processing, builds)
- Cache dependencies (`actions/cache@v4`)
- Run workflows only on relevant paths:

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
```

#### 2. Secure Secrets Management

**Never hardcode secrets.** Use GitHub Secrets:

```yaml
- name: Call OpenAI API
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    python scripts/generate_image.py
```

**Organization secrets:** Share secrets across repos (requires GitHub Teams/Enterprise)

#### 3. Matrix Builds for Testing

Test across multiple Node versions:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

#### 4. Parallel Jobs for Speed

Run linting, testing, and builds simultaneously:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]
  
  test:
    runs-on: ubuntu-latest
    steps: [...]
  
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]  # Wait for lint + test
    steps: [...]
```

#### 5. Workflow Templates for Zyeuté

**TypeScript/React Build:**
```yaml
name: Build & Deploy
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

**AI Image Generation (Self-Hosted GPU):**
```yaml
name: Generate AI Images
on: workflow_dispatch
jobs:
  generate:
    runs-on: [self-hosted, gpu]
    steps:
      - uses: actions/checkout@v4
      - name: Generate images
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: python scripts/batch_generate.py
```

---

## GitHub Enterprise Server

### When to Use Enterprise Server

**Use Enterprise Server if:**
- You need **100% Canadian data residency** (Law 25 strict interpretation)
- You have **on-premises infrastructure** (existing data center)
- You require **air-gapped environments** (no internet access)
- You have **strict compliance** (government, healthcare, finance)

**For Zyeuté:**  
**Not recommended initially.** Enterprise Cloud is sufficient for most SaaS startups. Revisit if:
- You sign government contracts requiring on-prem hosting
- Law 25 auditors require Canadian data residency
- You scale to 100+ employees

### Deployment Options

#### Option 1: AWS EC2 (Canada)
**Instance:** r5.2xlarge (8 vCPU, 64GB RAM)  
**Region:** ca-central-1 (Montreal)  
**Storage:** 500GB GP3 EBS  
**Cost:** ~$600 CAD/month

#### Option 2: Azure Virtual Machine (Canada)
**Instance:** D8s v3 (8 vCPU, 32GB RAM)  
**Region:** Canada Central (Toronto)  
**Storage:** 512GB Premium SSD  
**Cost:** ~$550 CAD/month

#### Option 3: On-Premises
**Hardware:** Dell PowerEdge R640 or similar  
**Cost:** ~$8,000 CAD (one-time) + maintenance

### Installation Steps (High-Level)

1. **Download:** Get GitHub Enterprise Server from [enterprise.github.com](https://enterprise.github.com)
2. **Deploy:** Upload to AWS/Azure/VMware
3. **Configure:** Set admin password, SSL certificates
4. **License:** Apply Enterprise license key
5. **Integrate:** Connect to LDAP/SAML, GitHub.com (for Actions)
6. **Backup:** Configure automated backups to S3

**Full guide:** [GitHub Enterprise Server Installation](https://docs.github.com/en/enterprise-server@latest/admin/installation)

### Hybrid Architecture (Cloud + Server)

**Scenario:** Use Enterprise Cloud for development, Enterprise Server for production.

```
Development → GitHub Enterprise Cloud (US)
    ↓ (Git push)
Production → GitHub Enterprise Server (Canada)
```

**Sync:** Configure two-way sync between Cloud and Server.

**Cost:** ~$42 USD/user/month (Cloud + Server licenses)

---

## Migration Support

### Migrating to GitHub from Other Platforms

#### From GitLab
**Tools:**
- [GitHub Importer](https://docs.github.com/en/migrations/importing-source-code/using-github-importer)
- Manual: `git remote add github <url>` → `git push github --all`

**Preserve:**
- Git history ✅
- Issues ✅ (via API)
- Merge requests → Pull requests ❌ (manual recreation)
- CI/CD → GitHub Actions (rewrite `.gitlab-ci.yml`)

#### From Bitbucket
**Tools:**
- GitHub Importer (supports Bitbucket)
- Bitbucket Cloud Pipelines → GitHub Actions (rewrite)

#### From Azure DevOps
**Tools:**
- [Azure DevOps Migration Tool](https://github.com/microsoft/azure-devops-migration-tools)
- Manual export/import for work items

### Migrating CI/CD to GitHub Actions

**From CircleCI:**
```yaml
# .circleci/config.yml
version: 2.1
jobs:
  build:
    docker:
      - image: node:20
    steps:
      - checkout
      - run: npm install
      - run: npm test
```

**To GitHub Actions:**
```yaml
# .github/workflows/build.yml
name: Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm test
```

**Tools:**
- [GitHub Actions Importer](https://docs.github.com/en/actions/migrating-to-github-actions/automated-migrations/automating-migration-with-github-actions-importer)
- Supports CircleCI, GitLab CI, Jenkins, Azure Pipelines

### Migration Checklist

- [ ] Export Git repositories
- [ ] Import to GitHub (via Importer or `git push`)
- [ ] Migrate issues/tickets (API scripts or manual)
- [ ] Rewrite CI/CD pipelines (GitHub Actions)
- [ ] Update team documentation (new URLs, workflows)
- [ ] Configure branch protection rules
- [ ] Set up GitHub Secrets
- [ ] Test end-to-end (build, test, deploy)

---

## Law 25 Compliance (Quebec Privacy Law)

### What is Law 25?

**Bill 64** (now Law 25) modernizes Quebec's privacy legislation:
- **Effective:** September 22, 2022 (phased rollout until 2024)
- **Scope:** All organizations collecting Quebec residents' personal information
- **Penalties:** Up to $25 million CAD or 4% of global revenue

**Key Requirements:**
1. **Consent:** Explicit, informed consent for data collection
2. **Transparency:** Privacy policies in plain language
3. **Data minimization:** Collect only necessary data
4. **Security safeguards:** Encryption, access controls
5. **Breach notification:** Within 72 hours to authorities and affected individuals
6. **Data portability:** Users can request data export
7. **Right to deletion:** Users can request data deletion

### How GitHub Enterprise Helps

| Requirement | GitHub Feature | Implementation |
|-------------|----------------|----------------|
| **Consent** | N/A (code, not user data) | Implement consent in Zyeuté app |
| **Transparency** | Public repos, audit logs | Document data flows |
| **Data minimization** | Configurable logging | Disable unnecessary logs |
| **Security safeguards** | Encryption, 2FA, RBAC | Enable all security features |
| **Breach notification** | Audit logs, alerts | Monitor logs, set up alerts |
| **Data portability** | API exports | Provide user data export in app |
| **Right to deletion** | API deletions | Implement deletion in app + GitHub |

### Compliance Checklist for Zyeuté

#### Data Inventory
- [ ] **Code repositories:** Source code (no PII) → GitHub
- [ ] **User profiles:** Names, emails, avatars → Supabase (Canada)
- [ ] **Posts/content:** User-generated content → Supabase (Canada)
- [ ] **Analytics:** Usage data → PostHog (self-hosted in Canada)
- [ ] **Payments:** Stripe (compliant with PIPEDA)

#### Privacy Policies
- [ ] Create privacy policy in French and English
- [ ] Explain data collection, storage, and usage
- [ ] List third-party services (GitHub, Supabase, Stripe, OpenAI)
- [ ] Describe user rights (access, portability, deletion)
- [ ] Include contact for privacy inquiries

#### Security Measures
- [ ] Enable 2FA for all GitHub accounts
- [ ] Encrypt Supabase database (AES-256)
- [ ] Use HTTPS for all traffic (TLS 1.3)
- [ ] Implement session management (auto-logout)
- [ ] Regular security audits (CodeQL, Dependabot)

#### Breach Response Plan
- [ ] Define breach notification process
- [ ] Designate privacy officer (e.g., CTO)
- [ ] Document incident response steps
- [ ] Test breach response annually

#### Data Retention
- [ ] Define retention periods (e.g., 3 years for audit logs)
- [ ] Implement automated deletion (e.g., delete inactive accounts after 2 years)
- [ ] Document retention policy in privacy policy

#### User Rights
- [ ] Provide data export feature (JSON/CSV)
- [ ] Implement account deletion (cascade delete)
- [ ] Respond to requests within 30 days (Law 25 requirement)

### Data Processing Agreement (DPA) with GitHub

**Action:** Request DPA from GitHub Enterprise Sales:
- Email: [enterprise@github.com](mailto:enterprise@github.com)
- Include: Organization name, intended use, Law 25 compliance requirements

**DPA Contents:**
- Data processing scope (code, logs)
- Security measures (encryption, access controls)
- Subprocessors (GitHub's third-party vendors)
- Liability and indemnification
- Data breach notification procedures

### DPIA Template for GitHub

**Data Protection Impact Assessment (DPIA):**

1. **Data Processing Description:**  
   - GitHub stores source code, issues, pull requests, and workflows for Zyeuté.
   - Personal information: Developer names/emails in commits (public information).
   - Sensitive data: None (no user PII in repositories).

2. **Necessity and Proportionality:**  
   - Necessary for version control, collaboration, and CI/CD.
   - Proportionate: Only developer information collected, not end-users.

3. **Risks:**  
   - Unauthorized access to private repositories
   - Accidental exposure of secrets (API keys)
   - Data breach at GitHub

4. **Mitigation:**  
   - Enable 2FA, branch protection, secret scanning
   - Use GitHub Secrets for API keys
   - Monitor audit logs for suspicious activity
   - Purchase cyber insurance

5. **Consultation:**  
   - Reviewed by privacy officer
   - Approved by CTO

6. **Approval:**  
   - Date: [Fill in]
   - Signed: [Name, Title]

---

## Audit & Logging Guidance

### Why Audit Logs Matter

**Use cases:**
- **Security:** Detect unauthorized access, insider threats
- **Compliance:** Prove Law 25 compliance to auditors
- **Debugging:** Troubleshoot access issues
- **Forensics:** Investigate breaches

### What GitHub Logs

**Organization Audit Log:**
- User actions (repo creation, push, pull, merge)
- Permission changes (add/remove members, role changes)
- Settings changes (branch protection, webhooks)
- Security events (failed 2FA, SSH key changes)

**Retention:** 90 days (Web UI/API), unlimited (streaming)

### Exporting Audit Logs

#### Method 1: Web UI (Manual)
1. Go to **Organization Settings** > **Audit log**
2. Filter by date, user, action
3. Click **Export** > Download JSON or CSV

#### Method 2: API (Automated)

```bash
# Export last 30 days
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  "https://api.github.com/orgs/brandonlacoste9-tech/audit-log?per_page=100" \
  > audit-log.json
```

**Automate with GitHub Actions:**
```yaml
name: Export Audit Logs
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - name: Export logs
        run: |
          curl -H "Authorization: token ${{ secrets.AUDIT_TOKEN }}" \
            "https://api.github.com/orgs/brandonlacoste9-tech/audit-log" \
            > audit-log-$(date +%Y%m%d).json
      - name: Upload to S3 (Canada)
        run: |
          aws s3 cp audit-log-*.json s3://zyeute-audit-logs/ --region ca-central-1
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_KEY }}
```

#### Method 3: Streaming (Enterprise Only)

**Real-time streaming to:**
- AWS S3
- Azure Blob Storage
- Google Cloud Storage
- Splunk
- Datadog

**Setup:**
1. Go to **Enterprise Settings** > **Audit log streaming**
2. Choose destination (e.g., S3)
3. Provide credentials (IAM role or access key)
4. Test connection
5. Enable streaming

**Cost:** Free (GitHub), pay for storage (e.g., S3: ~$0.023 CAD/GB/month)

### Log Retention for Law 25

**Requirement:** Retain logs for **minimum 3 years** (Law 25 recommendation for audit trails).

**Implementation:**
1. Stream logs to **S3 Canada (ca-central-1)**
2. Enable **S3 Lifecycle Policy:**
   - Transition to Glacier after 90 days (reduce cost)
   - Delete after 3 years (or longer per internal policy)

```json
{
  "Rules": [
    {
      "Id": "ArchiveAuditLogs",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 1095  // 3 years
      }
    }
  ]
}
```

### Analyzing Logs

**Common Queries:**

1. **Find failed login attempts:**
   ```bash
   jq '.[] | select(.action == "org.authentication_failure")' audit-log.json
   ```

2. **Find repo deletions:**
   ```bash
   jq '.[] | select(.action == "repo.destroy")' audit-log.json
   ```

3. **Find permission changes:**
   ```bash
   jq '.[] | select(.action | startswith("team."))' audit-log.json
   ```

**Tools:**
- **jq:** Command-line JSON processor
- **Splunk:** SIEM platform (expensive)
- **ELK Stack:** Elasticsearch + Logstash + Kibana (self-hosted)
- **Datadog:** Cloud monitoring (moderate cost)

### Quarterly Audit Review Checklist

- [ ] Export last 90 days of audit logs
- [ ] Review for unauthorized access attempts
- [ ] Verify no unexpected permission changes
- [ ] Check for deleted repositories (accidental or malicious)
- [ ] Document findings in compliance report
- [ ] Share with privacy officer and management

---

## Next Steps Checklist

### Immediate Actions (Week 1)

- [ ] **Review current GitHub plan:** Confirm Pro/Teams/Enterprise
- [ ] **Enable 2FA:** Require for all organization members
- [ ] **Set up branch protection:** Require reviews, status checks
- [ ] **Enable Dependabot:** Automated security updates
- [ ] **Create `.env.example`:** Document required environment variables
- [ ] **Document data flows:** Create DPIA for GitHub usage

### Short-Term (Month 1)

- [ ] **Export audit logs:** Set up automated weekly exports to S3 Canada
- [ ] **Review GitHub Actions:** Optimize for cost (use self-hosted runners)
- [ ] **Implement secret scanning:** Enable push protection
- [ ] **Create privacy policy:** Include GitHub in third-party services
- [ ] **Test backup/restore:** Ensure you can recover code if needed
- [ ] **Set up GPU runner:** If needed for AI workloads (optional)

### Mid-Term (Quarter 1)

- [ ] **Conduct security audit:** Run CodeQL, review vulnerabilities
- [ ] **Implement SSO:** If hiring team (requires Teams/Enterprise)
- [ ] **Create runbooks:** Document incident response, backup procedures
- [ ] **Train team:** GitHub best practices, security awareness
- [ ] **Review compliance:** Assess Law 25 readiness, create action plan

### Long-Term (Year 1)

- [ ] **Evaluate Enterprise upgrade:** When team grows or compliance needs increase
- [ ] **Consider Enterprise Server:** If Canadian data residency required
- [ ] **Optimize infrastructure:** Right-size runners, reduce Actions costs
- [ ] **Annual compliance audit:** Review audit logs, update DPIA
- [ ] **Renew DPA:** Ensure GitHub DPA is current

---

## Resources & Links

### Official GitHub Documentation

- **GitHub Enterprise:** [https://docs.github.com/en/enterprise-cloud@latest](https://docs.github.com/en/enterprise-cloud@latest)
- **Enterprise Server:** [https://docs.github.com/en/enterprise-server@latest](https://docs.github.com/en/enterprise-server@latest)
- **GitHub Actions:** [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
- **Security:** [https://docs.github.com/en/code-security](https://docs.github.com/en/code-security)
- **Audit Logs:** [https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)

### GitHub Pricing

- **Plans Comparison:** [https://github.com/pricing](https://github.com/pricing)
- **Copilot Pricing:** [https://github.com/features/copilot/plans](https://github.com/features/copilot/plans)

### Compliance Resources

- **Law 25 (Quebec):** [https://www.quebec.ca/en/government/ministere/cybersecurite-numerique](https://www.quebec.ca/en/government/ministere/cybersecurite-numerique)
- **PIPEDA (Canada):** [https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/)
- **CAI (Quebec Privacy Authority):** [https://www.cai.gouv.qc.ca/](https://www.cai.gouv.qc.ca/)

### Self-Hosted Runners

- **Setup Guide:** [https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners)
- **GPU Setup:** [https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

### Migration Tools

- **GitHub Importer:** [https://github.com/new/import](https://github.com/new/import)
- **Actions Importer:** [https://docs.github.com/en/actions/migrating-to-github-actions/automated-migrations](https://docs.github.com/en/actions/migrating-to-github-actions/automated-migrations)

### Support

- **GitHub Support:** [https://support.github.com](https://support.github.com)
- **Enterprise Sales:** [enterprise@github.com](mailto:enterprise@github.com)
- **Community Forum:** [https://github.community](https://github.community)

---

## Appendix: Small Team Cost Optimization

### Scenario: Solo Developer (Current Zyeuté State)

**GitHub Plan:** Pro ($4 USD/month)  
**Copilot:** Individual ($10 USD/month)  
**Actions:** 3,000 minutes/month (included)  
**Total:** ~$14 USD/month (~$19 CAD/month)

**Optimization:**
- Use public repos for open-source (free Actions)
- Self-host runner for AI (avoid GPU charges)
- Use Vercel free tier for hosting

### Scenario: Small Team (5 Developers)

**GitHub Plan:** Teams ($4 USD/user/month = $20 USD/month)  
**Copilot:** Individual ($10 USD/user/month = $50 USD/month)  
**Actions:** 3,000 minutes/month (may need more)  
**Self-Hosted Runner:** AWS g4dn.xlarge (~$200 CAD/month)  
**Total:** ~$70 USD/month + $200 CAD/month = ~$295 CAD/month

**Optimization:**
- Share organization secrets (reduce duplication)
- Use Actions caching (reduce build times)
- Schedule heavy jobs off-peak (lower runner costs)

### Scenario: Scaling Team (20 Developers)

**GitHub Plan:** Enterprise ($21 USD/user/month = $420 USD/month)  
**Copilot:** Enterprise ($39 USD/user/month = $780 USD/month)  
**Actions:** 50,000 minutes/month (included)  
**Self-Hosted Runners:** 3x AWS g5.2xlarge (~$1,350 CAD/month)  
**Total:** ~$1,200 USD/month + $1,350 CAD/month = ~$2,970 CAD/month

**Optimization:**
- Use runner auto-scaling (save on idle time)
- Implement workflow approval gates (reduce unnecessary runs)
- Negotiate Enterprise discount (15-20% for annual billing)

---

**Last Updated:** December 3, 2025  
**Next Review:** March 2026  
**Maintained By:** Zyeuté Dev Team  
**Questions?** Open an issue or contact [support@zyeute.ca](mailto:support@zyeute.ca)

---

**🔥⚜️ Fait au Québec, pour le Québec ⚜️🔥**
