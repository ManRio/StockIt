
# **StockIt: Sistema de Gestión de Inventarios para PYMEs**

**StockIt** es una aplicación web diseñada para pequeñas y medianas empresas (PYMEs) que necesitan gestionar de manera eficiente su inventario, productos, ventas y reportes. Es una plataforma SaaS (Software como Servicio) que permite a las empresas gestionar sus operaciones con facilidad, sin necesidad de inversiones en infraestructura costosa.

## **Índice**

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Tecnologías Usadas](#tecnologías-usadas)
3. [Instalación](#instalación)
4. [Funcionalidades](#funcionalidades)
5. [Pruebas Realizadas](#pruebas-realizadas)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [Cómo Contribuir](#cómo-contribuir)
8. [Vías Futuras](#vías-futuras)
9. [Licencia](#licencia)

---

## **Descripción del Proyecto**

**StockIt** es una solución web de **gestión de inventarios**, pensada para pequeñas empresas que desean optimizar sus procesos operativos de forma simple y eficiente. La aplicación permite gestionar productos, registrar ventas, generar reportes y consultar el estado de inventarios en tiempo real.

### **Objetivo del Proyecto**

El objetivo principal es ofrecer una herramienta accesible y fácil de usar para pequeñas empresas, con un enfoque en la **sencillez**, **accesibilidad** y **bajo costo**.

### **Motivación**

Muchas pequeñas empresas gestionan su inventario de manera manual, usando hojas de cálculo o sistemas rudimentarios que pueden llevar a errores y pérdidas económicas. Con **StockIt**, se busca ofrecer una plataforma que permita a las empresas realizar estas gestiones de manera eficiente y desde cualquier lugar.

---

## **Tecnologías Usadas**

**StockIt** utiliza las siguientes tecnologías para el desarrollo de la plataforma:

- **Frontend:**
  - **React**: Librería JavaScript para la construcción de interfaces dinámicas y responsivas.
  - **Tailwind CSS**: Framework CSS para un diseño limpio y moderno.

- **Backend:**
  - **Spring Boot**: Framework para Java que permite crear una API RESTful robusta y escalable.
  - **JWT (JSON Web Tokens)**: Para la autenticación y autorización de usuarios.

- **Base de Datos:**
  - **MySQL**: Sistema de gestión de bases de datos relacional utilizado para almacenar información sobre productos, ventas y usuarios.

- **Herramientas de Desarrollo:**
  - **IntelliJ IDEA**: IDE utilizado para el desarrollo de la aplicación.
  - **Git**: Para el control de versiones y colaboración en equipo.

---

## **Instalación**

### **Requisitos Previos**

1. Tener **Java 11 o superior** instalado en tu máquina.
2. Tener **Node.js** y **npm** instalados para el frontend.
3. Tener **MySQL** instalado y configurado para la base de datos.

### **Pasos para la instalación**

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/StockIt.git
   cd StockIt
   ```

2. **Instalar las dependencias del frontend:**

   Dentro de la carpeta del proyecto, ejecuta:

   ```bash
   cd frontend
   npm install
   ```

3. **Configurar la base de datos:**

   - Crea una base de datos en MySQL llamada `stockit_db`.
   - Ajusta la configuración de la base de datos en el archivo `application.properties` dentro de la carpeta `backend/src/main/resources`.

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/stockit_db
   spring.datasource.username=usuario
   spring.datasource.password=contraseña
   ```

4. **Ejecutar el Backend:**

   Para iniciar el servidor backend, navega a la carpeta `backend` y ejecuta el siguiente comando:

   ```bash
   ./mvnw spring-boot:run
   ```

5. **Ejecutar el Frontend:**

   Dentro de la carpeta `frontend`, ejecuta:

   ```bash
   npm start
   ```

   Esto iniciará la aplicación web en `http://localhost:3000`.

---

## **Funcionalidades**

- **Gestión de Productos:** Añadir, editar y eliminar productos del inventario.
- **Registro de Ventas:** Crear ventas y gestionar los productos vendidos.
- **Generación de Reportes:** Visualizar reportes de ventas y estado del inventario.
- **Autenticación de Usuarios:** Gestión de roles de usuario con JWT (Administrador y Empleado).

---

## **Pruebas Realizadas**

Durante el desarrollo del proyecto, se realizaron varias pruebas para asegurar el funcionamiento correcto de la aplicación:

- **Pruebas Funcionales:**
  - Validación de las funcionalidades de gestión de productos, ventas y reportes.
  
- **Pruebas de Seguridad:**
  - Implementación de **JWT** para la autenticación y validación de usuarios.

- **Pruebas de Rendimiento:**
  - Se evaluaron los tiempos de carga y respuesta del sistema bajo diferentes condiciones de carga.

---

## **Estructura del Proyecto**

El proyecto está organizado de la siguiente manera:

```
StockIt/
│
├── backend/                  # Backend con Spring Boot
│   ├── src/
│   ├── application.properties
│   └── pom.xml
│
├── frontend/                 # Frontend con React
│   ├── public/
│   ├── src/
│   └── package.json
│
└── README.md                 # Este archivo
```

---

## **Cómo Contribuir**

Si deseas contribuir al proyecto, sigue estos pasos:

1. **Haz un fork del repositorio.**
2. **Crea una nueva rama** para tu funcionalidad o corrección.
3. Realiza los cambios y asegúrate de que las pruebas estén pasando.
4. **Envía un pull request** con una descripción detallada de los cambios realizados.

---

## **Vías Futuras**

1. **Integración con hardware IoT (lectores QR, RFID, balanzas electrónicas).**
2. **Nuevas funcionalidades:** Gestión de proveedores, órdenes de compra, facturación.
3. **Desarrollo de una aplicación móvil** y soporte **offline**.
4. **Implementación de Inteligencia Artificial** para optimizar el inventario y realizar análisis predictivos.
5. **Escalabilidad y migración a microservicios** para una mejor performance.

---

## **Licencia**

Este proyecto está bajo la **Licencia MIT**. Consulta el archivo **LICENSE** para más detalles.
