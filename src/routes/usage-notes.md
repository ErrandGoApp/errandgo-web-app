# Integration notes

## What changed

- The access flow is now a real route: `/auth`
- The workspace remains mounted behind the auth route
- The background workspace is blurred and interaction-disabled while auth is open
- The auth flow is split into dedicated components for easier extension

## Suggested structure

```text
src/
  components/
    ErrandGoWebApp.tsx
    auth/
      AuthFlowCard.tsx
      AuthenticationSteps.tsx
  layout/
    ErrandGoWorkspaceShell.tsx
  routes/
    AppRoutes.tsx
```

## Replace modal triggers with route navigation

Where you previously opened a modal like:

```tsx
setModalOpen(true)
```

move to:

```tsx
navigate('/auth')
```

## Why this pattern is better

- Scales cleanly for first-time setup and future onboarding steps
- Keeps the application context visible behind the flow
- Avoids growing a local-state modal into a large orchestration component
- Makes deep linking and refresh behavior more predictable

## Optional next refinements

- Add separate child routes like `/auth/sign-in`, `/auth/username`, `/auth/account-type`
- Persist form state in context or a store
- Add availability checking for usernames
- Add social sign-in and passkey entry points
