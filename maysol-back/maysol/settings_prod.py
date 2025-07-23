# settings_prod.py - Configuración de producción
from .settings import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Hosts permitidos (actualizar con tu dominio)
ALLOWED_HOSTS = [
    'granjasmaysol.com',
    'www.granjasmaysol.com',
    'localhost',
    '127.0.0.1',
    '*'  # Temporal - cambiar por dominios específicos
]

# Base de datos de producción
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'borderless',
        'USER': 'root',
        'PASSWORD': 'maysol123',
        'HOST': 'db-mysql',
        'PORT': '3306',
        'OPTIONS': {
            'sql_mode': 'traditional',
        }
    }
}

# Configuración de archivos estáticos
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# Configuración de archivos media
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# CORS settings para producción
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://granjasmaysol.com",
    "https://www.granjasmaysol.com",
    "http://localhost:8081",  # Para testing
]

# Session cookie settings
SESSION_COOKIE_SECURE = False  # Cambiar a True cuando tengas HTTPS
CSRF_COOKIE_SECURE = False     # Cambiar a True cuando tengas HTTPS

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/app/django.log',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

# Cache (opcional)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}