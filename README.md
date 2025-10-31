# AplicacionProyectoSoftware

# express-mvc
#Proyecto express
Este proyecvto va atener una arquitectura monolítica patrón de arquitectura **por capas MVC (Modelo Vista controlador)**
```
Capa de presentación (vista): Es la capa que interactua con el usuario.

Capa de Negocio (Controlador): Es la capa que se encarga de procesar la lógica del negocio

Capa de Persistencia (modelo): Es la capa en donde la información se procesa para ser almacenada en la BD
```
### Estructura de Proyecto

-**`config/`**: Configuración de la aplicación.
-**`controller/`**: Controladores de la aplicación.
-**`models/`**: Modelos o esquemas de la base de datos.
-**`public/`**: Recursos estáticos de la aplicación.
-**`routes/`**: Rutas de la aplicación.
-**`services/`**: Servicios que conectan y envian la información a la base de datos.
-**`util/`**: Funciones adikcionales para procesos (funcionalidades) pequeñas.
-**`views/`**: Vistas de la aplicación.

### Tecnologías a utilizar
-**`express/`**: Framewolrk minimalista para crear servidores web con JavaScript.
-**`ejs/`**: Motor de plantillas que permite incluir lógica en las vistas.
-**`Node.js/`**: Entorno de ejecución de JavaScript del lado del servidor.
-**`Mongo DB/`**: Base de datos NoSQL orientada a documentos.

###Base de datos


### Operaciones

### Rutas

### Pruebas Unitarias o Manuales


### Flujo de la aplicación

Usuario->Ruta HTTP (get obtener información post registrar o crear datos put actualizar datos delete eliminar datos )->Controlador(Recibe las peticiones HTTP req)<->Modelo (Manejar la estructura de los datos)->Almacenar en un documento en BD
                    |(respuestas que envia a la vista res)
                    Vista (ejs)
                    |
                    Usuario

### Mensajes comunes de los commit

feat: agregar nuevas funcionalidades
fix: corregir bug
doc: actualizar documentación
refactor: refactorizar código
test: agregar test
chore: cambios en configuración
style: mejosras en los estilos
