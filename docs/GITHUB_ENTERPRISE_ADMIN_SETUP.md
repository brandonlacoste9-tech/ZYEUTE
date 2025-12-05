# GitHub Enterprise Admin Setup Checklist

> **For:** Northern Ventures Enterprise Account  
> **Updated:** December 3, 2025  
> **Status:** Ready for GitHub Support Configuration

---

## Overview

This document outlines all the configurations and settings that should be enabled for the Northern Ventures GitHub Enterprise Cloud account to ensure:
- ✅ Centralized management and billing
- ✅ Maximum security and compliance
- ✅ Team scalability
- ✅ Advanced DevOps capabilities

---

## 1. ENTERPRISE SETTINGS CONFIGURATION

### Enterprise Management

- [ ] **Enable Enterprise Managed Users (EMU)**
  - Centrally provision and manage developer accounts
  - Link to company directory service (SSO)
  - Manage roles: Owner, Member, or custom roles
  - Documentation: [About EMU](https://docs.github.com/en/enterprise-cloud@latest/admin/identity-and-access-management/understanding-iam-for-enterprises/about-enterprise-managed-users)

- [ ] **Configure Organization Linking**
  - Ensure all projects are under one enterprise billing account:
    - Zyeute (brandonlacoste9-tech/Zyeute)
    - Colony OS (brandonlacoste9-tech/colony-os-magnum-opus)
    - Vraie-Quebec (brandonlacoste9-tech/Vraie-Quebec)
  - Verify unified billing dashboard access

- [ ] **Set Up Audit Log Streaming**
  - Enable streaming of all enterprise activity logs
  - Destination: [Your SIEM/monitoring system endpoint]
  - Format: JSON
  - Retention: [Specify period]
  - Documentation: [Audit Logging](https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise)

- [ ] **Configure IP Allow Lists**
  - Restrict access to authorized networks only
  - Add your office IP ranges: [List IPs]
  - Add VPN/remote access IPs: [List IPs]
  - Documentation: [IP Allow Lists](https://docs.github.com/en/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise/restricting-network-traffic-with-an-ip-allow-list)

- [ ] **Set Regional Data Hosting**
  - Confirm data hosting region: **Canada** (if applicable)
  - Ensure unique subdomain is provisioned
  - Verify data sovereignty compliance

---

## 2. ADVANCED SECURITY FEATURES

### Enable Security Features on All Repositories

- [ ] **GitHub Advanced Security (GHAS)**
  - [ ] CodeQL Analysis - enabled on main branch
    - Configuration: Default or custom queries
    - Scheduled analysis: Daily
    - PR checks: Required for merging
  - [ ] Secret Scanning
    - [ ] Public repo scanning - enabled
    - [ ] Private repo scanning - enabled
    - [ ] Custom patterns - configure for company secrets
  - [ ] Dependabot
    - [ ] Alerts - enabled
    - [ ] Security updates - automated PR creation
    - [ ] Version updates - weekly schedule
  - Documentation: [Advanced Security](https://docs.github.com/en/enterprise-cloud@latest/admin/code-security-and-analysis/enabling-code-security-and-analysis-for-your-enterprise)

- [ ] **Push Protection for Secrets**
  - Enable prevention of secrets being committed
  - Covered entities: API keys, tokens, credentials
  - Documentation: [Push Protection](https://docs.github.com/en/enterprise-cloud@latest/code-security-and-analysis/secret-scanning/push-protection-custom-patterns)

- [ ] **Branch Protection Rules**
  - Require status checks to pass (CodeQL, CircleCI)
  - Require 1+ pull request review
  - Require conversation resolution
  - Dismiss stale PR approvals
  - Require latest commits for status checks
  - Restrict who can push to main
  - Allow auto-merge with restrictions

- [ ] **Two-Factor Authentication (2FA) Enforcement**
  - Require 2FA for all users
  - Support: Authenticator apps, security keys
  - Grace period for enablement: [Specify days]

---

## 3. COPILOT ENTERPRISE SETUP (Optional but Recommended)

- [ ] **Subscribe to Copilot Enterprise**
  - Higher premium request allowances
  - Enable for all developers who need AI assistance
  - Documentation: [Copilot Enterprise](https://docs.github.com/en/copilot/get-started/choose-enterprise-plan)

- [ ] **Configure Copilot Features**
  - [ ] Copilot Coding Agent
    - Enable for issue-based automation
    - Assign issues to agent for resolution
  - [ ] Enhanced Code Review
    - Enable Copilot PR reviews
    - Set review requirements on main branch
  - [ ] Usage Tracking
    - Monitor premium requests weekly
    - Set spending alerts at: $[Amount]
    - Optimize request allowances as needed
  - Documentation: [Monitor Copilot Usage](https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-premium-requests)

---

## 4. BILLING & LICENSING CONFIGURATION

- [ ] **Set Up Usage-Based Billing**
  - Billing cycle: Monthly
  - Seats: Auto-scale based on active users
  - Copilot requests: Track separately if subscribed

- [ ] **Configure Billing Alerts**
  - Alert email(s): [Your email]
  - Alert threshold: $[Amount]
  - Frequency: Weekly summary

- [ ] **Payment Methods**
  - Primary payment method: [Add credit card/account]
  - Backup payment method: [Add backup]
  - Billing contact: [Name, email]

- [ ] **Download Usage Reports**
  - Set up monthly billing report downloads
  - Share with: Finance/Accounting team
  - Documentation: [Enterprise Billing](https://docs.github.com/en/billing/concepts/enterprise-billing)

---

## 5. USER & ACCESS MANAGEMENT

- [ ] **Add Users to Enterprise**
  - List of developers to invite:
    - [ ] [Developer name/email]
    - [ ] [Developer name/email]
    - [ ] [Developer name/email]
  - Set initial roles (Owner, Member, or custom)
  - Documentation: [Managing Users](https://docs.github.com/en/enterprise-cloud@latest/admin/user-management/managing-users-in-your-enterprise)

- [ ] **Configure Single Sign-On (SSO)**
  - [ ] Enable SAML SSO
    - Provider: [Okta, Azure AD, etc.]
    - IdP metadata URL: [Provide]
    - Assertion consumer service URL: [GitHub provides]
  - [ ] Enable SCIM (System for Cross-domain Identity Management)
    - Auto-provision users from directory
    - Auto-deprovision when removed from directory
  - Documentation: [SSO Setup](https://docs.github.com/en/enterprise-cloud@latest/admin/identity-and-access-management/using-saml-for-enterprise-iam)

- [ ] **Set Inactivity Timeout**
  - Auto-logout after: [X minutes] of inactivity
  - Grace period: [Specify]
  - Documentation: [Session Management](https://docs.github.com/en/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise)

---

## 6. CI/CD & DEVOPS INTEGRATION

- [ ] **GitHub Actions Integration**
  - Enable GitHub Actions for all repositories
  - Set runner limits: [Specify concurrent jobs]
  - Configure action permissions
  - Documentation: [GitHub Actions](https://docs.github.com/en/enterprise-cloud@latest/admin/code-security-and-analysis/using-github-advanced-security)

- [ ] **CircleCI Integration Verification**
  - Verify webhook connections from all repositories
  - Status checks configured: ✅ (Already done)
  - Require CircleCI checks to pass before merge
  - Documentation: [CI/CD Integration](https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam-for-your-enterprise/managing-provisioned-users-with-scim)

- [ ] **Status Checks Requirements**
  - Require CodeQL to pass
  - Require CircleCI tests to pass
  - Require Dependabot checks to pass

---

## 7. COMPLIANCE & MONITORING

- [ ] **Audit Logging & Compliance**
  - [ ] Enable organization-level audit logs
    - View at: Organization Settings > Audit log
    - Retention: [Specify days]
  - [ ] Export audit logs weekly/monthly
    - Destination: [Your secure location]
  - [ ] Review audit logs monthly
    - Responsible party: [Name, email]
  - Documentation: [Audit Logs](https://docs.github.com/en/enterprise-cloud@latest/admin/monitoring-activity-in-your-enterprise/reviewing-audit-logs-for-your-enterprise)

- [ ] **Organization Policies**
  - [ ] Enforce branch naming conventions
    - Pattern: [Specify, e.g., feature/*, bugfix/*]
  - [ ] Require commit signing
    - GPG keys required for all commits
  - [ ] Restrict repository visibility
    - Internal/Private by default
  - [ ] Disable SSH keys older than [X] days
  - Documentation: [Organization Policies](https://docs.github.com/en/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise)

- [ ] **Archive & Disaster Recovery**
  - [ ] Enable Rewind Backups (if available)
    - Automated daily backups
    - 30-day retention minimum
  - [ ] Test restore procedure quarterly
  - [ ] Document backup location: [Specify]
  - Documentation: [Backups](https://docs.github.com/en/enterprise-cloud@latest/admin/configuration/configuring-your-enterprise)

---

## 8. GITHUB ENTERPRISE SERVER (OPTIONAL HYBRID SETUP)

> Only if running on-premises infrastructure alongside GitHub Enterprise Cloud

- [ ] **Provision GitHub Enterprise Server**
  - Version: [Specify latest stable]
  - License: Included with Enterprise Cloud subscription
  - Environment: [Dev/Staging/Production]

- [ ] **Configure Sync Between Cloud & Server**
  - Two-way sync enabled
  - Conflict resolution: [Specify policy]
  - Scheduled sync times: [Specify off-peak hours]

- [ ] **Network Configuration**
  - Firewall rules configured
  - VPN/private network connectivity established
  - SSL certificates installed
  - Documentation: [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server@latest/admin/installation-configuration-and-management)

---

## Quick Reference Email to GitHub Support

```
Subject: GitHub Enterprise Setup - Northern Ventures

Hi GitHub Support,

We've activated GitHub Enterprise Cloud for Northern Ventures. 
Please configure the following for our account:

1. ✅ Centralized billing and organization linking
2. ✅ Audit log streaming setup
3. ✅ IP allow lists configuration
4. ✅ CodeQL, Secret Scanning, and Dependabot activation
5. ✅ Push protection for secrets
6. ✅ SSO/SAML integration
7. ✅ Copilot Enterprise subscription (optional)
8. ✅ 2FA enforcement
9. ✅ Usage-based billing setup
10. ✅ Compliance & monitoring configuration

Please confirm when each is ready and provide relevant access URLs.

Thank you!
```

---

## Status Tracker

| Section | Status | Assigned To | Notes |
|---------|--------|-------------|-------|
| Enterprise Settings | ⏳ Pending | | |
| Security Features | ⏳ Pending | | |
| Copilot Enterprise | ⏳ Pending | | |
| Billing & Licensing | ⏳ Pending | | |
| User Management | ⏳ Pending | | |
| CI/CD Integration | ✅ In Progress | | CircleCI already configured |
| Compliance | ⏳ Pending | | |
| Enterprise Server | ⏳ Optional | | |

---

## Additional Resources

- [GitHub Enterprise Documentation](https://docs.github.com/en/enterprise-cloud@latest)
- [GitHub Plans & Pricing](https://github.com/pricing)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Copilot Plans Comparison](https://docs.github.com/en/copilot/get-started/choose-enterprise-plan)

---

**Last Updated:** December 3, 2025  
**Next Review:** [Specify date]  
**Maintained By:** [Your name/team]
