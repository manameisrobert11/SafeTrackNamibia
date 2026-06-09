# SafeTrack Namibia

SafeTrack Namibia is an Expo app for workplace safety reporting, accident review, status tracking, compliance alerts, and manager oversight.

## Run The App

```bash
npm install
npm run web
```

The local Expo web app usually opens at:

```text
http://localhost:8081
```

## Demo Login Credentials

Use company code `STNAM` for normal employee access.

| Role | Email | Password | Opens |
| --- | --- | --- | --- |
| Employee | `saaraekandjo999@gmail.com` | `safetrack` | Employee dashboard |
| Admin | `admin@safetrack.na` | `admin123` | Manager dashboard |
| Manager | `manager@safetrack.na` | `manager123` | Manager dashboard |

Admin demo access also works when the email contains `admin` or `manager`, or when the company code is `ADMIN`. Admin users may also use `safetrack` while testing.

## User Features

- Employee dashboard with incident and compliance summary.
- Incident reporting with type, severity, location, department, details, optional photo, and GPS capture.
- Employee incident history filtered to the signed-in user.
- Incident detail view with status/audit trail visibility.
- Notifications for the signed-in employee's safety alerts.
- Profile with report summary, help actions, and logout.

## Admin Features

- Separate manager dashboard after admin login.
- Admin bottom navigation for Manager, Reports, Alerts, and Profile.
- All accident reports across users, including who created each report.
- Status controls for Open, In Progress, and Resolved.
- Full report details and audit trail.
- Priority incident alerts and compliance reminders.
- System login history showing who has logged into the app.
- Admin profile with account summary and logout.
