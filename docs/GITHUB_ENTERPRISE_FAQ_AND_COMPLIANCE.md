# GitHub Enterprise FAQ and Compliance Guide

> **Document Status:** Current as of December 2025  
> **Review Schedule:** Review and update quarterly (March, June, September, December)  
> **Last Updated:** December 3, 2025  
> **Purpose:** Single reference for audit/compliance, team onboarding, and GitHub Enterprise support outreach

---

## Table of Contents

1. [Canada/Quebec Data Residency & Law 25 Compliance](#canadaquebec-data-residency--law-25-compliance)
2. [Self-Hosted GPU Runner Support](#self-hosted-gpu-runner-support)
3. [GitHub Actions Minutes, Billing & Concurrency](#github-actions-minutes-billing--concurrency)
4. [Enterprise Cloud vs Enterprise Server](#enterprise-cloud-vs-enterprise-server)
5. [Demo/Trial, Pricing & Migration](#demotrial-pricing--migration)
6. [Quick Reference Tables](#quick-reference-tables)
7. [Next Steps & Contacts](#next-steps--contacts)
8. [Audit & Compliance Checklist](#audit--compliance-checklist)

---

## Canada/Quebec Data Residency & Law 25 Compliance

### Overview

**Quebec Law 25** (An Act to modernize legislative provisions as regards the protection of personal information) requires organizations to:
- Store Quebec residents' personal information within Canada or in jurisdictions with equivalent data protection
- Implement data sovereignty measures
- Conduct privacy impact assessments
- Report data breaches within 72 hours

### GitHub Enterprise Data Residency

#### Current Capabilities (as of December 2025)

| Feature | Status | Details |
|---------|--------|---------|
| **Canadian Data Hosting** | ✅ Available (Cloud) | GitHub Enterprise Cloud can host data in Canadian regions |
| **Data Residency Controls** | ✅ Available | Enterprise Cloud customers can request regional data hosting |
| **GDPR Compliance** | ✅ Yes | GitHub is GDPR compliant, meets Quebec Law 25 equivalency |
| **Data Processing Agreement** | ✅ Available | Standard DPA available for enterprise customers |

#### How to Enable Canadian Data Residency

1. **Contact GitHub Enterprise Sales**
   - Email: enterprise@github.com
   - Phone: 1-877-448-4820 (North America)
   - Request: "Canadian data residency for Law 25 compliance"

2. **Required Information**
   - Enterprise account name
   - Number of seats/users
   - Specific compliance requirements (Quebec Law 25)
   - Timeline for implementation

3. **Configuration Process**
   - GitHub provisions a subdomain for your enterprise (e.g., `yourcompany.ghe.com`)
   - Data storage location set to Canadian region
   - Typically takes 2-4 weeks after contract signing

#### Key Resources

- **GitHub Privacy Statement**: https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement
- **Data Protection Addendum**: https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement
- **GDPR Compliance**: https://github.com/security/gdpr
- **Quebec Law 25 Info**: https://www.quebec.ca/en/government/legal-and-administrative-framework/access-to-information/privacy-protection

#### Compliance Contacts

| Contact Type | Details |
|--------------|---------|
| **GitHub Privacy Team** | privacy@github.com |
| **GitHub Enterprise Sales** | enterprise@github.com |
| **GitHub Support** | https://support.github.com/contact/enterprise |
| **Quebec Privacy Authority** | Commission d'accès à l'information du Québec (CAI) |
| **CAI Website** | https://www.cai.gouv.qc.ca |

#### Law 25 Compliance Checklist

- [ ] Confirm GitHub data residency set to Canada
- [ ] Obtain Data Processing Agreement (DPA) from GitHub
- [ ] Document data flows and storage locations
- [ ] Conduct Privacy Impact Assessment (PIA)
- [ ] Implement access controls and audit logging
- [ ] Enable GitHub Enterprise audit log streaming
- [ ] Train team on data protection requirements
- [ ] Establish breach notification procedures (72-hour requirement)
- [ ] Review compliance quarterly

#### Additional Considerations

⚠️ **Important Notes:**
- GitHub Enterprise Server (self-hosted) gives full control over data location
- GitHub Actions runners can be self-hosted in Canada for CI/CD data control
- Third-party integrations (CircleCI, etc.) may require separate compliance review
- Supabase (if used) also needs Canadian data residency configuration

---

## Self-Hosted GPU Runner Support

### Overview

Self-hosted GPU runners enable running AI/ML workloads, image generation (DALL-E), video processing, and other GPU-intensive tasks in GitHub Actions.

### Capabilities & Limitations

| Feature | GitHub-Hosted Runners | Self-Hosted GPU Runners |
|---------|----------------------|-------------------------|
| **GPU Support** | ❌ No | ✅ Yes (bring your own GPU) |
| **GPU Types** | N/A | NVIDIA CUDA, AMD ROCm, Apple Silicon |
| **Cost** | Included (with limits) | Hardware + electricity cost |
| **Maintenance** | GitHub manages | You manage |
| **OS Support** | Linux, Windows, macOS | Linux, Windows, macOS |
| **Scalability** | High (GitHub's infrastructure) | Limited by your hardware |
| **Data Residency** | GitHub's data centers | Your infrastructure (Canada) |

### Setup Checklist for Self-Hosted GPU Runners

#### Prerequisites

- [ ] **Hardware Requirements**
  - Server with NVIDIA GPU (e.g., RTX 4090, A100, H100)
  - Minimum 16GB RAM (32GB+ recommended)
  - 500GB+ SSD storage
  - Ubuntu 22.04 LTS or Windows Server 2022
  - Stable internet connection (minimum 100 Mbps)

- [ ] **Software Requirements**
  - NVIDIA Driver 535+ (for CUDA 12.x)
  - Docker 24+ with NVIDIA Container Toolkit
  - Git 2.40+
  - CUDA Toolkit 12.x (for AI/ML workloads)

#### Installation Steps

**1. Install NVIDIA Drivers & CUDA**

```bash
# Ubuntu example
sudo apt update && sudo apt upgrade -y
sudo apt install nvidia-driver-535 nvidia-utils-535 -y
sudo reboot

# Verify installation
nvidia-smi
```

**2. Install Docker with GPU Support**

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/libnvidia-container/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt update
sudo apt install -y nvidia-container-toolkit
sudo systemctl restart docker

# Test GPU in Docker
docker run --rm --gpus all nvidia/cuda:12.0-base nvidia-smi
```

**3. Register Self-Hosted Runner**

```bash
# Navigate to GitHub repository → Settings → Actions → Runners → New self-hosted runner
# Follow instructions provided by GitHub, which look like:

mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.317.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.317.0/actions-runner-linux-x64-2.317.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.317.0.tar.gz

# Configure runner
./config.sh --url https://github.com/your-org/your-repo --token YOUR_TOKEN

# Add label for GPU runners
./config.sh --url https://github.com/your-org/your-repo --token YOUR_TOKEN --labels self-hosted,gpu,cuda

# Install as service (recommended)
sudo ./svc.sh install
sudo ./svc.sh start
```

**4. Test GPU Workflow**

Create `.github/workflows/test-gpu.yml`:

```yaml
name: Test GPU Runner

on: [workflow_dispatch]

jobs:
  test-gpu:
    runs-on: [self-hosted, gpu, cuda]
    steps:
      - name: Check GPU
        run: nvidia-smi
      
      - name: Test CUDA in Docker
        run: docker run --rm --gpus all nvidia/cuda:12.0-base nvidia-smi
```

#### Known Limitations

⚠️ **Important Limitations:**

1. **Maintenance Overhead**
   - You're responsible for OS updates, driver updates, security patches
   - GPU driver compatibility with CUDA versions can be tricky
   - Requires DevOps expertise

2. **Security Considerations**
   - Self-hosted runners can execute arbitrary code from pull requests
   - **Never use on public repositories** or enable `pull_request` trigger without approval
   - Use `workflow_dispatch` or `push` to protected branches only
   - Consider network isolation and firewall rules

3. **Cost Implications**
   - GPU hardware: $1,500-$30,000+ per server
   - Electricity: ~$50-200/month per GPU server (depends on usage)
   - Network bandwidth costs
   - Maintenance time/personnel

4. **Scalability**
   - Limited by physical hardware
   - For high-demand workloads, consider cloud GPU providers (AWS EC2 with GPU, GCP with GPUs, Azure GPU VMs)

5. **GitHub Actions Limitations**
   - Job timeout: 6 hours max (can be extended to 24h for enterprise)
   - Workflow timeout: 72 hours max
   - Artifact storage: 500MB per artifact, 2GB per workflow

#### Alternative: Cloud GPU Runners

If self-hosted is too complex, consider:

| Provider | Service | GPU Options | Cost (approx.) |
|----------|---------|-------------|----------------|
| **AWS** | EC2 Self-Hosted Runner | NVIDIA A100, V100, T4 | $0.50-$32/hour |
| **Google Cloud** | GCE Self-Hosted Runner | NVIDIA A100, V100, T4 | $0.45-$30/hour |
| **Azure** | VM Self-Hosted Runner | NVIDIA A100, V100 | $0.90-$27/hour |
| **Lambda Labs** | GPU Cloud | NVIDIA A100, H100 | $1.10-$2.50/hour |

#### Key Resources

- **Self-Hosted Runners Docs**: https://docs.github.com/en/actions/hosting-your-own-runners
- **NVIDIA Container Toolkit**: https://github.com/NVIDIA/nvidia-container-toolkit
- **Actions Runner Releases**: https://github.com/actions/runner/releases
- **GPU Security Best Practices**: https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions

---

## GitHub Actions Minutes, Billing & Concurrency

### Actions Minutes & Billing

#### GitHub-Hosted Runners Included Minutes (December 2025)

| Plan | Linux/Windows Minutes | macOS Minutes | Storage |
|------|----------------------|---------------|---------|
| **Free** | 2,000 min/month | 0 | 500 MB |
| **Pro** | 3,000 min/month | 0 | 1 GB |
| **Team** | 3,000 min/month | 0 | 2 GB |
| **Enterprise Cloud** | 50,000 min/month | 0 | 50 GB |

**Multiplier Rates:**
- **Linux**: 1x
- **Windows**: 2x (1 minute = 2 minutes billed)
- **macOS**: 10x (1 minute = 10 minutes billed)
- **Self-Hosted Runners**: FREE (unlimited, no minutes counted)

#### Cost After Included Minutes

| Runner Type | Cost per Minute |
|-------------|-----------------|
| **Linux** | $0.008 |
| **Windows** | $0.016 (2x Linux) |
| **macOS** | $0.08 (10x Linux) |

**Example Cost Calculation:**
- 100,000 minutes on Linux = (100,000 - 50,000) × $0.008 = $400/month
- 10,000 minutes on macOS = 10,000 × $0.08 = $800/month

#### Storage & Artifact Costs

| Item | Included | Overage Cost |
|------|----------|--------------|
| **Artifacts/Cache Storage** | 50 GB (Enterprise) | $0.25/GB/month |
| **Package Storage** | Unlimited (public) | $0.008/GB/day (private) |

### Concurrency & Parallel Jobs

#### Job Concurrency Limits (December 2025)

| Plan | Max Concurrent Jobs | Max Jobs per Workflow |
|------|---------------------|----------------------|
| **Free** | 20 | 20 |
| **Pro** | 40 | 40 |
| **Team** | 60 | 60 |
| **Enterprise Cloud** | 500 | 500 |
| **Enterprise Server** | 1,000+ (configurable) | 1,000+ |

**Self-Hosted Runners:**
- No GitHub-imposed limits (limited by your hardware only)
- Enterprise customers can request higher concurrency limits

#### Strategies to Optimize Actions Usage

1. **Use Self-Hosted Runners for Long Jobs**
   - No minutes counted
   - Ideal for builds, tests, deployments

2. **Use Matrix Builds Efficiently**
   ```yaml
   strategy:
     matrix:
       os: [ubuntu-latest]  # Use Linux instead of macOS when possible
       node: [18, 20]
   ```

3. **Cache Dependencies**
   ```yaml
   - uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

4. **Artifact Retention Policy**
   ```yaml
   - uses: actions/upload-artifact@v3
     with:
       name: build
       path: dist/
       retention-days: 7  # Default is 90 days
   ```

5. **Run Only When Necessary**
   ```yaml
   on:
     push:
       branches: [main]
       paths:
         - 'src/**'
         - 'package.json'
   ```

#### Monitoring Usage

**View Usage Dashboard:**
1. Go to Organization → Settings → Billing → Actions
2. View current month's usage
3. Set spending limits
4. Download usage reports (CSV)

**Set Spending Limits:**
```
Settings → Billing → Spending Limits
- Set monthly budget (e.g., $500)
- Enable email alerts at 75%, 90%, 100%
```

#### Key Resources

- **Actions Billing**: https://docs.github.com/en/billing/managing-billing-for-github-actions
- **Usage Limits**: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#usage-limits
- **Optimize Actions**: https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows

---

## Enterprise Cloud vs Enterprise Server

### Feature Comparison

| Feature | Enterprise Cloud | Enterprise Server |
|---------|------------------|-------------------|
| **Hosting** | GitHub-managed (cloud) | Self-hosted (on-premises) |
| **Data Control** | GitHub's data centers | Your infrastructure (Canada) |
| **Setup Time** | Minutes (instant) | Days/weeks (install & configure) |
| **Maintenance** | GitHub manages | You manage (updates, backups) |
| **Cost Model** | Per-user SaaS subscription | License + infrastructure cost |
| **Scalability** | Unlimited (GitHub scales) | Limited by your hardware |
| **Updates** | Automatic | Manual (quarterly releases) |
| **Internet Required** | Yes | No (can run air-gapped) |
| **Advanced Security (GHAS)** | ✅ Included | ✅ Included |
| **Actions Minutes** | 50,000/month included | Unlimited (self-hosted) |
| **Copilot** | ✅ Available (add-on) | ✅ Available (add-on) |
| **Regional Data Hosting** | ✅ Available (request) | ✅ Full control |
| **API Rate Limits** | 5,000 req/hour (authenticated) | Configurable (higher) |
| **Support** | 24/7 Premium Support | 24/7 Premium Support |
| **Audit Logging** | ✅ Yes (with streaming) | ✅ Yes (local storage) |
| **SSO/SAML** | ✅ Yes | ✅ Yes |
| **IP Allow Lists** | ✅ Yes | ✅ Yes (firewall level) |

### Which Should You Choose?

#### Choose **Enterprise Cloud** if:
- ✅ You want minimal maintenance
- ✅ You need instant setup
- ✅ You trust GitHub's infrastructure
- ✅ Canadian data residency is sufficient
- ✅ You have <500 users
- ✅ You want automatic updates and new features
- ✅ You don't need air-gapped environment

#### Choose **Enterprise Server** if:
- ✅ You need 100% data control (on-premises in Canada)
- ✅ You have strict compliance requirements (banking, healthcare, government)
- ✅ You need air-gapped/offline environment
- ✅ You have >1,000 users (more cost-effective at scale)
- ✅ You have DevOps team to manage infrastructure
- ✅ You need custom integrations/modifications
- ✅ You already have data center infrastructure

#### Hybrid Approach: GitHub Connect

**What is it?**
- Connect Enterprise Server to Enterprise Cloud
- Get cloud features while keeping data on-premises
- Sync users, licenses, and features

**Use Case:**
- Primary development on Enterprise Server (data in Canada)
- Use Cloud for public-facing repos or external collaboration
- Best of both worlds

**Resources:**
- **GitHub Connect Docs**: https://docs.github.com/en/enterprise-server@latest/admin/configuration/configuring-github-connect

### Cost Comparison

#### Enterprise Cloud

| Item | Cost (USD/year) |
|------|-----------------|
| **Base User License** | $252/user/year |
| **Advanced Security (GHAS)** | $630/user/year (optional) |
| **Copilot Enterprise** | $468/user/year (optional) |
| **Actions Overage** | Variable (see billing section) |
| **Example: 10 users, full suite** | ~$13,500/year |

#### Enterprise Server

| Item | Cost (USD/year) |
|------|-----------------|
| **Base License (50 users)** | ~$25,000/year |
| **Infrastructure** | $10,000-50,000+ (hardware/cloud) |
| **Maintenance/Personnel** | $50,000+ (DevOps engineer) |
| **Advanced Security (GHAS)** | Included in license |
| **Copilot Enterprise** | $468/user/year (optional) |
| **Example: 50 users** | ~$85,000-125,000/year |

**Note:** Pricing varies based on region, contract terms, and volume discounts. Contact GitHub Sales for exact quotes.

### Key Resources

- **Enterprise Cloud**: https://docs.github.com/en/enterprise-cloud@latest
- **Enterprise Server**: https://docs.github.com/en/enterprise-server@latest
- **Feature Comparison**: https://github.com/pricing#compare-features
- **GitHub Connect**: https://docs.github.com/en/enterprise-server@latest/admin/configuration/configuring-github-connect

---

## Demo/Trial, Pricing & Migration

### Demo & Trial Programs

#### Free Trial Options

| Program | Duration | What You Get | How to Start |
|---------|----------|--------------|--------------|
| **Enterprise Cloud Trial** | 30 days | Full Enterprise Cloud access, GHAS, 50 users | https://github.com/enterprise |
| **Advanced Security Trial** | 30 days | CodeQL, Secret Scanning, Dependabot | Enable in Settings → Security |
| **Copilot Enterprise Trial** | 30 days | Full Copilot Enterprise features | Settings → Copilot |
| **Enterprise Server Trial** | 45 days | Download & self-install trial license | https://enterprise.github.com/trial |

#### How to Request Enterprise Trial

1. **Visit**: https://github.com/enterprise
2. **Click**: "Start a free trial"
3. **Provide**:
   - Company name
   - Email (work email required)
   - Number of users (estimate)
   - Use case / industry
4. **Receive**: Trial access within 1 business day
5. **Get Help**: Assigned Customer Success Manager (CSM)

#### What Happens After Trial?

- **Data preserved** if you purchase within 30 days of trial end
- **Grace period** typically 7-14 days to migrate data if not purchasing
- **Contact Sales** during trial for smooth transition to paid plan

### Pricing for Small Teams (5-20 Users)

#### Recommended Approach for Small Teams

**Option 1: Start with Team Plan ($4/user/month)**
- Good for: Small startups, budget-conscious teams
- Limitations: No GHAS, no regional data hosting, limited Actions minutes
- Upgrade path: Easy migration to Enterprise Cloud when ready

**Option 2: Enterprise Cloud (Negotiated Pricing)**
- Contact sales for small team discounts
- Typical minimum: 10 users
- Annual prepay discounts available

#### Small Team Cost Examples

**Team Plan (10 users):**
```
10 users × $4/user/month × 12 months = $480/year
+ Actions overage (if any)
Total: ~$500-800/year
```

**Enterprise Cloud (10 users):**
```
10 users × $21/user/month × 12 months = $2,520/year
+ GHAS: $630/user/year × 10 = $6,300/year
+ Actions: 50,000 min/month included (usually sufficient)
Total: ~$8,820/year (negotiate for small team discount → ~$5,000-6,000/year)
```

**Recommendation for Zyeuté:**
- Start with **Enterprise Cloud (10 users)**
- Enable GHAS for security compliance
- Use self-hosted runners for GPU/AI workloads (saves Actions minutes)
- Negotiate annual contract for 10-20% discount

### Migration Support

#### Migrating to GitHub Enterprise

**From GitHub Team to Enterprise Cloud:**
- **Duration**: 1-2 days (seamless upgrade)
- **Data Migration**: Automatic (no migration needed, just upgrade billing)
- **Downtime**: None
- **Cost**: No migration cost

**From Other Platforms (GitLab, Bitbucket, Azure DevOps):**
- **GitHub Importer Tool**: https://docs.github.com/en/migrations/importing-source-code/using-github-importer
- **CLI Tool**: `gh` CLI with extensions
- **Professional Services**: GitHub offers paid migration assistance

**From Enterprise Server to Enterprise Cloud (or vice versa):**
- **GitHub Migration Service**: Dedicated team helps with large migrations
- **Typical Timeline**: 2-8 weeks (depends on repo size and complexity)
- **Cost**: Included with Enterprise license

#### Migration Checklist

- [ ] **Audit Current Setup**
  - Count repositories, users, integrations
  - Document current workflows and CI/CD pipelines
  - List third-party integrations

- [ ] **Plan Migration**
  - Choose migration date (off-hours/weekend)
  - Identify critical vs. non-critical repos
  - Communicate with team

- [ ] **Test Migration**
  - Migrate 1-2 test repos first
  - Verify Actions workflows work
  - Test integrations (CircleCI, Supabase webhooks, Stripe webhooks)

- [ ] **Execute Migration**
  - Use GitHub Importer or API
  - Migrate repos in batches
  - Update webhook URLs, API tokens

- [ ] **Post-Migration Validation**
  - Verify all repos accessible
  - Test CI/CD pipelines
  - Check webhook deliveries
  - Update documentation

- [ ] **Cleanup**
  - Archive old repositories (if applicable)
  - Revoke old access tokens
  - Update bookmarks/links

#### Migration Resources

- **GitHub Importer**: https://docs.github.com/en/migrations/importing-source-code
- **GitHub CLI**: https://cli.github.com
- **Migration Best Practices**: https://docs.github.com/en/migrations/overview/planning-your-migration-to-github
- **Contact Migration Support**: migrations@github.com

### Contacts for Sales & Support

| Type | Contact Method | Best For |
|------|----------------|----------|
| **Enterprise Sales** | enterprise@github.com | Pricing, quotes, contracts |
| **Sales Phone** | 1-877-448-4820 (NA) | Immediate questions |
| **Customer Success** | Assigned during trial/purchase | Onboarding, best practices |
| **Technical Support** | https://support.github.com/contact/enterprise | Technical issues, bugs |
| **Migration Team** | migrations@github.com | Large migrations, data transfers |
| **Privacy/Compliance** | privacy@github.com | Law 25, GDPR, data residency |

---

## Quick Reference Tables

### Summary: Data Residency & Compliance

| Requirement | Solution | Contact |
|-------------|----------|---------|
| **Quebec Law 25 Compliance** | Enterprise Cloud with Canadian data residency | enterprise@github.com |
| **Data Processing Agreement** | Request DPA from GitHub | privacy@github.com |
| **Audit Logging** | Enable audit log streaming | https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise |
| **Breach Notification** | 72-hour reporting to CAI | https://www.cai.gouv.qc.ca |

### Summary: Self-Hosted GPU Runners

| Component | Requirement | Cost Estimate |
|-----------|-------------|---------------|
| **GPU Server** | NVIDIA GPU (RTX 4090, A100, H100) | $1,500-30,000 |
| **Software** | Ubuntu 22.04, Docker, NVIDIA drivers | Free |
| **Electricity** | ~300-500W continuous | $50-200/month |
| **Maintenance** | DevOps engineer time | $50,000+/year (personnel) |
| **Alternative** | Cloud GPU runners (AWS, GCP, Azure) | $0.50-32/hour |

### Summary: GitHub Actions Billing

| Plan | Included Minutes | Linux Cost/Min | macOS Cost/Min | Concurrent Jobs |
|------|------------------|----------------|----------------|-----------------|
| **Enterprise Cloud** | 50,000/month | $0.008 | $0.08 | 500 |
| **Self-Hosted** | Unlimited | FREE | FREE | Hardware-limited |

### Summary: Enterprise Plans

| Feature | Team | Enterprise Cloud | Enterprise Server |
|---------|------|------------------|-------------------|
| **Cost (10 users/year)** | ~$480 | ~$2,520 + GHAS | ~$25,000 (50 user min) |
| **Data Residency** | GitHub's data centers | Canadian regions (request) | Your infrastructure |
| **GHAS Included** | ❌ No | ✅ Yes (add-on) | ✅ Yes |
| **Actions Minutes** | 3,000/month | 50,000/month | Unlimited |
| **Setup Time** | Instant | Instant | Days/weeks |
| **Maintenance** | None (GitHub) | None (GitHub) | You manage |
| **Best For** | Small teams, startups | Growing companies, compliance | Large orgs, high compliance |

---

## Next Steps & Contacts

### Immediate Actions

#### For Audit/Compliance:
1. **Contact GitHub Privacy Team**
   - Email: privacy@github.com
   - Request: Data Processing Agreement for Law 25 compliance
   - Ask for: Canadian data residency confirmation

2. **Enable Audit Logging**
   - Go to: Enterprise Settings → Audit Log
   - Enable: Audit log streaming to SIEM/logging system
   - Retention: Configure 1+ year retention

3. **Conduct Privacy Impact Assessment (PIA)**
   - Document: What data is stored in GitHub (code, issues, comments)
   - Identify: Personal information (user emails, names, comments)
   - Risk Assessment: Likelihood and impact of data breach
   - Mitigation: Implement access controls, 2FA, branch protection

#### For Team Onboarding:
1. **Start Enterprise Trial**
   - Visit: https://github.com/enterprise
   - Duration: 30 days free
   - Test: GHAS, Copilot, Advanced features

2. **Set Up Self-Hosted GPU Runner (if needed)**
   - Follow: Setup checklist in "Self-Hosted GPU Runner Support" section
   - Test: GPU-accelerated workflows (AI image generation, video processing)
   - Monitor: GPU usage and costs

3. **Configure Security Policies**
   - Enable: CodeQL, Secret Scanning, Dependabot
   - Require: Branch protection, 2FA, signed commits
   - Document: Security guidelines for team

#### For Migration:
1. **Audit Current Setup**
   - List: All repositories, users, integrations
   - Document: CI/CD pipelines, webhooks, API tokens
   - Estimate: Time and resources needed

2. **Contact Migration Team**
   - Email: migrations@github.com
   - Provide: Current platform, number of repos, timeline
   - Request: Migration plan and assistance

3. **Test Migration**
   - Migrate: 1-2 test repositories first
   - Verify: Actions, webhooks, integrations work
   - Iterate: Fix issues before full migration

### Key Contacts Summary

| Purpose | Contact | URL/Email |
|---------|---------|-----------|
| **Enterprise Sales** | GitHub Sales | enterprise@github.com, 1-877-448-4820 |
| **Technical Support** | GitHub Enterprise Support | https://support.github.com/contact/enterprise |
| **Privacy/Compliance** | GitHub Privacy Team | privacy@github.com |
| **Migration Assistance** | GitHub Migration Team | migrations@github.com |
| **Law 25 Information** | Quebec CAI | https://www.cai.gouv.qc.ca |
| **Customer Success** | Assigned CSM | (Assigned during trial/purchase) |

### Resources for Team Onboarding

#### Documentation
- **GitHub Enterprise Docs**: https://docs.github.com/en/enterprise-cloud@latest
- **Actions Docs**: https://docs.github.com/en/actions
- **Security Best Practices**: https://docs.github.com/en/code-security
- **Copilot Docs**: https://docs.github.com/en/copilot

#### Training
- **GitHub Skills**: https://skills.github.com (Free interactive courses)
- **Actions Lab**: https://lab.github.com/githubtraining/github-actions:-hello-world
- **Security Training**: https://lab.github.com/githubtraining/security-strategy-essentials

#### Community
- **GitHub Community**: https://github.community
- **GitHub Support Community**: https://github.community/c/support
- **Changelog**: https://github.blog/changelog (Stay updated on new features)

---

## Audit & Compliance Checklist

Use this checklist for quarterly compliance reviews and audits:

### Data Protection (Law 25 Compliance)

- [ ] **Data Residency Confirmed**
  - [ ] Canadian data residency enabled for GitHub Enterprise
  - [ ] Data Processing Agreement (DPA) signed and filed
  - [ ] Data flow diagram documented (where data is stored, processed, transmitted)

- [ ] **Access Controls**
  - [ ] 2FA enabled for all users
  - [ ] SSO/SAML configured (if applicable)
  - [ ] IP allow lists configured (if applicable)
  - [ ] Least privilege principle applied (users have minimum necessary access)

- [ ] **Audit Logging**
  - [ ] Audit log streaming enabled
  - [ ] Logs retained for 1+ year
  - [ ] Logs reviewed monthly for suspicious activity
  - [ ] Incident response plan documented

- [ ] **Breach Notification Process**
  - [ ] 72-hour reporting procedure documented
  - [ ] CAI contact information accessible
  - [ ] Breach notification template prepared
  - [ ] Team trained on breach response

### Security Compliance

- [ ] **GitHub Advanced Security (GHAS)**
  - [ ] CodeQL enabled on all repositories
  - [ ] Secret scanning enabled (public and private repos)
  - [ ] Dependabot alerts enabled
  - [ ] Push protection enabled

- [ ] **Branch Protection**
  - [ ] Main branch protected (no direct pushes)
  - [ ] Required status checks (CodeQL, CI/CD)
  - [ ] Required pull request reviews (1+ approvals)
  - [ ] Signed commits enforced

- [ ] **Dependency Management**
  - [ ] Dependabot security updates enabled
  - [ ] Dependencies reviewed quarterly
  - [ ] Vulnerable dependencies patched within 30 days

### Operations & Infrastructure

- [ ] **Self-Hosted Runners (if applicable)**
  - [ ] Runners updated to latest version
  - [ ] OS and drivers patched
  - [ ] GPU health checked (nvidia-smi)
  - [ ] Security isolation verified (no public repo access)

- [ ] **Actions Usage**
  - [ ] Monthly usage reviewed
  - [ ] Spending within budget
  - [ ] Workflows optimized (caching, matrix builds)
  - [ ] Unnecessary workflows disabled

- [ ] **Billing & Licensing**
  - [ ] User seats reviewed (remove inactive users)
  - [ ] Usage reports downloaded and filed
  - [ ] Budget approved for next quarter
  - [ ] Renewal date tracked (if annual contract)

### Documentation & Training

- [ ] **Documentation Updated**
  - [ ] This FAQ reviewed and updated quarterly
  - [ ] Internal documentation current
  - [ ] Runbooks for common tasks documented
  - [ ] Compliance certificates filed

- [ ] **Team Training**
  - [ ] New team members onboarded (GitHub Enterprise access, security training)
  - [ ] Security awareness training completed annually
  - [ ] CI/CD best practices reviewed
  - [ ] Law 25 compliance training for engineers

### Quarterly Review Dates

- **Q1 (March)**: Review completed on _______________
- **Q2 (June)**: Review completed on _______________
- **Q3 (September)**: Review completed on _______________
- **Q4 (December)**: Review completed on _______________

**Reviewed By:** _______________  
**Next Review Date:** _______________

---

## Appendix: Additional Resources

### GitHub Enterprise Documentation

- **Main Docs**: https://docs.github.com/en/enterprise-cloud@latest
- **Billing**: https://docs.github.com/en/billing/managing-billing-for-your-github-account
- **Security**: https://docs.github.com/en/code-security
- **Actions**: https://docs.github.com/en/actions
- **API**: https://docs.github.com/en/rest

### Quebec Law 25 Resources

- **CAI Official Site**: https://www.cai.gouv.qc.ca
- **Law 25 Overview**: https://www.quebec.ca/en/government/legal-and-administrative-framework/access-to-information/privacy-protection
- **Law 25 Full Text**: https://www.legisquebec.gouv.qc.ca/en/document/cs/P-39.1
- **Compliance Guide**: https://www.opc-bvp.gc.ca (Office of the Privacy Commissioner of Canada)

### GPU & AI Resources

- **NVIDIA Container Toolkit**: https://github.com/NVIDIA/nvidia-container-toolkit
- **CUDA Installation**: https://developer.nvidia.com/cuda-downloads
- **Docker GPU Support**: https://docs.docker.com/config/containers/resource_constraints/#gpu
- **OpenAI API**: https://platform.openai.com/docs/guides/production-best-practices

### Migration Tools

- **GitHub Importer**: https://docs.github.com/en/migrations/importing-source-code/using-github-importer
- **GitHub CLI**: https://cli.github.com
- **Git LFS Migration**: https://github.com/git-lfs/git-lfs/wiki/Tutorial#migrating-existing-repository-data-to-lfs

---

## Document Maintenance

**Maintained By:** GitHub Enterprise Administrator / DevOps Team  
**Last Updated:** December 3, 2025  
**Version:** 1.0  
**Next Review:** March 2026 (Q1 review)

**Change Log:**

| Date | Version | Changes | Updated By |
|------|---------|---------|------------|
| Dec 3, 2025 | 1.0 | Initial document creation | GitHub Copilot Agent |

**Review Schedule:**
- **Quarterly Reviews**: March, June, September, December
- **Ad-hoc Updates**: When GitHub releases major feature updates or pricing changes
- **Compliance Updates**: When Quebec Law 25 regulations are updated

---

**Questions or Updates?**

Contact the GitHub Enterprise Administrator or open an issue in this repository.

**Document Path:** `docs/GITHUB_ENTERPRISE_FAQ_AND_COMPLIANCE.md`
