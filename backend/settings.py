import os
from pathlib import Path
from dotenv import load_dotenv 
from datetime import timedelta
import logging
import logging.config
import dj_database_url

# -------------------------------
# 🔹 Configuración de Rutas y Carga de .env
# -------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# -------------------------------
# Configuración de seguridad
# -------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-default")
DEBUG = os.getenv("DEBUG", "False") == "True" # En Render suele ser False

ALLOWED_HOSTS = ['mi-backend-frenchys.onrender.com', 'localhost', '127.0.0.1']
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# Seguridad HTTPS en Producción
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
else:
    X_FRAME_OPTIONS = "SAMEORIGIN"

# -------------------------------
# Aplicaciones e INSTALLED_APPS
# -------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic', # Añadido para desarrollo
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'ambulance.apps.AmbulanceConfig',
    "drf_spectacular",
    "drf_spectacular_sidecar",
    'django_celery_beat',
]

# -------------------------------
# Middleware (WhiteNoise añadido)
# -------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # <--- OBLIGATORIO PARA RENDER
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# -------------------------------
# 🔹 Base de Datos (Supabase Directa)
# -------------------------------
DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
    # Forzamos SSL para Supabase y evitamos errores de pooler
    DATABASES['default']['OPTIONS'] = {
        'sslmode': 'require',
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'app_frenchys_db',
            'USER': 'postgres',
            'PASSWORD': 'your_local_password',
            'HOST': '127.0.0.1',
            'PORT': '5432',
        }
    }

# -------------------------------
# Django REST Framework + JWT
# -------------------------------
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'ambulance.pagination.OptionalPageNumberPagination',
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ALGORITHM": "HS512",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# -------------------------------
# 🔹 Archivos Estáticos (WhiteNoise Config)
# -------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# Esto permite que los estilos se vean en Render
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -------------------------------
# CORS / CSRF
# -------------------------------
CORS_ALLOW_ALL_ORIGINS = True # Ajustar en producción real
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = ["https://mi-backend-frenchys.onrender.com", "http://localhost:3000"]
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,

    "formatters": {
        "simple": {
            "format": "[{levelname}] {asctime} {name} → {message}",
            "style": "{",
        },
        "json": {
            "format": '{{"time": "{asctime}", "level": "{levelname}", "logger": "{name}", "message": "{message}"}}',
            "style": "{",
        },
    },

    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": BASE_DIR / "logs/app.log",
            "formatter": "json",
        },
    },

    "loggers": {
        "ambulance": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": False,
        },
    },
}

# --- Configuración de Celery ---
# Usando Redis como broker (asegúrate de que Redis esté corriendo)
# CELERY_BROKER_URL = 'redis://127.0.0.1:6379/0'
# CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/0'

# Ajustes de Serialización
# CELERY_ACCEPT_CONTENT = ['application/json']
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_RESULT_SERIALIZER = 'json'

# Zona Horaria (Ajusta si es necesario)
# CELERY_TIMEZONE = 'America/Puerto_Rico'