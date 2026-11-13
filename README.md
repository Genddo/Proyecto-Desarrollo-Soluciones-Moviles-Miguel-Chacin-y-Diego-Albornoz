# Nombre del Proyecto
Proyecto VoyBus

## Descripcion
**VoyBus** es un proyecto de una aplicación móvil que está orientada a modernizar el transporte público urbano, reducir la incertidumbre de espera de los usuarios y optimizar la coordinación operativa entre pasajeros, conductores y empresas operadoras.

A través de la plataforma, los pasajeros pueden consultar líneas, recorridos, paraderos y visualizar en tiempo real la ubicación de los vehículos en circulación. Una vez a bordo, el usuario puede vincularse al vehículo mediante un código QR o identificador manual, seleccionar su paradero de destino y enviar una solicitud digital de parada que reemplaza el timbre físico tradicional. Por su parte, los conductores gestionan sus turnos y recorridos compartiendo su geolocalización y recibiendo alertas visuales y sonoras en tiempo real sobre las detenciones solicitadas, mientras que la administración puede supervisar el cumplimiento del servicio, tiempos de viaje, incidencias y desviaciones respecto a la planificación.

## Tecnologias Utilizadas
* **Frontend (Aplicación Móvil):** React Native, Expo, React Navigation (Native Stack), Axios.
* **Backend (Servidor API REST):** Node.js, Express, CORS.
* **Base de Datos y ORM:** SQLite (`voybus.sqlite`), Sequelize.
* **Herramientas de Desarrollo:** Visual Studio Code, Android Studio Emulator, Git / GitHub.

## Requisitos previos
* **Node.js** (v18 o superior) y **npm** instalados en el sistema.
* **Android Studio** configurado con un emulador Android (AVD) o dispositivo físico con la aplicación **Expo Go**.
* **Git** para el control de versiones.

## Instalacion

Para poner en marcha el proyecto en tu entorno local, asegúrate de seguir estos pasos detallados para el backend y el frontend:

### 1. Clonar el repositorio
Abre la terminal, clonar el repositorio del proyecto e ingresar a la carpeta principal:
```bash
git clone <url-del-repositorio>
cd Proyecto-Desarrollo-Soluciones-Moviles-Miguel-Chacin-Diego-Albornoz
```

### 2. Configuración y ejecución del Backend
El servidor backend está desarrollado en Node.js con Express y utiliza una base de datos SQLite gestionada mediante Sequelize.

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
   *(Dependencias principales: `express`, `sequelize`, `sqlite3`, `cors`, `nodemon`)*

3. **Poblar la base de datos inicial (Seed):**
   Antes de iniciar el servidor por primera vez, ejecuta el script de población para generar el catálogo inicial de datos (líneas, paraderos, vehículos y usuarios de prueba):
   ```bash
   node src/database/seed.js
   ```
   *Esto generará automáticamente el archivo persistente `voybus.sqlite` dentro de la carpeta `backend/src/database/`.*

4. Iniciar el servidor en modo de desarrollo:
   ```bash
   npm run dev
   ```
   *El servidor quedará activo y escuchando en el puerto `8080` (`http://localhost:8080`).*

---

### 3. Configuración y ejecución del Frontend (Aplicación Móvil)
La aplicación móvil está construida con React Native y Expo, diseñada para comunicarse con el backend local.

1. Abre una **nueva pestaña o ventana de la terminal** y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias del cliente móvil:
   ```bash
   npm install
   ```
   *(Dependencias principales: `expo`, `react-native`, `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`, `axios`)*

3. **Verificación de conectividad con la API:**
   Asegúrate de que el archivo cliente de la API (`frontend/src/services/api.js`) esté apuntando correctamente al emulador de Android configurado:
   * **URL base recomendada para Emulador Android:** `http://10.0.2.2:8080/api`

4. Inicia la aplicación móvil con Expo:
   ```bash
   npx expo start
   ```

5. **Abrir en el Emulador:**
   * Con el emulador de Android Studio abierto y activo, presiona la tecla **`a`** directamente en la terminal de Expo para compilar e instalar la aplicación de forma automática en el dispositivo virtual.
   * Alternativamente, puedes escanear el código QR generado en la terminal utilizando la aplicación **Expo Go** en un dispositivo físico conectado a la misma red local Wi-Fi.


## Variables de Entorno

Para facilitar la ejecución en entornos locales de desarrollo, el proyecto viene preconfigurado con valores por defecto. Sin embargo, si deseas personalizar el entorno o preparar un archivo `.env` en el futuro, estos son los parámetros principales:

### 1. Backend (`backend/.env` - Opcional)
Si creas un archivo `.env` en la raíz de la carpeta `backend/`, puedes definir las siguientes variables:

```env
PORT=8080
NODE_ENV=development
DB_STORAGE=./src/database/voybus.sqlite
```

* **`PORT`**: Puerto en el que escucha el servidor Express (por defecto `8080`).
* **`NODE_ENV`**: Entorno de ejecución (`development` por defecto).
* **`DB_STORAGE`**: Ruta del archivo de base de datos SQLite persistente (generado automáticamente en `backend/src/database/voybus.sqlite`).

### 2. Frontend (`frontend/src/services/api.js`)
La URL de conexión hacia la API REST se encuentra centralizada en el cliente HTTP Axios (`api.js`). Dependiendo de dónde ejecutes la aplicación móvil, ajusta la dirección base:

* **Emulador de Android (Android Studio):**
  ```javascript
  baseURL: '[http://10.0.2.2:8080/api](http://10.0.2.2:8080/api)'
  ```
* **Dispositivo Físico (Expo Go en la misma red Wi-Fi):**
  ```javascript
  baseURL: 'http://<TU_IP_LOCAL>:8080/api'
  ```
  *(Reemplaza `<TU_IP_LOCAL>` por la dirección IPv4 de tu computador, por ejemplo: `192.168.1.15`).*

## Ejecucion

Para levantar el entorno completo de **VoyBus**, ejecuta los siguientes comandos en terminales separadas manteniendo el orden indicado:

### 1. Inicializar la Base de Datos (Solo la primera vez)
Desde la carpeta `backend/`, ejecuta el script de semilla (`seed.js`) para crear las tablas y cargar los datos iniciales de líneas, paraderos y vehículos[cite: 25, 29]:

```bash
cd backend
node src/database/seed.js
```
*(Si ya ejecutaste este comando anteriormente, no es necesario repetirlo, ya que los datos persisten en `voybus.sqlite`[cite: 25]).*

---

### 2. Levantar el Servidor Backend
En la misma terminal dentro de `backend/`, inicia el servidor API REST en modo desarrollo:

```bash
npm run dev
```
* **Confirmación esperada:** Verás en consola los mensajes indicando que el servidor corre en el puerto `8080` y que los modelos de Sequelize están sincronizados correctamente con SQLite.
* **Prueba rápida de salud:** Puedes verificar que responde abriendo en tu navegador `http://localhost:8080/api/health`.

---

### 3. Levantar la Aplicación Móvil (Frontend)
Abre una **nueva terminal** en la raíz del proyecto, entra a la carpeta `frontend/` e inicia el servidor de desarrollo de Expo:

```bash
cd frontend
npx expo start
```

* **Para abrir en Android Studio (Emulador):** Con tu dispositivo virtual (AVD) previamente encendido, presiona la tecla **`a`** en la terminal donde ejecutaste Expo.
* **Para abrir en teléfono físico:** Escanea el código QR mostrado en la consola usando la aplicación **Expo Go** (asegúrate de haber configurado tu IP local en `frontend/src/services/api.js`[cite: 26]).

## Estructura del Proyecto

Proyecto-Desarrollo-Soluciones-Moviles-Miguel-Chacin-Diego-Albornoz/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración de conexión a SQLite (database.js)
│   │   ├── controllers/     # Controladores HTTP (auth, trip, passengerTrip)
│   │   ├── database/        # Script de datos iniciales (seed.js) y archivo voybus.sqlite
│   │   ├── middlewares/     # Middlewares de validación
│   │   ├── models/          # Modelos relacionales de Sequelize
│   │   ├── routes/          # Definición de endpoints REST (.routes.js)
│   │   ├── services/        # Lógica de negocio (.service.js)
│   │   ├── utils/           # Utilidades generales
│   │   └── app.js           # Configuración principal de Express y middlewares
│   ├── server.js            # Punto de entrada del servidor
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── screens/         # Vistas principales (DriverScreen, PassengerScreen,ProfileScreen)
│   │   ├── services/        # Cliente HTTP Axios (api.js)
│   │   └── theme/           # Paleta de colores oficial (colors.js)
│   ├── App.js               # Navegación principal (Stack Navigator) y menú de inicio
│   ├── app.json
│   └── package.json
└── README.md

## Documentacion de la API

Todos los endpoints del servidor se exponen bajo el prefijo base `/api` en formato **JSON**.

### 1. Estado del Servidor
* **`GET /api/health`**
  * **Descripción:** Verifica que el servidor Express esté activo y respondiendo correctamente.
  * **Respuesta exitosa (`200 OK`):** Retorna estado operativo del servicio.

### 2. Módulo Acceso y Cuentas (`ACC-01`, `ACC-02`, `ACC-03`)
* **`POST /api/auth/register` (`ACC-01`)**
  * **Descripción:** Permite crear una nueva cuenta de pasajero mediante correo electrónico o teléfono, validando contraseñas seguras (entre 8 y 15 caracteres con mayúsculas, minúsculas, números y símbolos) y previniendo cuentas duplicadas.
* **`POST /api/auth/login` (`ACC-02`)**
  * **Descripción:** Controla el acceso seguro al sistema mediante autenticación, gestionando sesiones de usuario con manejo general de errores en credenciales inválidas y bloqueos por intentos fallidos repetidos.
* **`POST /api/auth/logout` (`ACC-03`)**
  * **Descripción:** Gestiona el cierre de sesión seguro del usuario (`ACC-03`), retirando el acceso a la información privada en el dispositivo.

### 3. Módulo Red de Transporte (`RED-01`, `RED-02`)
* **`GET /api/red/lines` (`RED-01`)**
  * **Descripción:** Permite consultar el catálogo completo de líneas de transporte disponibles, sus sentidos de circulación, horarios, estados del servicio y recorridos (accesible sin iniciar sesión).
* **`GET /api/red/stops` (`RED-02`)**
  * **Descripción:** Permite buscar paraderos por nombre o código, consultar qué líneas pasan por ellos y visualizar su asociación con los recorridos.
* **`GET /api/red/vehicles` (`RED-02` - Visualización de vehículos)**
  * **Descripción:** Muestra en tiempo real los vehículos circulando asociados a una línea específica y con un viaje activo, consultando su última ubicación y hora de actualización sin necesidad de iniciar sesión.

### 4. Módulo Conductor (`VEH-01` / `VEH-02`)
* **`POST /api/trips/start`**
  * **Descripción:** Inicia un viaje asignado al conductor, registrando la hora real de inicio y habilitando el estado activo del recorrido (`VEH-01`).
* **`POST /api/trips/location`**
  * **Descripción:** Actualiza en tiempo real las coordenadas GPS y el avance del vehículo durante el trayecto (`VEH-01`).
* **`POST /api/trips/end`**
  * **Descripción:** Finaliza el viaje en curso, registra la hora de término y detiene la transmisión de ubicación (`VEH-01`).
* **`GET /api/trips/:id_viaje/alerts`**
  * **Descripción:** Obtiene el listado en tiempo real de las solicitudes de parada pendientes para el viaje activo, agrupadas por paradero y ordenadas según el sentido del recorrido (`VEH-02`).

### 5. Módulo Pasajero (`VIA-01` / `VIA-02`)
* **Endpoints bajo `/api/passenger`**
  * **Vinculación a vehículo (`VIA-01`):** Permite asociar al pasajero con un viaje activo mediante escaneo de código QR o ingreso manual del identificador del vehículo, validando que tenga un recorrido en curso y evitando vinculaciones múltiples simultáneas.
  * **Solicitud digital de parada (`VIA-02`):** Permite seleccionar un paradero de destino entre aquellos que el vehículo aún no ha superado y registrar el aviso de detención sin duplicados por viaje.

## Pruebas

Para verificar de forma integral el correcto funcionamiento de todos los módulos del sistema (tanto los implementados como los correspondientes a los requerimientos del equipo) en el entorno local, se recomienda seguir los siguientes flujos de prueba:

### 1. Verificación de Persistencia y Datos Iniciales (Seed)
* **Comando de inicialización:** Ejecutar `node src/database/seed.js` dentro de la carpeta `backend/`.
* **Validación:** Comprobar que se genera correctamente el archivo SQLite persistente (`voybus.sqlite`) con el catálogo inicial requerido (al menos 3 líneas, 10 paraderos y 10 vehículos). Reiniciar el servidor y confirmar que la información persiste intacta entre ejecuciones.

### 2. Módulo Acceso y Cuentas (`ACC-01`, `ACC-02`, `ACC-03`)
* **Registro (`ACC-01`):** Ingresar a la opción de registro, comprobar que se exige un formato de contraseña seguro (entre 8 y 15 caracteres con mayúsculas, minúsculas, números y símbolos) y verificar que el sistema rechaza cuentas con correos o teléfonos duplicados.
* **Inicio de Sesión (`ACC-02`):** Probar el acceso con las credenciales registradas, validando el manejo correcto de errores genéricos ante credenciales inválidas y la gestión de sesiones.
* **Cierre de Sesión (`ACC-03`):** Ingresar a la sección de Perfil/Ajustes, presionar **Cerrar Sesión**, aceptar la confirmación en la alerta emergente y comprobar que la app regresa a la pantalla de acceso bloqueando el retorno a vistas privadas mediante el botón "atrás" del dispositivo.

### 3. Módulo Red de Transporte (`RED-01`, `RED-02`)
* **Líneas y Recorridos (`RED-01`):** Consultar el catálogo de líneas de transporte sin necesidad de iniciar sesión, probando los filtros de búsqueda por nombre/código y la visualización de recorridos, horarios y estados del servicio.
* **Paraderos y Vehículos (`RED-02`):** Buscar paraderos específicos para ver las líneas asociadas y comprobar en el mapa la visualización en tiempo real de los vehículos circulando que poseen viajes activos.

### 4. Módulo Pasajero (`VIA-01`, `VIA-02`)
* **Vinculación (`VIA-01`):** Desde el módulo de pasajero, realizar la vinculación a un viaje activo mediante el ingreso manual del código de vehículo o escaneo, confirmando la línea y el sentido antes de aceptar.
* **Solicitud de Parada (`VIA-02`):** Seleccionar el paradero de destino únicamente entre aquellos que el vehículo aún no ha superado y enviar el aviso digital de detención.

### 5. Módulo Conductor (`VEH-01`, `VEH-02`)
* **Gestión de Viaje y GPS (`VEH-01`):** Desde el panel de conductor, iniciar el viaje asignado registrando la hora de partida y el envío activo de la geolocalización.
* **Recepción de Alertas (`VEH-02`):** Verificar que el conductor recibe en tiempo real las alertas visuales y sonoras de las solicitudes de parada enviadas por los pasajeros, con el contador actualizado y ordenadas según el avance del recorrido.

## Autor(es)
Miguel Chacin y Diego Albornoz