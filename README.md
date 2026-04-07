# Gym Trainer Website and Admin Panel System

Full-stack implementation of the PDF specification:

- `frontend`: React + TypeScript + Vite public website and admin panel
- `backend`: Laravel API with Sanctum auth, MySQL-ready migrations, seed data, and CRUD endpoints

## What Is Included

- Public pages: Home, About Trainer, Packages, Transformations, Feedback, Contact
- WhatsApp quick-contact flow and package-specific WhatsApp buttons
- Admin login and dashboard
- Admin CRUD for packages, clients, transformations, feedback, contact messages, and trainer profile
- Seeded demo data so the app is usable immediately after migration

## Project Structure

- `frontend/`
- `backend/`
- `backend/database/seeders/DatabaseSeeder.php`

## phpMyAdmin / MySQL Setup

1. Open phpMyAdmin.
2. Create a database named `gym_trainer_cms`.
   You can also run the SQL in `backend/database/setup_mysql.sql`.
3. In `backend/.env`, use MySQL values like:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gym_trainer_cms
DB_USERNAME=root
DB_PASSWORD=
```

4. From the `backend` folder run:

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

5. From the `frontend` folder run:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

## Default URLs

- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:8000/api`

## Admin Login

- Email: `admin@gymtrainer.test`
- Password: `password123`

## Verification Completed

- Backend routes generated successfully
- Backend migrations and seeding completed successfully
- Laravel feature tests passed
- Frontend production build passed

## Notes

- Backend `.env.example` is already prepared for MySQL/phpMyAdmin usage.
- The frontend uses the Laravel API directly and includes admin tools for managing public content.
- Seeded records use remote demo images so the UI looks complete without manual uploads.
