# HavenHub

HavenHub is a unified platform combining hotel management, short/long-term property rentals, and property sales into a single system. It includes a hidden internal **Risk Intelligence Service** for fraud detection, surfaced to hotel/platform staff rather than exposed to end users as "fraud detection."

## Tech Stack

- **Backend:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Auth:** JWT (access + refresh tokens), RBAC (role-based access control)
- **Architecture:** Modular monolith (planned extraction into services: API Gateway, Auth, Property, Booking, Payment, Notification, Risk Intelligence, Analytics)

## Architecture Notes

- **RBAC model:** Roles are either **system roles** (`is_system_role = true`, HavenHub-owned, global) or **hotel-scoped roles** (created by individual hotels, tied to a `hotel_id`). Permissions are HavenHub-owned only — hotels can assign existing permissions to their custom roles, but cannot create new permissions.
- **Staff scoping:** Hotel staff are linked to hotels via `hotel_staff`, and to roles via `havenhub_staff_user_roles` (for system-level staff) — this keeps multi-tenant access scoped per hotel.
- **Guards:** `JwtAuthGuard` verifies the requester is authenticated; `RolesGuard` (in `auth/guards`) checks whether the authenticated user holds a required system role. Any module gating routes with `RolesGuard` must import `AuthModule`, which exports the guard and its dependent repositories.

## Modules

### Auth

Handles authentication and account lifecycle.

- `POST /auth/signup` — create a new account
- `POST /auth/login` — authenticate, returns JWT + refresh token
- `POST /auth/refreshToken` — exchange refresh token for a new access token
- `POST /auth/forgot-password` — request a password reset
- `POST /auth/reset-password` — complete a password reset
- `POST /auth/logout/:id` — invalidate a session
- `POST /auth/verify-email` — verify account email via token
- `POST /auth/resend-verification` — resend the verification email
- `POST /auth/change-password/:id` — change password while authenticated
- `GET /auth/profile/me` — fetch the current authenticated user's profile

### Users

- `GET /users/get/all` — list all users
- `GET /users/get/id/:id` — fetch a single user by ID

### Permissions

HavenHub-owned action definitions that can be assigned to roles. Restricted to SUPER_ADMIN.

- `POST /permissions` — create a new permission
- `GET /permissions/all` — list all permissions

### Roles

System role management — creating HavenHub system-defined roles and assigning them to HavenHub staff. Restricted to SUPER_ADMIN. (Hotel-created custom roles are handled separately, scoped per hotel.)

- `POST /roles` — create a system role
- `POST /roles/assign` — assign a system role to a HavenHub staff member
- `GET /roles` — list all system roles
- `GET /roles/havenhub-staff` — list all HavenHub staff role assignments
- `GET /roles/hotel/:hotelId` — list roles scoped to a specific hotel
- `GET /roles/:id` — fetch a single role
- `PUT /roles/:id` — update a role
- `DELETE /roles/:id` — delete a role
- `DELETE /roles/staff/:userId/roles` — remove all system-role assignments for a staff member

## Roadmap

- [x] Auth module
- [x] Permissions module
- [x] Roles module
- [ ] Hotels module
- [ ] Rentals module
- [ ] Property Sales module
- [ ] Payments module
- [ ] Reviews module
- [ ] Messaging module
- [ ] Notifications module
- [ ] Risk Intelligence Service
- [ ] Analytics module
- [ ] React frontend
- [ ] DevOps / deployment pipeline
