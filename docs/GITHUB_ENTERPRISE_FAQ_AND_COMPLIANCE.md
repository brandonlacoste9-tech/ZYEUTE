# GitHub Enterprise FAQ & Compliance Guide for Zyeuté

> **For:** Zyeuté - L'app sociale du Québec  
> **Last Updated:** December 3, 2025  
> **Purpose:** Comprehensive guide for GitHub Enterprise adoption, Quebec/Canada compliance, and operational considerations

---

## Table of Contents

1. [Overview](#overview)
2. [Canada Data Residency & Sovereignty](#canada-data-residency--sovereignty)
3. [Law 25 Compliance](#law-25-compliance)
4. [Self-Hosted GPU Runners](#self-hosted-gpu-runners)
5. [GitHub Actions Limits & Optimization](#github-actions-limits--optimization)
6. [GitHub Enterprise Server](#github-enterprise-server)
7. [Trial, Demo & Pricing](#trial-demo--pricing)
8. [Migration Process](#migration-process)
9. [Security & Access Control](#security--access-control)
10. [Next Steps Checklist](#next-steps-checklist)
11. [FAQs](#faqs)
12. [Additional Resources](#additional-resources)

---

## Overview

This document addresses common questions about adopting **GitHub Enterprise Cloud** for Zyeuté, a Quebec-based social media platform serving 9 million Quebecers. It covers:

- **Compliance**: Meeting Quebec's Law 25 and Canadian data protection requirements
- **Infrastructure**: Self-hosted GPU runners for AI workloads (Ti-Guy features)
- **Cost Management**: Understanding limits, pricing, and optimization strategies
- **Migration**: Transitioning from current setup to Enterprise
- **Future-Proofing**: Preparing for audits, growth, and regulatory changes

### Why GitHub Enterprise for Zyeuté?

Zyeuté requires:
- ✅ **Advanced Security**: CodeQL, secret scanning, push protection for 9 million users' data
- ✅ **Compliance**: GDPR-like capabilities for Law 25 (Quebec privacy law)
- ✅ **AI Infrastructure**: Self-hosted GPU runners for Ti-Guy Artiste, Ti-Guy Studio, Ti-Guy Assistant
- ✅ **Scale**: Support for growing team and increasingly complex CI/CD pipelines
- ✅ **Audit Trail**: Comprehensive logging for regulatory compliance

---

## Canada Data Residency & Sovereignty

### Q: Where does GitHub Enterprise Cloud store data?

**A:** GitHub Enterprise Cloud stores data in **multiple global regions**, including:
- **Primary**: United States (US East, US West)
- **Europe**: EU regions for European customers
- **Asia Pacific**: Australia, Japan, Singapore

**Important**: As of December 2025, GitHub does **not offer Canada-specific data residency** for Enterprise Cloud.

### Q: Can I ensure data stays in Canada?

**A:** There are two approaches:

#### Option 1: GitHub Enterprise Server (On-Premises)
- **✅ Full Control**: Host on Canadian servers (AWS Canada, Azure Canada, OVH Canada)
- **✅ Data Sovereignty**: All repository data, user information, and logs stay in Canada
- **✅ Compliance**: Meet strict data residency requirements
- **❌ Management Overhead**: You maintain the infrastructure, updates, and backups
- **Cost**: License included with Enterprise Cloud subscription + infrastructure costs

#### Option 2: Hybrid Approach (Recommended for Zyeuté)
- **GitHub Enterprise Cloud**: For version control, collaboration, CI/CD orchestration
- **Self-Hosted Runners in Canada**: For sensitive workloads and data processing
- **Data Minimization**: Only code and public metadata in US; sensitive data processed in Canada
- **✅ Best Balance**: GitHub manages platform; you control sensitive operations

### Q: What data is stored in GitHub's infrastructure?

When using GitHub Enterprise Cloud, the following data is stored in GitHub's US data centers:

**Stored in GitHub Cloud:**
- Repository code and history
- Issues, PRs, and discussions
- User profiles and authentication data
- Audit logs
- CI/CD logs (GitHub Actions)
- Packages (GitHub Packages)

**Can Stay in Canada:**
- Database records (Supabase with Canada region)
- User-uploaded media (Supabase Storage with Canada bucket)
- Payment data (Stripe with Canada region)
- AI model inference (self-hosted GPU runners in Canada)
- Application data and user content

### Q: Does GitHub Enterprise Cloud comply with Canadian privacy laws?

**A:** Yes, with considerations:

✅ **GitHub's Compliance:**
- GDPR compliant (similar to Law 25)
- SOC 2 Type II certified
- ISO 27001 certified
- Data Processing Addendum (DPA) available
- Standard Contractual Clauses (SCC) for cross-border data transfer

⚠️ **Your Responsibility:**
- Minimize sensitive data in repositories (no PII, credentials, or user data in code)
- Use self-hosted runners for sensitive operations
- Implement data classification (public vs. sensitive code)
- Document data flows for compliance audits
- Use GitHub Enterprise Server if absolute data residency is required

### Recommendation for Zyeuté:

**Use GitHub Enterprise Cloud with Canadian self-hosted runners:**
1. Source code and CI/CD orchestration in GitHub Cloud (US)
2. Sensitive operations (AI inference, data processing) on Canadian runners
3. User data and media in Supabase Canada region
4. Document data flow: "Source code in US, user data in Canada"

This balances compliance, cost, and maintainability.

---

## Law 25 Compliance

### What is Law 25?

**Law 25** (Quebec's Bill 64) modernizes Quebec's private sector privacy law, bringing it closer to GDPR standards. Effective **September 2023** (phased implementation through 2024).

### Key Requirements for Zyeuté:

1. **Consent**: Obtain clear, informed consent for data collection
2. **Transparency**: Inform users how their data is used
3. **Data Minimization**: Collect only necessary data
4. **Right to Portability**: Allow users to export their data
5. **Right to Deletion**: Allow users to request deletion
6. **Security**: Implement reasonable safeguards
7. **Breach Notification**: Notify users and regulators of breaches
8. **Privacy Impact Assessments (PIA)**: For high-risk processing

### How GitHub Enterprise Helps:

| Law 25 Requirement | GitHub Enterprise Feature | Implementation |
|-------------------|---------------------------|----------------|
| **Security Safeguards** | CodeQL, Secret Scanning, Push Protection | ✅ Automated security scanning |
| **Audit Trail** | Audit Logs, Webhook Events | ✅ 90-day retention, exportable logs |
| **Access Control** | SSO, 2FA, IP Allow Lists | ✅ Enforce MFA, restrict by location |
| **Data Processing Agreement** | GitHub DPA | ✅ Sign DPA for cross-border compliance |
| **Breach Detection** | Secret Scanning, Dependabot Alerts | ✅ Real-time vulnerability detection |
| **Incident Response** | Audit Logs, Security Advisories | ✅ Track all access and changes |

### GitHub Enterprise Cloud and Law 25:

✅ **Acceptable for Code Repositories:**
- Source code is not personal information under Law 25
- GitHub's security measures exceed "reasonable safeguards" requirement
- Audit logs provide transparency for compliance reviews

⚠️ **Not for User Data:**
- Don't store Zyeuté user data (profiles, posts, messages) in GitHub repos
- Don't commit database exports with PII
- Don't include user emails, phone numbers, or personal info in code comments

### Compliance Checklist for Zyeuté:

- [x] **Code Repository**: GitHub Enterprise Cloud (US) - ✅ Acceptable
- [x] **User Data**: Supabase (Canada region) - ✅ Required
- [x] **Media Storage**: Supabase Storage (Canada) - ✅ Required
- [x] **Payment Data**: Stripe (Canada region) - ✅ Required
- [ ] **AI Processing**: Self-hosted GPU runners (Canada) - ⏳ Recommended
- [ ] **CI/CD Logs**: GitHub Actions + Canadian runners - ⏳ For sensitive operations
- [ ] **Privacy Policy**: Document data flow and third-party services - ⏳ Required
- [ ] **Data Processing Agreement**: Sign GitHub's DPA - ⏳ Before production
- [ ] **Privacy Impact Assessment**: Conduct PIA for AI features - ⏳ Required for Law 25

### Recommended Actions:

1. **Document Data Flow**:
   ```
   - Source Code: GitHub (US) - Low risk (no PII)
   - User Data: Supabase (Canada) - High risk (PII) - Compliant
   - AI Processing: Self-hosted runners (Canada) - Medium risk - Compliant when implemented
   ```

2. **Sign GitHub's DPA**:
   - Available in Enterprise settings
   - Covers cross-border data transfer
   - Aligns with Law 25 requirements

3. **Update Privacy Policy**:
   - Disclose that development infrastructure (GitHub) is US-based
   - Clarify that user data stays in Canada (Supabase)
   - Document third-party services (GitHub, Stripe, OpenAI)

4. **Conduct Privacy Impact Assessment (PIA)**:
   - Assess risk of storing code in US
   - Document mitigation: no PII in repos, self-hosted runners for sensitive ops
   - Review annually

5. **Implement Data Minimization**:
   - Use `.gitignore` to exclude data files
   - Never commit database dumps or user exports
   - Use environment variables for all credentials

### Law 25 Compliance Statement (for audits):

> "Zyeuté uses GitHub Enterprise Cloud for source code management and CI/CD orchestration. Source code does not contain personal information. All user data, including profiles, posts, and media, is stored in Supabase Canada region. Sensitive operations (AI inference) are executed on self-hosted GPU runners in Canadian data centers. A Data Processing Agreement (DPA) is in place with GitHub for cross-border data transfer. We have conducted a Privacy Impact Assessment and determined that this architecture meets Law 25 requirements for data protection and security."

**Verdict**: ✅ GitHub Enterprise Cloud is **compliant for Zyeuté's use case** (source code only).

---

## Self-Hosted GPU Runners

### Why Self-Hosted GPU Runners for Zyeuté?

Zyeuté's AI features (Ti-Guy Artiste, Ti-Guy Studio, Ti-Guy Assistant) require GPU compute for:
- **DALL-E 3 Image Generation**: Currently via OpenAI API (external)
- **Video Captioning**: GPT-4 for Joual captions (external)
- **Future**: Self-hosted AI models for cost reduction and data control

### Q: What are self-hosted runners?

**A:** Self-hosted runners are machines you manage that execute GitHub Actions workflows. Unlike GitHub-hosted runners (free tier: 2,000 minutes/month), self-hosted runners:
- Run on your infrastructure (AWS, Azure, on-prem)
- No minute limits (pay only for infrastructure)
- Support specialized hardware (GPUs, TPUs, high-memory)
- Keep data in your network (Canada compliance)

### Q: Can I use GPUs with GitHub Actions?

**A:** Yes! GitHub-hosted runners don't include GPUs, but self-hosted runners can:

**GPU Options:**
1. **AWS EC2 (Canada-Central-1)**:
   - Instance: `g4dn.xlarge` (NVIDIA T4 GPU, 4 vCPU, 16 GB RAM)
   - Cost: ~$0.71/hour (~$520/month if 24/7)
   - Best for: Small-scale AI inference, development

2. **Azure Canada Central**:
   - Instance: `Standard_NC6s_v3` (NVIDIA V100 GPU)
   - Cost: ~$3.00/hour (~$2,200/month if 24/7)
   - Best for: Production AI workloads

3. **OVH Canada (Quebec Data Centers)**:
   - GPU Instances: NVIDIA Tesla T4, RTX series
   - Cost: ~$0.50-$1.50/hour (~$365-$1,100/month)
   - Best for: Cost-effective, Canada-only option

4. **On-Premises (Future)**:
   - Buy GPU server once, no recurring cloud costs
   - Full control, but requires maintenance
   - Best for: Long-term, high-volume workloads

### Q: How do I set up self-hosted GPU runners?

**Step-by-Step Setup:**

#### 1. Provision GPU Instance in Canada

**Example: AWS EC2 in Canada-Central-1**
```bash
# Launch GPU instance
aws ec2 run-instances \
  --region ca-central-1 \
  --image-id ami-0c9bfc21ac5bf10eb \  # Ubuntu 22.04
  --instance-type g4dn.xlarge \
  --key-name zyeute-gpu-runner \
  --security-group-ids sg-xxx \
  --subnet-id subnet-xxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=zyeute-gpu-runner}]'
```

#### 2. Install NVIDIA Drivers and CUDA
```bash
# SSH into instance
ssh -i zyeute-gpu-runner.pem ubuntu@<instance-ip>

# Install NVIDIA drivers
sudo apt update
sudo apt install -y ubuntu-drivers-common
sudo ubuntu-drivers autoinstall

# Install CUDA Toolkit (for AI libraries)
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-ubuntu2204.pin
sudo mv cuda-ubuntu2204.pin /etc/apt/preferences.d/cuda-repository-pin-600
sudo apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/3bf863cc.pub
sudo add-apt-repository "deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/ /"
sudo apt update
sudo apt install -y cuda

# Verify GPU
nvidia-smi  # Should show NVIDIA T4
```

#### 3. Install GitHub Actions Runner
```bash
# Create runner directory
mkdir actions-runner && cd actions-runner

# Download runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure runner
# Get token from: GitHub > Settings > Actions > Runners > New self-hosted runner
./config.sh --url https://github.com/brandonlacoste9-tech/Zyeute --token <YOUR_TOKEN> \
  --name gpu-runner-canada-1 \
  --labels ubuntu-latest,gpu,canada,x64

# Install as service (runs on boot)
sudo ./svc.sh install
sudo ./svc.sh start

# Verify
sudo ./svc.sh status
```

#### 4. Update GitHub Actions Workflow

```yaml
# .github/workflows/ai-inference.yml
name: AI Inference

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  generate-images:
    runs-on: [self-hosted, gpu, canada]  # Use self-hosted GPU runner
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install AI dependencies
        run: |
          pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
          pip install transformers diffusers accelerate
      
      - name: Run AI inference
        env:
          HF_TOKEN: ${{ secrets.HUGGINGFACE_TOKEN }}
        run: |
          python scripts/generate_images.py
      
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: generated-images
          path: output/
```

### Q: What are the costs?

**Self-Hosted GPU Runner Cost Comparison:**

| Option | Setup | Monthly Cost | Pros | Cons |
|--------|-------|-------------|------|------|
| **No GPU Runners** | $0 | $0 | Simple, no maintenance | Limited to OpenAI API ($$$), no custom models |
| **AWS g4dn.xlarge (24/7)** | $0 | ~$520 | Easy to provision, scalable | Expensive if always-on |
| **AWS g4dn.xlarge (on-demand)** | $0 | ~$50-$200 | Pay only when running | Requires auto-scaling setup |
| **Azure NC6s_v3 (on-demand)** | $0 | ~$200-$800 | More powerful GPU | Higher cost per hour |
| **OVH Canada GPU (24/7)** | $0 | ~$365 | Cheaper, Canada-only | Less mature platform |
| **GitHub Actions (no GPU)** | Free | $0 (2,000 min) | No setup | No GPU support, limited minutes |

**Recommendation for Zyeuté (Phase 1):**
- **Use OpenAI API** for now (Ti-Guy features already implemented)
- **Plan self-hosted runners** for Phase 2 when:
  - AI usage exceeds $500/month
  - Need custom models (fine-tuned for Joual)
  - Want full data control (Law 25 compliance)

**Recommendation for Zyeuté (Phase 2):**
- **AWS EC2 g4dn.xlarge (on-demand)** in Canada-Central-1
- Auto-start runner when AI job is queued
- Auto-stop after job completes
- Estimated cost: ~$100-$300/month (vs. $500+ for OpenAI API at scale)

### Q: Can I run Ti-Guy features on self-hosted runners?

**A:** Yes, but requires changes:

**Current Setup (OpenAI API):**
```typescript
// src/services/openaiService.ts
const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: prompt,
});
```

**Future Setup (Self-Hosted Stable Diffusion):**
```typescript
// src/services/selfHostedAI.ts
const response = await fetch('https://gpu-runner.zyeute.ca/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt }),
});
```

**Self-Hosted AI Stack:**
- **Model**: Stable Diffusion XL (open-source alternative to DALL-E)
- **Inference Server**: HuggingFace Text Generation Inference or vLLM
- **Deployment**: Docker on GPU runner, exposed via API gateway
- **Security**: VPN or private subnet, API key authentication

**Pros:**
- ✅ Cost reduction (~$0.10 vs. $0.40 per image)
- ✅ Data stays in Canada
- ✅ Customizable models (fine-tune for Quebec culture)
- ✅ No API rate limits

**Cons:**
- ❌ Maintenance overhead
- ❌ Upfront learning curve
- ❌ Slightly lower quality than DALL-E 3 (but improving)

**Timeline:**
- **Phase 1 (Now - Q1 2026)**: Use OpenAI API, focus on product-market fit
- **Phase 2 (Q2 2026+)**: Migrate to self-hosted if usage justifies cost

---

## GitHub Actions Limits & Optimization

### Q: What are GitHub Actions limits?

**GitHub Actions Limits by Plan:**

| Plan | Minutes/Month | Concurrent Jobs | Storage | Cost Overages |
|------|--------------|-----------------|---------|---------------|
| **Free (Public Repos)** | Unlimited | 20 | 500 MB | N/A |
| **Free (Private Repos)** | 2,000 | 20 | 500 MB | $0.008/min |
| **Team** | 3,000 | 60 | 2 GB | $0.008/min |
| **Enterprise Cloud** | 50,000 | 180 | 50 GB | $0.008/min |

**Self-Hosted Runners:**
- ✅ **No minute limits** (you pay for infrastructure)
- ✅ **No concurrent job limits** (depends on your runners)
- ✅ **No storage limits** (your infrastructure)

**Zyeuté's Current Usage (Estimate):**
- **CircleCI** (primary CI/CD): ~$0/month (free tier)
- **GitHub Actions** (minimal usage): ~100 minutes/month
- **Future (with AI)**: Could exceed 2,000 minutes/month

### Q: How can I optimize GitHub Actions usage?

**Optimization Strategies:**

#### 1. Use Self-Hosted Runners for Long Jobs
```yaml
# Expensive on GitHub-hosted runners (20 min = $0.16)
jobs:
  build:
    runs-on: ubuntu-latest  # GitHub-hosted

# Free on self-hosted runners (infinite minutes)
jobs:
  build:
    runs-on: self-hosted  # Your infrastructure
```

#### 2. Cache Dependencies
```yaml
- name: Cache Node.js modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```
**Savings**: 2-5 minutes per build = ~40% reduction

#### 3. Parallelize Jobs
```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20]  # Run tests in parallel
    runs-on: ubuntu-latest
```
**Savings**: 2x faster (but same total minutes)

#### 4. Use Conditionals
```yaml
- name: Run expensive tests
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  run: npm run test:e2e
```
**Savings**: Skip expensive jobs on non-main branches

#### 5. Self-Hosted Runners for GPU/AI
```yaml
jobs:
  ai-inference:
    runs-on: [self-hosted, gpu]  # No minute charges
```
**Savings**: 100% of AI workload minutes

### Q: What's the monthly cost estimate for Zyeuté?

**Estimated GitHub Actions Usage:**

| Scenario | Minutes/Month | Cost (Enterprise) | With Self-Hosted GPU |
|----------|--------------|-------------------|----------------------|
| **Current (Minimal)** | 100 | $0 (within 50,000) | N/A |
| **Phase 1 (CI/CD)** | 2,000 | $0 (within 50,000) | N/A |
| **Phase 2 (AI)** | 10,000 | $0 (within 50,000) | N/A |
| **Phase 3 (Scale)** | 60,000 | $80 overage | $0 (GPU runner: $300) |

**Recommendation:**
- **Year 1**: GitHub Actions is essentially free (50,000 min/month is generous)
- **Year 2+**: Consider self-hosted runners if usage exceeds 50,000 min/month

### Q: Can I mix GitHub-hosted and self-hosted runners?

**A:** Yes! Best practice:

```yaml
jobs:
  # Fast, lightweight jobs → GitHub-hosted (no maintenance)
  lint:
    runs-on: ubuntu-latest
  
  type-check:
    runs-on: ubuntu-latest
  
  # Long, expensive jobs → Self-hosted (cost savings)
  build:
    runs-on: self-hosted
  
  # GPU-required jobs → Self-hosted GPU (no alternative)
  ai-inference:
    runs-on: [self-hosted, gpu, canada]
```

**Benefit**: Optimize cost without sacrificing convenience.

---

## GitHub Enterprise Server

### Q: What is GitHub Enterprise Server?

**A:** GitHub Enterprise Server (GHES) is a **self-hosted version** of GitHub that runs on your infrastructure. Think of it as "GitHub on-premises."

**Key Differences:**

| Feature | Enterprise Cloud | Enterprise Server |
|---------|------------------|-------------------|
| **Hosting** | GitHub manages (US) | You manage (Canada) |
| **Updates** | Automatic | Manual (quarterly releases) |
| **Data Location** | US (primarily) | Your choice (Canada) |
| **License** | Per-user/month | Included with Cloud subscription |
| **Maintenance** | GitHub | Your team |
| **Scalability** | Unlimited | Limited by your hardware |
| **Cost** | $21/user/month | License free + infrastructure |

### Q: Is GitHub Enterprise Server included with Enterprise Cloud?

**A:** **Yes!** If you subscribe to GitHub Enterprise Cloud, you get GHES licenses at **no additional cost** per user.

**What You Pay:**
- ✅ **GitHub Enterprise Cloud**: $21/user/month
- ✅ **GitHub Enterprise Server Licenses**: Included (no extra per-user fee)
- ❌ **Infrastructure**: You pay (servers, storage, networking)

**Example Cost:**
- **5 developers** on Enterprise Cloud: $105/month
- **GHES License**: $0/month (included)
- **Infrastructure** (AWS/Azure/OVH): $200-$1,000/month (depending on scale)
- **Total**: $305-$1,105/month

### Q: Should Zyeuté use GitHub Enterprise Server?

**Considerations:**

**Pros:**
- ✅ **Full Data Sovereignty**: All data in Canada (meets Law 25 strictly)
- ✅ **Customization**: Install custom plugins, modify UI
- ✅ **Airgapped Option**: Can run offline (not needed for Zyeuté)
- ✅ **Compliance**: Easier to certify for government contracts

**Cons:**
- ❌ **Maintenance**: Your team manages updates, backups, security patches
- ❌ **Complexity**: Requires DevOps expertise (Kubernetes, HA setup)
- ❌ **Infrastructure Cost**: $200-$1,000+/month for VMs, storage, backups
- ❌ **Delayed Features**: New GitHub features arrive months later on GHES
- ❌ **Single Point of Failure**: If your server goes down, GitHub is down

**Recommendation for Zyeuté:**

**Phase 1 (Now - 2026): Enterprise Cloud** ✅
- Source code doesn't contain PII (Law 25 compliant)
- Self-hosted runners for sensitive operations
- Focus on product development, not infrastructure

**Phase 2 (2027+): Re-evaluate GHES if:**
- Government contracts require strict data residency
- Compliance costs exceed infrastructure costs
- Team has DevOps resources for maintenance

**Verdict**: ❌ **Not recommended for Zyeuté now**. Complexity outweighs benefits.

### Q: Can I run a hybrid setup (Cloud + Server)?

**A:** Yes! GitHub supports **GitHub Connect** to sync between Cloud and Server:

**Use Cases:**
1. **Development on Cloud**: Fast iteration, low maintenance
2. **Production on Server**: Deploy from on-prem for compliance

**Setup:**
```
GitHub Enterprise Cloud (US) ← Code, PRs, Issues
          ↓ Sync (GitHub Connect)
GitHub Enterprise Server (Canada) ← Production deployments
```

**Benefit**: Best of both worlds, but adds complexity.

**Verdict for Zyeuté**: ⚠️ **Overkill**. Use Cloud + self-hosted runners instead.

---

## Trial, Demo & Pricing

### Q: Can I try GitHub Enterprise before purchasing?

**A:** Yes! GitHub offers:

1. **30-Day Free Trial**:
   - Full access to Enterprise Cloud features
   - No credit card required
   - Convert to paid plan anytime
   - Link: [GitHub Enterprise Trial](https://github.com/enterprise/trial)

2. **Demo/Sandbox Account**:
   - Contact GitHub Sales for a demo environment
   - Sales engineers walk you through features
   - Can test with sample repositories

3. **Feature Previews**:
   - Many Enterprise features have free previews on Team plan
   - Test CodeQL, Copilot, etc., before committing

### Q: What's the pricing breakdown?

**GitHub Enterprise Cloud Pricing (as of December 2025):**

| Plan | Price (USD/user/month) | Billed Annually | Features |
|------|------------------------|-----------------|----------|
| **Free** | $0 | N/A | Public repos, 2,000 Actions minutes, basic features |
| **Team** | $4 | $48/year | Private repos, 3,000 Actions minutes, protected branches |
| **Enterprise Cloud** | $21 | $252/year | All Team + GHES, GHAS, SSO, audit logs, 50,000 Actions minutes |

**Add-Ons (Optional):**

| Add-On | Price | Included in Enterprise? |
|--------|-------|-------------------------|
| **GitHub Advanced Security (GHAS)** | Free for public repos | ✅ Yes (private repos) |
| **GitHub Copilot Enterprise** | $39/user/month | ❌ No (separate purchase) |
| **GitHub Actions Overages** | $0.008/minute | ✅ Yes (50,000 min included) |
| **GitHub Packages Storage** | $0.25/GB/month | ✅ Yes (50 GB included) |

**Example: Zyeuté Team (5 developers)**

| Item | Quantity | Price | Total |
|------|----------|-------|-------|
| Enterprise Cloud | 5 users | $21/user/month | $105/month |
| GHAS (CodeQL, Secret Scanning) | Included | $0 | $0 |
| GitHub Actions | 50,000 min included | $0 | $0 |
| **Total (Year 1)** | - | - | **$1,260/year** |

**With Copilot Enterprise (Optional):**
- **Copilot Enterprise**: 5 users × $39/month = $195/month
- **Total with Copilot**: $105 + $195 = **$300/month** ($3,600/year)

### Q: Are there discounts for startups or nonprofits?

**A:** Yes:

1. **GitHub for Startups**:
   - **Eligibility**: Seed to Series A funding, partner accelerator (Y Combinator, Techstars, etc.)
   - **Benefit**: Up to $25,000 in credits (covers 1-2 years of Enterprise Cloud)
   - **Application**: [GitHub Startups Program](https://github.com/enterprise/startups)

2. **GitHub Sponsors (Open Source)**:
   - **Eligibility**: Open-source maintainers with public repos
   - **Benefit**: Free Teams/Enterprise features for OSS projects
   - **Note**: Zyeuté is proprietary, so not applicable

3. **Volume Discounts**:
   - **10+ users**: 5-10% discount
   - **50+ users**: 15-20% discount
   - **100+ users**: Custom pricing (contact sales)

**Zyeuté Opportunity:**
- ✅ **Apply to GitHub for Startups** if eligible (accelerator partnership)
- ✅ **Negotiate** if scaling to 10+ developers

### Q: What's the difference between monthly and annual billing?

| Billing | Price (Enterprise Cloud) | Commitment | Flexibility |
|---------|--------------------------|------------|-------------|
| **Monthly** | $21/user/month | None (cancel anytime) | High |
| **Annual** | $252/user/year ($21/month equivalent) | 1 year | Low |

**Savings**: None (same price), but annual billing often qualifies for startup credits.

**Recommendation**: Start with **monthly** to test, switch to **annual** once committed.

### Q: What if I exceed 50,000 Actions minutes?

**Overage Pricing:**
- **$0.008/minute** for minutes beyond 50,000
- Example: 60,000 minutes = 10,000 overage = 10,000 × $0.008 = **$80 extra**

**Alternatives:**
1. **Self-Hosted Runners**: No minute charges (pay for infrastructure)
2. **Optimize Workflows**: Cache, parallelize, skip non-critical jobs
3. **Upgrade to More Users**: 50,000 min/month per org (not per user), so no benefit

**Zyeuté Reality**: 50,000 minutes is **very generous** (~28 hours of compute). Unlikely to exceed in Year 1.

### Q: Can I negotiate pricing with GitHub?

**A:** Yes, for:
- **Startups**: Apply for credits ($5,000-$25,000)
- **Large Teams**: Volume discounts (10+ users)
- **Long-Term Contracts**: Multi-year commitments (2-3 years) may get 10-15% off
- **Educational/Research Use**: Sometimes eligible for nonprofit pricing

**How to Negotiate:**
1. Contact [GitHub Sales](https://github.com/enterprise/contact)
2. Share your use case (Quebec social media platform, 9M users)
3. Highlight growth potential (scaling team, high profile)
4. Ask about startup programs or pilot pricing

**Zyeuté Pitch:**
> "We're building Quebec's first social media platform for 9 million users. We're early-stage but expect rapid growth. Is there a startup program or pilot pricing we can leverage?"

---

## Migration Process

### Q: How do I migrate from current setup to GitHub Enterprise Cloud?

**Zyeuté's Current Setup:**
- **Repository**: GitHub Free (public repo)
- **CI/CD**: CircleCI (free tier)
- **Team**: 1-2 developers

**Migration Path:**

#### Phase 1: Enable Enterprise Features (Week 1)

**Step 1: Upgrade Organization to Enterprise Cloud**
1. Go to **GitHub Organization Settings** → **Billing**
2. Click **Upgrade to Enterprise Cloud**
3. Enter payment method (or apply startup credits)
4. Select monthly or annual billing

**Step 2: Enable GitHub Advanced Security (GHAS)**
1. Go to **Settings** → **Code security and analysis**
2. Enable:
   - ✅ **Dependabot alerts**
   - ✅ **Dependabot security updates**
   - ✅ **Secret scanning**
   - ✅ **Push protection**
   - ✅ **CodeQL analysis**

**Step 3: Configure Branch Protection**
1. Go to **Settings** → **Branches** → **main**
2. Enable:
   - ✅ Require pull request reviews (1 reviewer)
   - ✅ Require status checks (CircleCI, CodeQL)
   - ✅ Require conversation resolution
   - ✅ Restrict who can push (admins only)

#### Phase 2: Set Up Audit Logs (Week 2)

**Step 1: Enable Audit Log Streaming**
1. Go to **Enterprise Settings** → **Audit log**
2. Set up streaming to:
   - **Option 1**: AWS S3 bucket (Canada region)
   - **Option 2**: Azure Blob Storage (Canada)
   - **Option 3**: Splunk/Datadog (if you have SIEM)

**Step 2: Configure Alerts**
1. Set up alerts for:
   - New user added to organization
   - Secret detected in code
   - Failed login attempts (brute force detection)

#### Phase 3: Migrate CI/CD (Optional) (Week 3-4)

**Current**: CircleCI (free tier, working well)

**Options:**
1. **Keep CircleCI** (recommended): No migration needed, already integrated
2. **Migrate to GitHub Actions**: More GitHub-native, but requires rewriting workflows

**If Migrating to GitHub Actions:**

**CircleCI Config:**
```yaml
# .circleci/config.yml (existing)
version: 2.1
jobs:
  build:
    docker:
      - image: cimg/node:18.18
    steps:
      - checkout
      - run: npm ci
      - run: npm run build
      - run: npm test
```

**GitHub Actions Equivalent:**
```yaml
# .github/workflows/ci.yml (new)
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm test
```

**Migration Checklist:**
- [ ] Port CircleCI jobs to GitHub Actions workflows
- [ ] Test workflows on feature branch
- [ ] Update status checks in branch protection
- [ ] Remove CircleCI integration (after verification)

**Recommendation for Zyeuté**: **Keep CircleCI for now**. No need to migrate unless:
- You hit CircleCI's free tier limits
- You want to consolidate tools (GitHub-only)
- You need self-hosted GPU runners (easier with GitHub Actions)

#### Phase 4: Add Self-Hosted Runners (Future) (Month 2-3)

**When to Add:**
- AI workloads exceed $500/month on OpenAI API
- Need GPU for custom models
- Want Canada-only processing for compliance

**Steps:**
1. Provision GPU instance (AWS/Azure/OVH Canada)
2. Install GitHub Actions runner software
3. Configure runner with labels (`self-hosted`, `gpu`, `canada`)
4. Update workflows to use self-hosted runner
5. Test AI inference jobs

**Timeline**: Not urgent for Phase 1, plan for Q2 2026+.

### Q: What's the downtime during migration?

**A:** **Zero downtime**! Migration steps:
1. **Upgrade Plan**: Instant (no downtime)
2. **Enable Features**: Gradual (no breaking changes)
3. **CI/CD Migration**: Optional, can run in parallel

**Development Workflow**:
- Developers continue working normally
- No impact on existing PRs or branches
- New features available immediately

### Q: Do I need to migrate repositories?

**A:** No! Your repositories stay in the same GitHub organization. You're just:
- ✅ Upgrading the **plan** (Free → Enterprise)
- ✅ Enabling **features** (GHAS, audit logs, etc.)

No data migration or repository transfers needed.

### Q: Can I revert if I don't like Enterprise?

**A:** Yes, but:
- ✅ **Downgrade Plan**: Anytime (monthly billing)
- ⚠️ **Lose Features**: GHAS, audit logs, 50,000 Actions minutes revert to 2,000
- ❌ **No Refunds**: If on annual plan, charged for full year

**Recommendation**: Start with **monthly billing** to test for 1-2 months, then switch to annual if satisfied.

---

## Security & Access Control

### Q: What security features does GitHub Enterprise include?

**GitHub Advanced Security (GHAS):**

| Feature | Description | Benefit for Zyeuté |
|---------|-------------|-------------------|
| **CodeQL** | Automated code scanning | Detect SQL injection, XSS, RCE vulnerabilities |
| **Secret Scanning** | Find committed secrets | Prevent API key leaks, credentials exposure |
| **Push Protection** | Block secrets before commit | Real-time prevention, not just alerts |
| **Dependabot** | Dependency vulnerability alerts | Auto-update vulnerable packages (Supabase, Stripe, OpenAI SDKs) |
| **Security Advisories** | Private vulnerability reporting | Community can report bugs without public disclosure |
| **Supply Chain Security** | SBOM generation | Track all dependencies for audit compliance |

**Access Controls:**

| Feature | Description | Benefit for Zyeuté |
|---------|-------------|-------------------|
| **SSO/SAML** | Single Sign-On | Centralize authentication (optional for small teams) |
| **2FA Enforcement** | Require two-factor authentication | Protect against account takeovers |
| **IP Allow Lists** | Restrict by IP address | Limit access to office/VPN only |
| **Audit Logs** | Track all actions | Compliance, incident response |

### Q: How does GitHub Enterprise help with Law 25 compliance?

**Compliance Mapping:**

| Law 25 Requirement | GitHub Feature | How It Helps |
|-------------------|----------------|--------------|
| **Security Safeguards** | CodeQL, Secret Scanning | Automated vulnerability detection |
| **Audit Trail** | Audit Logs (90-day retention) | Track who accessed what, when |
| **Access Control** | 2FA, SSO, IP Allow Lists | Restrict unauthorized access |
| **Incident Response** | Security Advisories, Alerts | Real-time breach detection |
| **Data Minimization** | Push Protection | Prevent PII from being committed |

**Example Audit Response:**
> Q: "How do you protect user data in your source code?"  
> A: "We use GitHub Enterprise with push protection to prevent secrets and PII from being committed. CodeQL scans all code for vulnerabilities. Audit logs track all repository access for 90 days."

### Q: Should I enable SSO/SAML for Zyeuté?

**Single Sign-On (SSO) via SAML:**

**Pros:**
- ✅ Centralized authentication (Google Workspace, Okta, Azure AD)
- ✅ Disable GitHub access when employee leaves (auto-deprovision)
- ✅ Enforce organization-wide 2FA

**Cons:**
- ❌ Setup complexity (requires identity provider)
- ❌ Overkill for small teams (1-5 developers)

**Recommendation for Zyeuté:**
- **Phase 1 (1-5 devs)**: ❌ **Skip SSO**, use GitHub 2FA
- **Phase 2 (10+ devs)**: ✅ **Enable SSO** for centralized management

**Alternative**: Use GitHub's built-in 2FA enforcement (no SSO needed).

### Q: How do I enforce 2FA for all users?

**Step-by-Step:**
1. Go to **Organization Settings** → **Authentication security**
2. Enable **Require two-factor authentication**
3. Set grace period (e.g., 7 days for users to enable 2FA)
4. Users without 2FA will be locked out after grace period

**Supported Methods:**
- Authenticator apps (Google Authenticator, Authy)
- Hardware security keys (YubiKey, Google Titan)
- SMS (not recommended, less secure)

**Recommendation**: ✅ **Enable immediately** for all Zyeuté developers.

### Q: Should I use IP Allow Lists?

**IP Allow Lists**: Restrict GitHub access to specific IP addresses.

**Use Cases:**
- ✅ Office-only access (if you have a fixed office IP)
- ✅ VPN-only access (if team works remotely)
- ❌ Not for distributed teams with dynamic IPs

**Zyeuté Context:**
- If team works from **fixed office**: ✅ Enable IP Allow Lists
- If team works **remotely**: ❌ Use 2FA instead

**Setup:**
1. Go to **Organization Settings** → **IP allow list**
2. Add IP ranges:
   - Office: `203.0.113.0/24`
   - VPN: `198.51.100.0/24`
3. Enable **Allow list** (blocks all other IPs)

**Warning**: Test carefully! Misconfigured IP allow lists can lock you out.

---

## Next Steps Checklist

### Immediate Actions (Week 1-2)

- [ ] **Assess Readiness**
  - [ ] Review current GitHub usage and team size
  - [ ] Estimate future Actions minutes usage
  - [ ] Determine if self-hosted runners are needed (AI workloads)
  - [ ] Check if eligible for GitHub for Startups credits

- [ ] **Start GitHub Enterprise Trial**
  - [ ] Go to [GitHub Enterprise Trial](https://github.com/enterprise/trial)
  - [ ] Sign up with organization account (brandonlacoste9-tech)
  - [ ] No credit card required for 30-day trial

- [ ] **Enable Core Security Features**
  - [ ] Enable Dependabot alerts
  - [ ] Enable secret scanning
  - [ ] Enable push protection
  - [ ] Enable CodeQL analysis on main branch

- [ ] **Configure Branch Protection**
  - [ ] Require PR reviews (1+ reviewer)
  - [ ] Require status checks to pass (CircleCI, CodeQL)
  - [ ] Restrict push to main branch (admins only)

- [ ] **Document Compliance**
  - [ ] Create data flow diagram (code in US, user data in Canada)
  - [ ] Document where sensitive data is stored (Supabase Canada)
  - [ ] Prepare Law 25 compliance statement (see template above)

### Short-Term Actions (Month 1-2)

- [ ] **Audit Logs Setup**
  - [ ] Enable audit log streaming (AWS S3 Canada or Azure Blob)
  - [ ] Set up retention policy (90 days minimum for compliance)
  - [ ] Configure alerts for security events

- [ ] **Team Access Management**
  - [ ] Enforce 2FA for all organization members
  - [ ] Review and update team permissions
  - [ ] Remove inactive users

- [ ] **CI/CD Optimization**
  - [ ] Review current CircleCI usage (keep or migrate?)
  - [ ] Optimize GitHub Actions workflows (caching, parallelization)
  - [ ] Test self-hosted runner setup (if needed)

- [ ] **Privacy & Compliance**
  - [ ] Sign GitHub's Data Processing Agreement (DPA)
  - [ ] Update Zyeuté privacy policy to mention GitHub (US-based infrastructure)
  - [ ] Conduct Privacy Impact Assessment (PIA) for Law 25

- [ ] **Cost Management**
  - [ ] Set up billing alerts ($500/month threshold)
  - [ ] Monitor Actions minutes usage weekly
  - [ ] Apply for GitHub for Startups credits (if eligible)

### Medium-Term Actions (Month 3-6)

- [ ] **Self-Hosted GPU Runners** (if needed)
  - [ ] Provision GPU instance (AWS/Azure/OVH Canada)
  - [ ] Install GitHub Actions runner software
  - [ ] Configure runner with GPU support (NVIDIA drivers, CUDA)
  - [ ] Migrate AI workloads to self-hosted runner

- [ ] **Advanced Security**
  - [ ] Review CodeQL findings monthly
  - [ ] Set up custom secret scanning patterns (Zyeuté API keys)
  - [ ] Enable security advisories for vulnerability reporting

- [ ] **GitHub Enterprise Server** (if required)
  - [ ] Assess need for on-premises GitHub (data sovereignty)
  - [ ] Provision infrastructure (Kubernetes, HA setup)
  - [ ] Install and configure GitHub Enterprise Server
  - [ ] Set up GitHub Connect (sync with Cloud)

- [ ] **Copilot Enterprise** (optional)
  - [ ] Evaluate Copilot Enterprise for team productivity
  - [ ] Test Copilot Coding Agent for issue automation
  - [ ] Monitor usage and ROI (premium requests)

### Long-Term Actions (Year 1+)

- [ ] **Scale and Optimize**
  - [ ] Review GitHub Actions usage quarterly
  - [ ] Optimize workflows based on actual usage patterns
  - [ ] Scale self-hosted runners as AI usage grows

- [ ] **Compliance Maintenance**
  - [ ] Conduct annual Privacy Impact Assessment (PIA)
  - [ ] Review and update data flow documentation
  - [ ] Audit GitHub access logs quarterly

- [ ] **Team Growth**
  - [ ] Onboard new developers with security best practices
  - [ ] Implement developer training (secure coding, Law 25)
  - [ ] Review and adjust team permissions

- [ ] **Cost Review**
  - [ ] Compare actual costs vs. projections
  - [ ] Negotiate volume discounts if team exceeds 10 users
  - [ ] Evaluate self-hosted vs. cloud runners ROI

---

## FAQs

### General

**Q: Is GitHub Enterprise worth it for a small team (1-5 developers)?**

A: **Depends on priorities**:
- ✅ **Yes** if you need: Advanced security (GHAS), audit logs, compliance (Law 25), self-hosted runners
- ❌ **No** if: Team plan ($4/user/month) is sufficient, limited budget, no compliance requirements

For **Zyeuté**: ✅ **Yes**, because Law 25 compliance and future AI workloads justify Enterprise.

**Q: Can I use GitHub Enterprise with other CI/CD tools (CircleCI, Jenkins)?**

A: ✅ **Yes!** GitHub Actions is optional. Keep CircleCI, Jenkins, GitLab CI, or any CI/CD tool you already use.

**Q: What happens to my repositories during the upgrade?**

A: ✅ **Nothing changes**. Repositories stay in the same organization. You're just enabling new features (GHAS, audit logs, etc.).

**Q: Can I downgrade from Enterprise to Team/Free?**

A: ✅ **Yes**, but you lose: GHAS, audit logs, 50,000 Actions minutes, and GHES licenses. No data loss.

### Compliance & Data Residency

**Q: Does GitHub Enterprise Cloud meet GDPR requirements?**

A: ✅ **Yes**. GitHub is GDPR-compliant and offers a Data Processing Agreement (DPA).

**Q: Is GitHub Enterprise Cloud compliant with Quebec's Law 25?**

A: ✅ **Yes, for source code** (not PII). Sign DPA, document data flow, use self-hosted runners for sensitive ops.

**Q: Can I host GitHub Enterprise Server in Canada?**

A: ✅ **Yes**. You can host GHES on AWS Canada, Azure Canada, OVH Canada, or on-premises servers.

**Q: Do I need to notify users that I use GitHub (US-based)?**

A: ✅ **Yes**. Update your privacy policy to disclose that development infrastructure is US-based (GitHub), but user data is Canada-based (Supabase).

### Self-Hosted Runners & GPU

**Q: Are self-hosted runners free?**

A: ✅ **Yes** (no GitHub charges), but you pay for infrastructure (AWS/Azure/OVH).

**Q: Can I use self-hosted runners without GitHub Enterprise?**

A: ✅ **Yes**. Self-hosted runners are available on Free, Team, and Enterprise plans.

**Q: How do I auto-scale self-hosted runners?**

A: Use **actions-runner-controller** (Kubernetes) or **AWS Auto Scaling Groups** to spin up/down runners based on demand.

**Q: Can I use multiple self-hosted runners in different regions?**

A: ✅ **Yes**. Use labels to target specific runners (e.g., `canada`, `us-east`, `gpu`).

### Pricing & Billing

**Q: What's the minimum commitment for GitHub Enterprise?**

A: **No minimum** with monthly billing. Cancel anytime.

**Q: Are there hidden fees?**

A: ❌ **No**. Pricing is transparent:
- $21/user/month (Enterprise Cloud)
- $0.008/minute (Actions overages beyond 50,000 min/month)
- $0.25/GB/month (Packages storage beyond 50 GB)

**Q: Can I get a refund if I cancel?**

A: ✅ **Yes** (monthly billing), ❌ **No** (annual billing).

**Q: Is Copilot Enterprise included?**

A: ❌ **No**. Copilot Enterprise is a separate subscription ($39/user/month).

### GitHub Actions

**Q: Can I run Docker containers on GitHub Actions?**

A: ✅ **Yes**. GitHub-hosted runners support Docker. Self-hosted runners can too (if you install Docker).

**Q: Can I trigger workflows from external systems?**

A: ✅ **Yes**. Use `repository_dispatch` or `workflow_dispatch` events.

**Q: Can I reuse workflows across repositories?**

A: ✅ **Yes**. Use [reusable workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows).

**Q: Can I schedule workflows (cron jobs)?**

A: ✅ **Yes**. Use `schedule` trigger:
```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
```

### GitHub Enterprise Server

**Q: Do I need GitHub Enterprise Server for compliance?**

A: ❌ **Not usually**. GitHub Enterprise Cloud + self-hosted runners is sufficient for most compliance needs (including Law 25).

**Q: Can I run GitHub Enterprise Server on Kubernetes?**

A: ✅ **Yes**, but it's complex. GitHub provides [GHES on Kubernetes](https://docs.github.com/en/enterprise-server/admin/installation-configuration-and-management/installing-github-enterprise-server-on-kubernetes) documentation.

**Q: How often does GitHub Enterprise Server release updates?**

A: **Quarterly** (every 3 months). You must manually upgrade.

**Q: Can I connect GitHub Enterprise Server to GitHub.com (Cloud)?**

A: ✅ **Yes**, via **GitHub Connect** (syncs users, repos, issues).

---

## Additional Resources

### Official GitHub Documentation

- **GitHub Enterprise Plans**: [https://github.com/pricing](https://github.com/pricing)
- **GitHub Enterprise Trial**: [https://github.com/enterprise/trial](https://github.com/enterprise/trial)
- **GitHub Enterprise Server Docs**: [https://docs.github.com/en/enterprise-server](https://docs.github.com/en/enterprise-server)
- **GitHub Advanced Security**: [https://docs.github.com/en/code-security](https://docs.github.com/en/code-security)
- **GitHub Actions Docs**: [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
- **Self-Hosted Runners**: [https://docs.github.com/en/actions/hosting-your-own-runners](https://docs.github.com/en/actions/hosting-your-own-runners)
- **Audit Log Streaming**: [https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise](https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise)

### Law 25 & Compliance

- **Quebec Law 25 Overview**: [https://www.cai.gouv.qc.ca/loi-25/](https://www.cai.gouv.qc.ca/loi-25/)
- **GDPR Compliance Guide**: [https://gdpr.eu/](https://gdpr.eu/)
- **GitHub DPA (Data Processing Agreement)**: Available in Enterprise settings
- **GitHub Trust Center**: [https://github.com/trust](https://github.com/trust)

### Infrastructure & GPU Runners

- **AWS EC2 GPU Instances**: [https://aws.amazon.com/ec2/instance-types/g4/](https://aws.amazon.com/ec2/instance-types/g4/)
- **Azure GPU VMs**: [https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/)
- **OVH Canada**: [https://www.ovhcloud.com/en-ca/](https://www.ovhcloud.com/en-ca/)
- **NVIDIA GPU Cloud (NGC)**: [https://www.nvidia.com/en-us/gpu-cloud/](https://www.nvidia.com/en-us/gpu-cloud/)
- **Actions Runner Controller (Kubernetes)**: [https://github.com/actions/actions-runner-controller](https://github.com/actions/actions-runner-controller)

### Zyeuté-Specific Documentation

- **GitHub Enterprise Admin Setup**: See [`GITHUB_ENTERPRISE_ADMIN_SETUP.md`](./GITHUB_ENTERPRISE_ADMIN_SETUP.md)
- **Stripe Setup**: See [`STRIPE_WEBHOOK_SETUP.md`](../STRIPE_WEBHOOK_SETUP.md)
- **Database Setup**: See [`SETUP_GUIDE.md`](../SETUP_GUIDE.md)
- **Contributing**: See [`CONTRIBUTING.md`](../CONTRIBUTING.md)

### Contact & Support

- **GitHub Support**: [https://support.github.com/](https://support.github.com/)
- **GitHub Sales**: [https://github.com/enterprise/contact](https://github.com/enterprise/contact)
- **Zyeuté Issues**: [https://github.com/brandonlacoste9-tech/Zyeute/issues](https://github.com/brandonlacoste9-tech/Zyeute/issues)

---

## Document Maintenance

**Last Updated:** December 3, 2025  
**Next Review:** March 1, 2026 (Quarterly)  
**Maintained By:** Zyeuté DevOps Team  
**Feedback:** Open an issue or PR to update this document

### Changelog

| Date | Version | Changes |
|------|---------|---------|
| Dec 3, 2025 | 1.0 | Initial release - Comprehensive FAQ and compliance guide |

---

**🔥⚜️ Fait au Québec, pour le Québec 🇨🇦⚜️**

*Building Quebec's platform on world-class infrastructure* 🍌
