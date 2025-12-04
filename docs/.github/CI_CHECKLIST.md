# CI Lint/Type Fix PR Checklist

## Pre-Merge (Author)

- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] Unit/integration tests pass
- [ ] PR description is filled with template
- [ ] PR is labeled `lint-fix`

## Review (Reviewer)

- [ ] Is PR summary/comment clear and accurate?
- [ ] Does diff only touch intended files/rules?
- [ ] Audit traceability: Are tracking files updated & linked?
- [ ] No security-sensitive changes/issues introduced

## Post-Merge (Maintainer)

- [ ] All CI checks green
- [ ] Tracking docs (COPILOT_AGENTS_LINT_FIXES.md, PR summary) updated

---

**Quick Commands**

```sh
npm run lint
npm run type-check
npm test
```
