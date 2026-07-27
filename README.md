````markdown
# demo — Virtual HR for Small Businesses

A high-contrast HR platform concept designed for small companies without dedicated HR teams.

`demo` helps employers manage employee onboarding, compliance, documents, leave, payroll information, and benefits through one clear workspace.

## Features

### Employer Experience

- Track employee onboarding progress
- Monitor HR compliance
- View employee information and signed documents
- Review attendance and leave records
- Access monthly payroll reports
- See outstanding employer actions

### Employee Experience

- Complete a guided onboarding process
- Submit personal information
- Sign employment agreements
- Complete required workplace training
- View leave balances and public holidays
- Access payroll statements
- Review benefits and insurance information

### HR Operations

- Maintain compliance tasks for different regions and industries
- Manage employee onboarding and offboarding
- Keep legal requirements and policies current

### Administration

- Manage user roles and permissions
- Oversee employer, employee, and HR access

## Design

The interface uses:

- A consistently black background
- Large, clear typography
- High-contrast accent colors
- Pixel-inspired dashboard elements
- Scroll-based reveal animations
- Separate employer and employee views
- Responsive layouts for desktop and mobile

## Technology

- Next.js
- React
- CSS
- Vinext
- pnpm

## Run Locally

Clone the repository:

```bash
git clone https://github.com/waaohmd/demo-hr-website.git
cd demo-hr-website
```

Install the dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the website at:

```text
http://localhost:3000
```

## Production Build

Create a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

To use port `3002`:

```bash
pnpm start -- -H 127.0.0.1 -p 3002
```

Then visit:

```text
http://127.0.0.1:3002
```

## Current Status

This project is a front-end prototype. The login button and dashboard data are currently for demonstration purposes and are not connected to an authentication system or production database.

