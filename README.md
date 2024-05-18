[![Codacy Badge](https://app.codacy.com/project/badge/Grade/0a21a5e1b9114dd0a64c003a44c844c3)](https://app.codacy.com/gh/Neutral-Data/project/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

![Logo](https://i.imgur.com/tjTITye.png)

Este proyecto es un trabajo fin de grado, orientado al desarrollo de una aplicación web destinada a detectar columnas y términos sensibles en conjuntos de datos, tales como géneros y edades, entre otros.

## Instalación

Clonar el repositorio



Primero descargaremos o clonaremos el código desde el repositorio: 
```bash
  git clone https://github.com/Neutral-Data/project.git
```

Backend:

 - Instalación:

 	- Instalamos Java JDK 17 desde la página oficial de Oracle: https://download.oracle.com/java/17/archive/jdk-17_windows-x64_bin.exe o, si estamos en Ubuntu, podemos realizar:
    ```bash
    sudo apt install openjdk-17-jdk
    ```

 	- Instalamos Eclipse. Podemos usar el instalador oficial para nuestro sistema operativo: https://www.eclipse.org/downloads/packages/installer, ejecutamos el instalador y deberemos elegir "Eclipse IDE for Enterprise Java and Web Developers".

	- Descargamos Lombok desde su página oficial: https://projectlombok.org/download, doble click en el .jar o si estamos en ubuntu, desde la terminal en la carpeta donde se descargó el archivo:
   ```bash
   java -jar lombok.jar
   ```

 	- Instalamos Lombok sobre el IDE Eclipse que acabamos de instalar, si no lo detecta automáticamente, deberemos buscar la carpeta donde instalamos Eclipse (en Ubuntu, en mi caso se instaló en /home/usuario/eclipse/).

 	- En Eclipse, importamos la carpeta backend como proyecto Maven existente, para ello pulsamos en "Import Projects..." -> "Maven" -> "Existing Maven Projects"
	
	- Buscamos la carpeta backend e importamos el archivo pom.xml

 	- Para terminar la instalación, desde Eclipse, click derecho sobre el proyecto -> Run As -> Maven Install


 - Ejecución:

 	- En Eclipse, buscaremos el archivo /src/main/java/neutraldata/project/ProjectApplication.java y le daremos click derecho -> Run As -> Java Application


Frontend:

 - Instalación:

 	- Instalamos Node.js v11.15.0, para ello descargamos desde la página oficial: https://nodejs.org/en/download o, si estamos en Ubuntu:
    ```bash
    sudo apt install npm
    ```
    
 	- Instalaremos Visual Studio Code, para ello lo descargamos en su página oficial: https://code.visualstudio.com/download

	- Abriremos la carpeta frontend en VS Code. Si no nos deja (en Ubuntu falla), abriremos la carpeta NeutralData_Angular y desde la terminal:
   ```bash
   cd frontend/
   ```

 	- Abrimos una terminal de VS Code y ejecutamos:
   ```bash
   npm install
   ```

	- Deberemos esperar a que se instalen los paquetes.

 	- A continuación, ejecutamos en la terminal(si estamos en Ubuntu, escribimos antes sudo para darle permisos):
   ```bash
   npm install -g @angular/cli
   ```

 - Ejecución:

 	- En la terminal de VS Code introduciremos:
  ```bash
  ng serve
  ```
    
Ahora la aplicación debería estar corriendo en http://localhost:4200/

Probamos el inicio de sesión, para ello nos dirigimos arriba a la derecha, pulsamos en "Login", luego introducimos como Username: "admin1" y como Password: "admin1".

Pulsamos en "Sign in" y si no hay problemas, la aplicación ya es funcional, pues está funcionando tanto backend como la base de datos.

Si queremos acceder a la base de datos, deberemos introducir en el navegador la url: http://localhost:8080/h2-console

En Driver Class deberemos introducir: "org.h2.Driver".

En JDBC URL deberemos introducir: "jdbc:h2:mem:testdb".

Como User Name escribimos: "sa".

Dejamos el campo de password vacío.

## Autor

- [@IsmaelHerrera2000](https://github.com/IsmaelHerrera2000)

