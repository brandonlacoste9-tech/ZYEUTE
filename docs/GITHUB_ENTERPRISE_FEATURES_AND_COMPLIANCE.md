# GitHub Enterprise Features & Compliance FAQ

> **For:** Small Teams in Quebec (Zyeuté Project)  
> **Updated:** December 3, 2025  
> **Purpose:** Enterprise readiness reference for scaling and compliance

---

## 📌 Important Note

**Most GitHub Enterprise features exceed what a single administrator or small team might need daily.** This document serves as a comprehensive reference for:

- Understanding what Enterprise offers as your team scales
- Preparing for compliance audits (Law 25, data residency)
- Evaluating cost-benefit for future upgrades
- Answering technical questions during funding or partnership discussions

**Current recommendation:** GitHub Team or Free tier may be sufficient for initial development. Use this document when you're ready to scale beyond 5-10 developers or require formal compliance certifications.

---

## 🇨🇦 Frequently Asked Questions (FAQ)

### 1. **Data Residency: Does GitHub support Canada-based data hosting?**

**Answer:** Yes, with **GitHub Enterprise Cloud** (not standard Team/Free plans).

**How it works:**

- GitHub offers **data residency** in specific regions including **Canada**
- Your organization's data (repositories, issues, wikis, Actions logs) is stored in Canadian data centers
- Metadata may still transit through US servers for certain operations, but primary data remains in Canada
- Requires coordination with GitHub Sales to provision

**Why it matters for Quebec:**

- Compliance with **Quebec Law 25** (Privacy Law)
- Satisfies data sovereignty requirements for government contracts
- Reduces latency for Canadian-based teams
- Aligns with provincial data protection regulations

**To request:**

1. Contact GitHub Enterprise Sales: https://github.com/enterprise/contact
2. Specify "Canada data residency" during provisioning
3. Confirm with your GitHub Account Manager during setup

**Documentation:**

- [GitHub Data Residency](https://docs.github.com/en/enterprise-cloud@latest/admin/configuration/configuring-your-enterprise/about-github-enterprise-cloud#data-residency)
- [GitHub Enterprise Cloud Features](https://docs.github.com/en/enterprise-cloud@latest)

---

### 2. **Law 25 Compliance: How does GitHub Enterprise help with Quebec's privacy law?**

**Answer:** GitHub Enterprise Cloud provides several features that support **Law 25** compliance (Quebec's equivalent to GDPR).

**Key compliance features:**

| **Law 25 Requirement**     | **GitHub Enterprise Solution**                         |
| -------------------------- | ------------------------------------------------------ |
| Data residency in Canada   | ✅ Optional Canada data center hosting                 |
| Audit logs & transparency  | ✅ Comprehensive audit log streaming                   |
| Data access controls       | ✅ SAML SSO, 2FA enforcement, IP allowlists            |
| Right to deletion          | ✅ User/data removal tools, GDPR data export           |
| Breach notification        | ✅ Security alerts, secret scanning, incident response |
| Data Processing Agreements | ✅ DPA included in Enterprise contract                 |

**What you need to do:**

1. **Enable audit logging** - Track all data access and changes
2. **Configure IP allowlists** - Restrict access to Quebec/Canada IPs only
3. **Implement 2FA** - Enforce two-factor authentication for all users
4. **Request DPA** - Sign Data Processing Agreement with GitHub
5. **Document data flows** - Maintain records of what data is stored where

**Resources:**

- GitHub's Data Protection Addendum: Available through Enterprise Sales
- Law 25 Overview: https://www.quebec.ca/en/government/policies-orientations/protection-personal-information
- GitHub Security & Compliance: https://github.com/security

**Note:** While GitHub provides the tools, **you are responsible** for implementing proper access controls and maintaining compliance documentation. Consider consulting a Quebec-based privacy lawyer.

---

### 3. **Self-Hosted GPU Runners: Can I run GPU-intensive workloads (AI, video) on GitHub Actions?**

**Answer:** Yes, but with important considerations for **self-hosted runners**.

**GitHub-hosted runners (default):**

- ❌ No GPU support on standard runners
- ❌ Linux, macOS, Windows only (CPU-based)
- ✅ Easy to use, no setup required

**Self-hosted GPU runners (your infrastructure):**

- ✅ Full GPU support (CUDA, TensorFlow, PyTorch, video encoding)
- ✅ You control hardware (RTX 4090, A100, H100, etc.)
- ✅ Unlimited Actions minutes (see below)
- ⚠️ You manage setup, security, and maintenance

**Setup requirements:**

1. **Hardware:** Linux server with NVIDIA GPU(s)
2. **Software:** Docker, NVIDIA Container Runtime, GitHub Actions Runner
3. **Network:** Secure connection to GitHub (outbound HTTPS, no inbound required)
4. **Security:** Isolated network, firewall rules, regular OS updates

**Cost considerations:**

| **Component**                 | **Estimated Monthly Cost (CAD)** |
| ----------------------------- | -------------------------------- |
| GPU server (cloud/colocation) | $500 - $2,000+                   |
| Electricity (self-hosted)     | $50 - $200                       |
| Maintenance time              | 5-10 hours/month                 |
| Total                         | $550 - $2,200+/month             |

**vs. GitHub-hosted (Enterprise Cloud):**

- **50,000 Actions minutes/month** = $0 (included)
- **Additional minutes** = ~$0.008/minute ($8 per 1,000 minutes)

**Use cases for self-hosted GPU runners:**

- AI model training (Ti-Guy Assistant, image generation)
- Video transcoding (Ti-Guy Studio)
- Large-scale data processing
- Custom ML pipelines

**Limits:**

- **No limit on minutes** when using self-hosted runners
- **Concurrent jobs:** Limited only by your hardware
- **Storage:** Your responsibility (runner disk space)

**Setup guide:**

- [Self-hosted runners documentation](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners)
- [Using GPU with self-hosted runners](https://github.com/actions/runner/blob/main/docs/adrs/0149-runner-gpu-support.md)

**Recommendation for Zyeuté:**

- Start with GitHub-hosted runners for standard workflows
- Add self-hosted GPU runner when AI workloads exceed $200-300/month in compute costs
- Consider cloud GPU (AWS, GCP, Azure) vs. on-premises based on usage patterns

---

### 4. **Unlimited Actions Minutes: What does this really mean?**

**Answer:** "Unlimited" has different meanings depending on your setup.

**GitHub-hosted runners (Enterprise Cloud):**

- ✅ **50,000 minutes/month included** per organization
- ✅ **Unlimited** for public repositories
- ⚠️ **Paid overages** for private repos beyond included minutes
  - Linux: $0.008/minute
  - Windows: $0.016/minute
  - macOS: $0.08/minute

**Self-hosted runners:**

- ✅ **Truly unlimited minutes** - no GitHub charges
- ⚠️ You pay for hardware, electricity, maintenance

**What counts as "minutes":**

- Time spent running workflows (build, test, deploy)
- Multiplied by concurrent jobs (2 jobs × 10 minutes = 20 minutes)
- Rounded up to nearest minute

**Example costs for Zyeuté (private repo, GitHub-hosted):**

| **Monthly Builds** | **Avg. Time/Build** | **Minutes Used** | **Cost**              |
| ------------------ | ------------------- | ---------------- | --------------------- |
| 100 builds         | 10 min              | 1,000 min        | $0 (within free tier) |
| 500 builds         | 15 min              | 7,500 min        | $0 (within free tier) |
| 2,000 builds       | 20 min              | 40,000 min       | $0 (within free tier) |
| 5,000 builds       | 20 min              | 100,000 min      | ~$400 CAD             |

**Tips to reduce costs:**

1. Use self-hosted runners for heavy workloads
2. Cache dependencies (`actions/cache`)
3. Optimize workflow triggers (avoid redundant builds)
4. Use public repos where possible (unlimited minutes)
5. Split jobs efficiently (parallel vs. sequential)

**Documentation:**

- [About billing for GitHub Actions](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions)
- [Actions pricing calculator](https://github.com/pricing/calculator)

---

### 5. **Enterprise Server: Is it included with Enterprise Cloud? Do I need both?**

**Answer:** Yes, **GitHub Enterprise Server is included** with Enterprise Cloud subscriptions at no extra cost for the license. However, you are responsible for infrastructure.

**What you get:**

- ✅ **License included** - No additional software licensing fees
- ✅ **Hybrid deployment** - Run on-premises + cloud simultaneously
- ✅ **Full parity** - Same features as Cloud (Actions, Security, etc.)
- ✅ **Data control** - Keep sensitive repos on your own servers

**What you need to provide:**

- ❌ **Server infrastructure** - Your own hardware or cloud VMs
- ❌ **Storage** - Database, repositories, Actions cache
- ❌ **Networking** - VPN, load balancers, firewalls
- ❌ **Maintenance** - Updates, backups, monitoring

**When to use Enterprise Server:**

| **Scenario**                     | **Recommended Solution**                       |
| -------------------------------- | ---------------------------------------------- |
| All public/low-sensitivity repos | Enterprise Cloud only                          |
| Mixed public + sensitive repos   | Hybrid (Cloud + Server)                        |
| Air-gapped/offline environment   | Enterprise Server only                         |
| High compliance requirements     | Enterprise Server or Cloud with data residency |
| Small team (<10 developers)      | Enterprise Cloud only                          |

**Cost estimate for self-hosted Server:**

| **Component**                  | **Monthly Cost (CAD)** |
| ------------------------------ | ---------------------- |
| Server hardware/VMs            | $200 - $1,000          |
| Storage (1-5TB)                | $50 - $200             |
| Networking                     | $50 - $150             |
| Admin time (setup/maintenance) | 10-20 hours/month      |
| Total                          | $300 - $1,350+/month   |

**Setup time:**

- Initial setup: 8-16 hours
- Ongoing maintenance: 2-4 hours/week

**For Zyeuté:**

- **Start with Cloud only** - Simpler, less overhead
- **Add Server later** if you need to host sensitive AI models or proprietary algorithms on-premises
- **Not recommended** unless you have specific compliance or security requirements

**Documentation:**

- [About GitHub Enterprise Server](https://docs.github.com/en/enterprise-server@latest/admin/overview/about-github-enterprise-server)
- [Server system requirements](https://docs.github.com/en/enterprise-server@latest/admin/installation/setting-up-a-github-enterprise-server-instance/installing-github-enterprise-server-on-aws)

---

### 6. **Trial Requests: How do I try GitHub Enterprise before committing?**

**Answer:** GitHub offers **14-30 day free trials** for Enterprise Cloud (with some limitations).

**How to request a trial:**

1. **Direct signup (fastest):**
   - Visit: https://github.com/enterprise
   - Click "Start a free trial"
   - Select "Enterprise Cloud"
   - Provide payment method (not charged during trial)

2. **Through Sales (recommended for custom needs):**
   - Contact: https://github.com/enterprise/contact
   - Request: "Enterprise Cloud trial with Canada data residency"
   - Mention: Quebec-based team, Law 25 compliance needs
   - Sales rep will provision a custom trial

**What you get during trial:**

- ✅ Full Enterprise Cloud features
- ✅ Advanced Security (CodeQL, Secret Scanning, Dependabot)
- ✅ 50,000 Actions minutes
- ✅ Audit logging
- ✅ Support access (email/chat)
- ⚠️ No Copilot Enterprise (requires separate trial)

**What you can't do:**

- ❌ Enable data residency (requires paid subscription)
- ❌ Add Enterprise Server license (trial is Cloud-only)
- ❌ Access premium SLA support (48hr response vs. 1hr for paid)

**Trial tips:**

1. **Test key features first**: Advanced Security, Actions, audit logs
2. **Invite your team**: Test collaboration features (SSO, access controls)
3. **Run realistic workflows**: CI/CD pipelines, security scans
4. **Document findings**: Track what works, what doesn't, costs
5. **Ask questions**: Sales and support are responsive during trials

**After trial ends:**

- Convert to paid subscription: Seamless, no data loss
- Downgrade to Team/Free: Data preserved, lose Enterprise features
- Cancel: 7-day grace period to export data

**Copilot Enterprise trial (separate):**

- Request through Sales: copilot-enterprise@github.com
- 30-day trial available
- Test Copilot Agent, PR reviews, premium requests

**Documentation:**

- [GitHub Enterprise trial](https://docs.github.com/en/get-started/learning-about-github/githubs-products#github-enterprise)
- [Trial FAQ](https://docs.github.com/en/enterprise-cloud@latest/admin/overview/about-github-for-enterprises)

---

### 7. **Pricing: What's the actual cost for a small Quebec team?**

**Answer:** Pricing depends on team size, features, and usage.

**Current GitHub pricing (CAD estimates, Dec 2025):**

| **Plan**               | **Per User/Month (CAD)** | **Minimum**       | **Features**                                                  |
| ---------------------- | ------------------------ | ----------------- | ------------------------------------------------------------- |
| **Free**               | $0                       | -                 | Public repos, basic Actions, 500MB storage                    |
| **Team**               | $5/user                  | $4/user (annual)  | Private repos, 2GB storage, protected branches                |
| **Enterprise Cloud**   | $28/user                 | $21/user (annual) | All Team + Advanced Security, SSO, audit logs, data residency |
| **Copilot Business**   | +$26/user                | -                 | AI coding assistant                                           |
| **Copilot Enterprise** | +$52/user                | -                 | Copilot + Agent, PR reviews, premium requests                 |

**Example monthly costs for Zyeuté team:**

**Scenario 1: Small team (2 developers)**

- Plan: Team (annual)
- Cost: 2 users × $4 = **$8/month**
- Includes: Private repos, Actions (3,000 min/month), basic security

**Scenario 2: Growing team (5 developers)**

- Plan: Team (annual)
- Cost: 5 users × $4 = **$20/month**
- Includes: Same as above, scales with team

**Scenario 3: Enterprise with compliance (5 developers)**

- Plan: Enterprise Cloud (annual)
- Cost: 5 users × $21 = **$105/month**
- Add: Copilot Business (optional): 5 × $26 = **$130/month**
- Total: **$235/month** with AI assistance
- Includes: Advanced Security, SSO, audit logs, data residency

**Scenario 4: Scaling team (10 developers + Copilot Enterprise)**

- Plan: Enterprise Cloud (annual): 10 × $21 = **$210/month**
- Add: Copilot Enterprise: 10 × $52 = **$520/month**
- Total: **$730/month**
- Includes: Full Enterprise + AI Agent + premium requests

**Additional costs to consider:**

| **Service**                        | **Cost**            |
| ---------------------------------- | ------------------- |
| Actions minutes (beyond included)  | ~$0.008/min (Linux) |
| Packages storage (beyond included) | ~$0.50/GB/month     |
| Large File Storage (Git LFS)       | ~$5/50GB/month      |
| Self-hosted GPU runner (hardware)  | $500-2,000/month    |

**Cost optimization tips:**

1. **Start with Team plan** - Upgrade to Enterprise when you need compliance
2. **Use annual billing** - Save ~25% vs. monthly
3. **Cache dependencies** - Reduce Actions minutes
4. **Optimize storage** - Use `.gitignore`, avoid large binaries
5. **Selective Copilot** - Only assign to developers who use it regularly

**For Zyeuté (current needs):**

- **Recommended:** Team plan ($4-5/user/month)
- **Upgrade to Enterprise when:**
  - You need Law 25 compliance documentation
  - You pursue government contracts requiring data residency
  - Team grows beyond 10 developers
  - You need advanced security features (CodeQL, secret scanning)

**Pricing calculator:**

- https://github.com/pricing/calculator
- Or contact Sales for custom quote: https://github.com/enterprise/contact

**Documentation:**

- [GitHub pricing](https://github.com/pricing)
- [Enterprise Cloud pricing](https://docs.github.com/en/enterprise-cloud@latest/billing/managing-billing-for-your-products/about-billing-for-github-products)

---

### 8. **Migration: How do I move from Team to Enterprise Cloud?**

**Answer:** Migration is **seamless and non-disruptive** - GitHub handles it with zero downtime.

**Migration process:**

1. **Pre-migration (1-2 days):**
   - Contact GitHub Sales: https://github.com/enterprise/contact
   - Request: "Upgrade Team to Enterprise Cloud"
   - Specify: Canada data residency (if needed)
   - Review pricing and contract

2. **Contract signing (1-3 days):**
   - Sign Enterprise Agreement
   - Provide payment details
   - Specify billing contact

3. **Provisioning (1-2 hours):**
   - GitHub provisions Enterprise organization
   - You receive access credentials
   - No repository migration needed (already on GitHub)

4. **Organization linking (immediate):**
   - GitHub Support links your existing organizations to Enterprise account
   - Billing switches to centralized Enterprise billing
   - All data, repos, Actions history remains intact

5. **Feature enablement (1-2 days):**
   - Enable Advanced Security (CodeQL, secret scanning)
   - Configure SSO (if needed)
   - Set up audit log streaming
   - Configure IP allowlists
   - Enable 2FA enforcement

**What happens to your data:**

- ✅ **No data loss** - All repos, issues, PRs, Actions history preserved
- ✅ **No downtime** - Migration happens in background
- ✅ **Same URLs** - Repository URLs don't change
- ✅ **History intact** - Git history, commits, tags preserved

**What changes:**

- ✅ Billing switches to Enterprise (may see prorated charges)
- ✅ New features available (Advanced Security, SSO, etc.)
- ✅ Audit logs start recording (historical logs not backfilled)
- ✅ Organization settings expand (new policies, controls)

**Timeline:**

- **Total time:** 3-7 days from initial contact to full migration
- **Active work:** ~2-4 hours (mostly configuration)
- **Your team:** No interruption, continue working as normal

**Migration checklist:**

- [ ] **Week before migration:**
  - [ ] Notify team of upcoming changes
  - [ ] Document current workflows and integrations
  - [ ] Review Enterprise features you want to enable
  - [ ] Identify users for initial Enterprise access

- [ ] **Day of migration:**
  - [ ] GitHub Support performs migration (usually off-hours)
  - [ ] Verify access to Enterprise settings
  - [ ] Confirm billing dashboard access

- [ ] **Week after migration:**
  - [ ] Enable Advanced Security on critical repos
  - [ ] Configure SSO (if planned)
  - [ ] Set up audit log streaming
  - [ ] Enable 2FA enforcement (with grace period)
  - [ ] Update team documentation

**Rollback:**

- ⚠️ Downgrading from Enterprise to Team is possible but not instant
- Requires contacting Support
- Some data (audit logs, Advanced Security findings) may be lost
- Consider trial first to avoid needing rollback

**For Zyeuté:**

- Migration is low-risk and straightforward
- Plan migration during slow period (weekend/holiday)
- Test new features gradually (don't enable everything at once)

**Documentation:**

- [Migrating to Enterprise Cloud](https://docs.github.com/en/enterprise-cloud@latest/admin/overview/about-github-for-enterprises)
- [Organization migration guide](https://docs.github.com/en/enterprise-cloud@latest/admin/user-management/managing-organizations-in-your-enterprise)

---

## 📊 Quick Reference: Feature Comparison Table

| **Feature**                   | **Free**         | **Team**         | **Enterprise Cloud**    | **Enterprise Cloud + Data Residency** |
| ----------------------------- | ---------------- | ---------------- | ----------------------- | ------------------------------------- |
| **Private repos**             | Limited          | ✅ Unlimited     | ✅ Unlimited            | ✅ Unlimited                          |
| **Actions minutes/month**     | 2,000            | 3,000            | 50,000                  | 50,000                                |
| **Storage**                   | 500 MB           | 2 GB             | 50 GB                   | 50 GB                                 |
| **Protected branches**        | ❌               | ✅               | ✅                      | ✅                                    |
| **Code owners**               | ❌               | ✅               | ✅                      | ✅                                    |
| **Advanced Security**         | ❌               | ❌               | ✅                      | ✅                                    |
| **SSO (SAML)**                | ❌               | ❌               | ✅                      | ✅                                    |
| **Audit logs**                | ❌               | Basic            | ✅ Advanced             | ✅ Advanced                           |
| **IP allowlists**             | ❌               | ❌               | ✅                      | ✅                                    |
| **Data residency (Canada)**   | ❌               | ❌               | ❌                      | ✅                                    |
| **Law 25 compliance tools**   | ❌               | ❌               | ✅                      | ✅                                    |
| **Enterprise Server license** | ❌               | ❌               | ✅                      | ✅                                    |
| **Self-hosted runners**       | ✅               | ✅               | ✅                      | ✅                                    |
| **GPU runner support**        | ✅ (self-hosted) | ✅ (self-hosted) | ✅ (self-hosted)        | ✅ (self-hosted)                      |
| **Support SLA**               | Community        | Email (24-48hr)  | Email (24hr) + Priority | Email (24hr) + Priority               |
| **Price (per user/month)**    | $0               | $5 ($4 annual)   | $28 ($21 annual)        | Contact Sales                         |

**Legend:**

- ✅ = Included
- ❌ = Not available
- Limited = Feature has restrictions

---

## ✅ Readiness Checklist for Small Quebec Teams

Use this checklist to determine if/when you need GitHub Enterprise:

### **Current State Assessment**

- [ ] **Team size:** \_\_\_ developers (If <5, Team plan likely sufficient)
- [ ] **Compliance needs:**
  - [ ] Need Law 25 documentation
  - [ ] Pursuing government contracts
  - [ ] Handling sensitive personal data
  - [ ] Require audit trails for SOC 2/ISO compliance
- [ ] **Data residency:**
  - [ ] Required to keep data in Canada
  - [ ] Client/partner mandate for data sovereignty
  - [ ] Provincial government requirements
- [ ] **Security requirements:**
  - [ ] Need CodeQL security scanning
  - [ ] Need secret scanning (beyond public repos)
  - [ ] Need advanced Dependabot features
  - [ ] SSO/SAML required (company policy)
- [ ] **Budget:**
  - [ ] Can allocate $20-30/user/month for Enterprise
  - [ ] Can justify $50+/user/month for Enterprise + Copilot
- [ ] **GPU/AI workloads:**
  - [ ] Running AI model training in CI/CD
  - [ ] Need self-hosted GPU runners
  - [ ] Current Actions minutes exceeding $200/month

### **Decision Matrix**

**Stick with Free/Team if:**

- ✅ Team is <5 developers
- ✅ No compliance requirements
- ✅ Data residency not required
- ✅ Security scanning via third-party tools is acceptable
- ✅ Actions minutes under 3,000/month

**Upgrade to Enterprise Cloud if:**

- ✅ Team is 5-10+ developers
- ✅ Need Law 25 compliance documentation
- ✅ Require audit logs for compliance
- ✅ Want integrated Advanced Security (vs. third-party tools)
- ✅ Budget allows $20-30/user/month

**Add Data Residency if:**

- ✅ Government contracts require Canada hosting
- ✅ Client mandates data sovereignty
- ✅ Provincial compliance requires it
- ✅ Handling sensitive personal information (SPI)

**Add Copilot Enterprise if:**

- ✅ Team is regularly using AI assistance
- ✅ Budget allows $50+/user/month
- ✅ Want Copilot Agent for issue automation
- ✅ Need premium request allowances (100+ requests/day/user)

**Add Self-Hosted GPU Runner if:**

- ✅ AI workloads exceeding $300/month on cloud compute
- ✅ Need specific GPU hardware (RTX, A100, H100)
- ✅ Have server infrastructure or budget for it
- ✅ Running video encoding, ML training, or data processing

---

## 🚀 Next Steps

### **For Teams Just Starting Out:**

1. ✅ **Start with GitHub Team** ($4-5/user/month)
   - Focus on building your product
   - Use free Actions minutes
   - Leverage community support

2. ✅ **Document compliance needs** as you grow
   - Track when Law 25 becomes relevant
   - Note any client data residency requirements
   - Plan for when audit logs are needed

3. ✅ **Monitor Actions usage**
   - Track monthly Actions minutes
   - If approaching 3,000/month, plan upgrade or optimization

4. ✅ **Review quarterly**
   - Revisit this document every 3 months
   - Assess if Enterprise makes sense yet
   - Adjust plan as team and requirements grow

### **When Ready for Enterprise:**

1. 📞 **Contact GitHub Sales**
   - Email: https://github.com/enterprise/contact
   - Mention: "Quebec-based team, Law 25 compliance"
   - Request: Trial with Canada data residency

2. 📋 **Request Trial** (14-30 days)
   - Test Advanced Security features
   - Run realistic CI/CD workflows
   - Evaluate audit logging
   - Document findings

3. 📝 **Plan Migration**
   - Review [GITHUB_ENTERPRISE_ADMIN_SETUP.md](./GITHUB_ENTERPRISE_ADMIN_SETUP.md)
   - Schedule migration during low-activity period
   - Notify team of changes
   - Enable features gradually

4. 🔐 **Configure Compliance**
   - Enable audit log streaming
   - Set up IP allowlists (if needed)
   - Configure SSO (if needed)
   - Document data flows for Law 25

5. 📊 **Monitor & Optimize**
   - Track monthly costs
   - Optimize Actions usage
   - Review security findings
   - Adjust features as needed

---

## 📞 Support & Demo Contacts

### **GitHub Sales & Support**

- **Enterprise Sales:** https://github.com/enterprise/contact
- **Pricing Questions:** https://github.com/pricing/calculator
- **Technical Support:** https://support.github.com
- **Law 25 / Compliance Questions:** Contact Sales (mention Quebec/Canada requirements)

### **Trial Requests**

- **Enterprise Cloud Trial:** https://github.com/enterprise (click "Start a free trial")
- **Copilot Enterprise Trial:** copilot-enterprise@github.com
- **Custom Demo:** Request through Sales contact form

### **Quebec-Specific Resources**

- **Quebec Law 25 (French):** https://www.quebec.ca/gouvernement/politiques-orientations/loi-25-protection-renseignements-personnels
- **Office of Privacy Commissioner (Quebec):** https://www.cai.gouv.qc.ca/
- **Canadian Privacy Law:** https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/

### **GitHub Documentation**

- **Enterprise Cloud Docs:** https://docs.github.com/en/enterprise-cloud@latest
- **Enterprise Server Docs:** https://docs.github.com/en/enterprise-server@latest
- **Actions Docs:** https://docs.github.com/en/actions
- **Advanced Security Docs:** https://docs.github.com/en/code-security
- **Self-Hosted Runners:** https://docs.github.com/en/actions/hosting-your-own-runners

### **Community & Forums**

- **GitHub Community:** https://github.community/
- **GitHub Discussions:** https://github.com/orgs/community/discussions
- **Stack Overflow:** [github-enterprise] tag

---

## 📚 Additional Documentation

For more detailed setup instructions, see:

- **[GITHUB_ENTERPRISE_ADMIN_SETUP.md](./GITHUB_ENTERPRISE_ADMIN_SETUP.md)** - Comprehensive admin setup checklist
- **[../README.md](../README.md)** - Zyeuté project overview
- **[../SETUP_GUIDE.md](../SETUP_GUIDE.md)** - Development environment setup

---

## 📝 Document Maintenance

**Last Updated:** December 3, 2025  
**Review Schedule:** Quarterly (March, June, September, December)  
**Owner:** DevOps/Admin Team  
**Contact:** [Your email or team contact]

**Change Log:**

- **Dec 3, 2025:** Initial version created
- **Next review:** March 3, 2026

---

**🔥⚜️ Fait au Québec, pour le Québec 🇨🇦⚜️🔥**

_This document is maintained as a go-to reference for any GitHub Enterprise upgrade discussions, compliance audits, or scaling decisions._
