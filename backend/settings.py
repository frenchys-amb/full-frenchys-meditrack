import os
from pathlib import Path
from dotenv import load_dotenv 
from datetime import timedelta
import logging
import logging.config
import dj_database_url
from decouple import config

log = logging.getLogger("ambulance")
# -------------------------------
# 🔹 Cargar variables .env ANTES de usarlas
# -------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# -------------------------------
# Configuración de seguridad
# -------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-default")
DEBUG = os.getenv("DEBUG", "True") == "True"

# Hosts permitidos
ALLOWED_HOSTS = []

# --- 1. Hosts de Render ---
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:
    # Si estamos en Render, aceptamos su hostname
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# --- 2. Hosts de Producción (Dominio Propio) ---
# Asegúrate de que estas variables se usen solo si el dominio final está listo
PROD_HOSTS = os.getenv("PROD_HOSTS", "").split(",")
ALLOWED_HOSTS.extend([host.strip() for host in PROD_HOSTS if host.strip()])

# --- 3. Hosts de Desarrollo ---
if DEBUG:
    ALLOWED_HOSTS.append("*")

# Seguridad HTTPS
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
else:
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SECURE_BROWSER_XSS_FILTER = False
    SECURE_CONTENT_TYPE_NOSNIFF = False
    X_FRAME_OPTIONS = "SAMEORIGIN"

# -------------------------------
# Aplicaciones
# -------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'ambulance.apps.AmbulanceConfig',
    "drf_spectacular",
    "drf_spectacular_sidecar",
    'django_celery_beat',
]

# -------------------------------
# Middleware
# -------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
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
# Base de datos
# -------------------------------
# Leer la variable de entorno DATABASE_URL (que Render proporciona)
DATABASE_URL = os.getenv('DATABASE_URL')

#if DATABASE_URL:
    # Usar dj-database-url para parsear la URL de Render
 #   DATABASES = {
  #      'default': dj_database_url.config(default=DATABASE_URL, conn_max_age=600)
   # }
#else:
    # Fallback a la configuración local tradicional (si no se encuentra DATABASE_URL)
 #   DATABASES = {
  #      'default': {
   #         'ENGINE': 'django.db.backends.postgresql',
    #        'NAME': os.getenv("DB_NAME", "app_frenchys_db"),
     #       'USER': os.getenv("DB_USER", "postgres"),
      #      'PASSWORD': os.getenv("DB_PASSWORD", "152889"), # Si no encuentra DB_PASSWORD, usa '152889'
       #     'HOST': os.getenv("DB_HOST", "localhost"),
        #    'PORT': os.getenv("DB_PORT", "5432"),
        #}
    #}


# settings.py
# ... (código existente)

if DATABASE_URL:
    # Usar dj-database-url para parsear la URL de Render
    DATABASES = {
        'default': dj_database_url.config(default=DATABASE_URL, conn_max_age=600)
    }
else:
    # --- CONFIGURACIÓN LOCAL (FALLBACK) ---
    # Usaremos 127.0.0.1 para evitar conflictos de conexión con IPv6.
    # Si la base de datos no existe, ejecuta 'createdb app_frenchys_db' en psql.
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            
            # NOMBRE DE LA BASE DE DATOS LOCAL
            'NAME': os.getenv("DB_NAME", "app_frenchys_db"), 
            
            # USUARIO DE POSTGRESQL (¡CAMBIA ESTOS VALORES POR TUS CREDENCIALES REALES!)
            # Si usas Homebrew/Postgres.app, el usuario es a menudo el nombre de tu Mac.
            'USER': os.getenv("DB_USER", "yalinnettevazquez"), # <--- ⚠️ REEMPLAZA "yalinnettevazquez" con tu usuario real
            'PASSWORD': os.getenv("DB_PASSWORD", ""),         # <--- ⚠️ REEMPLAZA "" con tu contraseña real
            
            # HOST: Usamos la IP explícita para evitar errores de conexión (FATAL: connection failed)
            'HOST': os.getenv("DB_HOST", "127.0.0.1"), 
            
            'PORT': os.getenv("DB_PORT", "5432"),
        }
    }
# -------------------------------
# Validadores de contraseña
# -------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# -------------------------------
# Password Hashers
# -------------------------------
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]

# -------------------------------
# Django REST Framework + JWT
# -------------------------------
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'ambulance.pagination.OptionalPageNumberPagination',
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',

    # ----------------------------
    # Autenticación y permisos
    # ----------------------------
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),

    # ----------------------------
    # Throttling (Rate Limit)
    # ----------------------------
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.ScopedRateThrottle',
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'login': '5/min',      # Máximo 5 intentos/min en /secure-login/
        'anon': '60/min',      # Límite general para usuarios NO autenticados
    },
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS512",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "UPDATE_LAST_LOGIN": True,
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Meditrack API",
    "DESCRIPTION": "API para gestión de inventario, ambulancias y transferencias.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# -------------------------------
# Internacionalización
# -------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# -------------------------------
# Archivos estáticos
# -------------------------------
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# -------------------------------
# CORS / CSRF
# -------------------------------
CORS_ALLOW_ALL_ORIGINS = DEBUG
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "http://localhost:3000").split(",")

# -------------------------------
# Twilio SMS Configuración
# -------------------------------
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER")
ADMIN_PHONE = os.getenv("ADMIN_PHONE")

# -------------------------------
# Debug info
# -------------------------------
if DEBUG:
    log.info("DEBUG MODE ACTIVADO")
    log.info(f"ALLOWED_HOSTS: {ALLOWED_HOSTS}")
    log.info(f"CORS_ALLOWED_ORIGINS: {CORS_ALLOWED_ORIGINS}")
    log.info(f"CSRF_TRUSTED_ORIGINS: {CSRF_TRUSTED_ORIGINS}")

    # Crear carpeta de logs si no existe
LOG_DIR = BASE_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)


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