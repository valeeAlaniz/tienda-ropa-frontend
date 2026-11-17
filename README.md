# Tienda de ropa - Frontend

Aplicacion web (Next.js) de una tienda de ropa con alquiler de prendas.

Proyecto desarrollado a partir de la experiencia y la estructura de PlacarApp, el proyecto anterior del grupo.

## Ejecutar en local

    npm install
    cp .env.example .env.local
    npm run dev

## Tests

    npm test

## Ejecutar con Docker Compose

Cloná el frontend y el backend en carpetas hermanas. El backend debe tener su
`Dockerfile`. Si lo clonaste en otra ubicación, indicá su ruta en
`BACKEND_PATH` (relativa al frontend o absoluta).

Desde el frontend:

    docker compose up --build

Abrí http://localhost:3000. Django aplica las migraciones al iniciar y expone
Swagger en http://localhost:8000/api/schema/swagger/. Para cargar prendas de prueba:

    docker compose exec backend .venv/bin/python src/manage.py cargar_datos_prueba

`docker compose down` detiene los servicios y conserva los datos en un volumen
SQLite. Esta configuración es para desarrollo local.
