# Ebook AWS Serverless

Landing estática para presentar una guía práctica de AWS Serverless y recoger solicitudes de interés. No necesita proceso de compilación ni dependencias npm.

## Estructura

```text
index.html                  Página, navegación y formulario
css/                        Bootstrap y estilos del sitio
js/api.js                   POST del formulario a API Gateway
js/click-scroll.js          Navegación y sección activa
js/bootstrap.bundle.min.js  Componentes Bootstrap
assets/images/              Fotografías locales de lectura
assets/fonts/                Fuente local de Bootstrap Icons
README.md                    Arquitectura, pruebas y estado de entrega
```

Las imágenes se guardan en el repo para que GitHub Pages no dependa de rutas ausentes. Las fotografías proceden de Unsplash; Bootstrap Icons es la versión 1.10.3. La plantilla de partida es TemplateMo 588 Ebook Landing, acreditada al pie de página.

## Vista local

No hay build ni paquetes del proyecto que instalar. Con Node.js/npm disponible, desde esta carpeta ejecuta:

```powershell
npx --yes serve --listen 8765
```

Abre `http://localhost:8765`. La vista `file://` sirve para revisar el diseño, pero para probar `fetch` y CORS utiliza un origen HTTP o la URL publicada.

## Flujo objetivo

```text
Navegador -> GitHub Pages -> POST /dev/contact -> API Gateway
                                      -> Lambda -> DynamoDB
                                                -> SNS
```

El formulario envía exactamente `name`, `email` e `interest`. La URL configurada en `js/api.js` es `https://p0ou7rjifg.execute-api.us-east-1.amazonaws.com/dev/contact`.

## Comprobación CORS

El 13-10-2026, `OPTIONS /dev` respondió `200`, pero `OPTIONS /dev/contact` respondió `403 Missing Authentication Token`. La ruta necesaria para el navegador todavía no está lista: habilita CORS para `POST` y `OPTIONS` en el recurso `/contact`, permite `Content-Type`, despliega de nuevo el stage `dev` y repite el preflight. El token temporal de AWS Academy estaba expirado durante la inspección; no se modificó infraestructura ni se envió un `POST`.

## Pruebas

Antes de enviar una solicitud desde el sitio publicado, verifica el preflight:

```bash
API_URL="https://p0ou7rjifg.execute-api.us-east-1.amazonaws.com/dev/contact"
curl -i -X OPTIONS "$API_URL" \
  -H "Origin: https://TU_FRONTEND_PUBLICO" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type"
```

Después, prueba el POST válido con los tres campos y una petición negativa sin `interest` (HTTP 400). Comprueba que la misma solicitud aparezca en DynamoDB, CloudWatch y SNS; un HTTP 200 por sí solo no demuestra el flujo completo.

## Entrega pendiente

- Anotar y probar la URL pública del frontend.
- Confirmar en AWS la Lambda, la tabla/partition key y el Topic/suscripción reales.
- Adjuntar evidencia correlacionada de HTTP, DynamoDB, CloudWatch y SNS.
- Explicar la partition key, el Execution Role y las credenciales temporales de Academy.

No publiques Access Keys, Session Tokens ni otros secretos en el repositorio o en capturas.
