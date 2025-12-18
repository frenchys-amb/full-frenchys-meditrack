from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings # IMPORTANTE
from django.conf.urls.static import static # IMPORTANTE
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('ambulance.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/users/", include("ambulance.urls")),
    
    # OpenAPI y Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    # Favicon
    path('favicon.ico', RedirectView.as_view(url='/static/favicon.ico')),
]

# Servir archivos estáticos (CSS, JS, Imágenes)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# EL CATCH-ALL SIEMPRE AL FINAL DE TODO
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]