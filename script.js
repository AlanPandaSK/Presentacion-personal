document.addEventListener('DOMContentLoaded', function() {
    // Crear el boton de alternancia de tema dinamicamente y agregarlo al header
    var header = document.querySelector('body > header');
    var themeButton = document.createElement('button');
    themeButton.id = 'theme-toggle';
    themeButton.setAttribute('aria-label', 'Cambiar tema claro/oscuro');
    themeButton.title = 'Cambiar tema claro/oscuro';
    header.appendChild(themeButton);

    var lightModeStyles = document.createElement('style');
    lightModeStyles.id = 'light-mode-styles';
    lightModeStyles.textContent = `
        body.light-mode {
            --color-bg: #f0f2f5;
            --color-bg-secondary: #ffffff;
            --color-bg-card: #ffffff;
            --color-text: #1a1a2e;
            --color-text-secondary: #4a4a6a;
            --color-accent: #0077b6;
            --color-accent-hover: #005f8a;
            --color-warning: #e67e00;
            --color-success: #2d7d46;
            --color-border: #d0d5dd;
            --color-trace: #c0c7cf;
            --color-glow: rgba(0, 119, 182, 0.15);
        }
        body.light-mode section {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
    `;
    document.head.appendChild(lightModeStyles);

    function updateThemeButton() {
        var isLight = document.body.classList.contains('light-mode');
        if (isLight) {
            // Tema claro activo, opcion de cambiar a oscuro
            themeButton.textContent = '[ oscuro ]';
        } else {
            // Tema oscuro activo, opcion de cambiar a claro
            themeButton.textContent = '[ claro ]';
        }
    }

    function applySavedTheme() {
        var savedTheme = localStorage.getItem('portafolio-theme');

        if (savedTheme === 'light') {
            // El usuario eligio claro anteriormente
            document.body.classList.add('light-mode');
        } else if (savedTheme === 'dark') {
            // El usuario eligio oscuro anteriormente
            document.body.classList.remove('light-mode');
        } else {
            // Sin preferencia guardada: usar la del sistema
            var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            if (prefersLight) {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
        }
        updateThemeButton();
    }

    /*
        Alternar el tema cuando se hace clic en el boton
    */
    function toggleTheme() {
        var isLight = document.body.classList.contains('light-mode');

        if (isLight) {
            // Cambiar a oscuro
            document.body.classList.remove('light-mode');
            localStorage.setItem('portafolio-theme', 'dark');
        } else {
            // Cambiar a claro
            document.body.classList.add('light-mode');
            localStorage.setItem('portafolio-theme', 'light');
        }
        updateThemeButton();
    }

    // Asignar el evento click al boton de tema
    themeButton.addEventListener('click', toggleTheme);

    // Aplicar el tema al cargar la pagina
    applySavedTheme();

    /*
       Escuchar cambios en la preferencia del sistema operativo.
       Si el usuario cambia de tema en el SO (ej: de claro a oscuro
       al anochecer), se actualiza automaticamente, pero solo si
       el usuario NO ha elegido manualmente un tema
    */
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
        var userPreference = localStorage.getItem('portafolio-theme');
        // Solo actualizar si el usuario nunca eligio manualmente
        if (!userPreference) {
            if (e.matches) {
                document.body.classList.add('light-mode');
            } else {
                document.body.classList.remove('light-mode');
            }
            updateThemeButton();
        }
    });


    /*
        Formulario
       - Intercepta el envio del formulario
       - Verifica que los campos no se encuentren vacios
       - Valida el formato del correo electronico
       - Muestra mensajes de error/exito en el DOM sin recargar
    */

    // Obtener referencias a los elementos del formulario
    var form = document.querySelector('form');
    var nombreInput = document.getElementById('nombre');
    var emailInput = document.getElementById('email');
    var asuntoInput = document.getElementById('asunto');
    var mensajeTextarea = document.getElementById('mensaje');
    var submitButton = form.querySelector('button[type="submit"]');

    /*
      Crear un elemento de mensaje error o exito
       y posicionarlo despues del elemento indicado
    */
    function createMessageElement(type, text) {
        var message = document.createElement('span');
        message.className = 'form-message form-message--' + type;
        message.textContent = text;
        message.setAttribute('role', 'alert');
        return message;
    }

    /*
       Funcion para eliminar todos los mensajes previos del formulario
       Evita que se acumulen mensajes al validar varias veces
    */
    function clearAllMessages() {
        var messages = form.querySelectorAll('.form-message');
        for (var i = 0; i < messages.length; i++) {
            messages[i].remove();
        }

        // Quitar clases de error de los bordes
        var errorInputs = form.querySelectorAll('.input-error');
        for (var j = 0; j < errorInputs.length; j++) {
            errorInputs[j].classList.remove('input-error');
        }
    }

    /*
       Funcion para marcar un campo como no valido visualmente
       y mostrar un mensaje de error debajo
    */
    function showFieldError(inputElement, messageText) {
        // Agregar clase de error al input (borde rojo)
        inputElement.classList.add('input-error');

        // Crear y agregar mensaje de error después del div contenedor
        var parentDiv = inputElement.closest('div');
        var errorMessage = createMessageElement('error', messageText);
        parentDiv.appendChild(errorMessage);
    }

    /*
       Funcion para validar el formato de un correo electronico.
    */
    function isValidEmail(email) {
        /*
           Expresion regular para validacion de email:
           - ^ : inicio de la cadena
           - [^\s@]+ : uno o mas caracteres que NO son espacio ni @
           - @ : exactamente una arroba
           - [^\s@]+ : uno o mas caracteres que NO son espacio ni @ (dominio)
           - \. : exactamente un punto
           - [^\s@]+ : extension (com, org, mx, etc.)
           - $ : fin de la cadena
        */
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /*
       Funcion principal de validacion
       Se ejecuta cuando el usuario intenta enviar el formulario
       Retorna true si todo es valido, false cuando hay errores
    */
    function validateForm(event) {
        // Prevenir el envio real del formulario (no recarga la pagina)
        event.preventDefault();

        // Limpiar mensajes de error anteriores
        clearAllMessages();

        var isValid = true;  // Asumimos que es valido hasta encontrar errores

        // --- Validar campo Nombre ---
        if (nombreInput.value.trim() === '') {
            showFieldError(nombreInput, 'El nombre es obligatorio.');
            isValid = false;
        }

        // --- Validar campo Email ---
        var emailValue = emailInput.value.trim();
        if (emailValue === '') {
            showFieldError(emailInput, 'El correo electrónico es obligatorio.');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showFieldError(emailInput, 'Ingresa un correo electrónico válido. Ejemplo: nombre@dominio.com');
            isValid = false;
        }

        // --- Validar campo Asunto ---
        if (asuntoInput.value.trim() === '') {
            showFieldError(asuntoInput, 'El asunto es obligatorio.');
            isValid = false;
        }

        // --- Validar campo Mensaje ---
        if (mensajeTextarea.value.trim() === '') {
            showFieldError(mensajeTextarea, 'El mensaje es obligatorio.');
            isValid = false;
        }

        // --- Si todo es valido, mostrar mensaje de exito ---
        if (isValid) {
            // Crear mensaje de exito
            var successMessage = createMessageElement('success', '¡Mensaje enviado con éxito! Gracias por contactarme.');
            // Insertarlo antes del boton de envio
            var lastDiv = form.querySelector('div:last-of-type');
            lastDiv.appendChild(successMessage);

            // Eliminar el mensaje de exito despues de 5 segundos
            setTimeout(function() {
                var successMsg = form.querySelector('.form-message--success');
                if (successMsg) {
                    successMsg.remove();
                }
            }, 5000);
        }

        return isValid;
    }

    // Asignar el evento submit del formulario a la funcion de validacion
    form.addEventListener('submit', validateForm);

    /*
       Eliminar mensajes de error al escribir en un campo
       Cuando el usuario corrige un campo, el error desaparece
    */
    function clearFieldErrorOnInput(event) {
        var input = event.target;
        // Quitar la clase de error visual
        input.classList.remove('input-error');
        // Buscar y eliminar el mensaje de error asociado
        var parentDiv = input.closest('div');
        var errorMessage = parentDiv.querySelector('.form-message--error');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Asignar el evento input a cada campo para limpiar errores al escribir
    nombreInput.addEventListener('input', clearFieldErrorOnInput);
    emailInput.addEventListener('input', clearFieldErrorOnInput);
    asuntoInput.addEventListener('input', clearFieldErrorOnInput);
    mensajeTextarea.addEventListener('input', clearFieldErrorOnInput);


    /*
       MENU HAMBURGUESA PARA CELULAR
       - En pantallas pequeñas, el menu de navegacion se colapsa.
       - Un boton hamburguesa muestra/oculta el menu.
       - Al hacer clic en un enlace, el menu se cierra automaticamente.
    */

    // Obtener referencias a los elementos de navegación
    var nav = document.querySelector('nav');
    var navUl = nav.querySelector('ul');

    // Crear el boton hamburguesa dinamicamente
    var hamburgerButton = document.createElement('button');
    hamburgerButton.id = 'hamburger-menu';
    hamburgerButton.setAttribute('aria-label', 'Abrir menú de navegación');
    hamburgerButton.setAttribute('aria-expanded', 'false');
    hamburgerButton.innerHTML = '&#9776;';  // Entidad HTML del simbolo del boton hamburguesa  
    hamburgerButton.title = 'Menú';

    // Insertar el botan antes de la lista de navegacion
    nav.insertBefore(hamburgerButton, navUl);

    /*
       Alternar la visibilidad del menu
    */
    function toggleMenu() {
        var isOpen = nav.classList.contains('nav-open');
        if (isOpen) {
            // Cerrar menu
            nav.classList.remove('nav-open');
            hamburgerButton.setAttribute('aria-expanded', 'false');
            hamburgerButton.innerHTML = '&#9776;';  // tres rayas para abrir
        } else {
            // Abrir menu
            nav.classList.add('nav-open');
            hamburgerButton.setAttribute('aria-expanded', 'true');
            hamburgerButton.innerHTML = '&#10005;';  // X (equis para cerrar)
        }
    }

    /*
       Cerrar el menu (sin alternar) cuando se hace clic en un enlace de navegacion
    */
    function closeMenu() {
        nav.classList.remove('nav-open');
        hamburgerButton.setAttribute('aria-expanded', 'false');
        hamburgerButton.innerHTML = '&#9776;';  // tres rayas para abrir
    }

    // Asignar evento click al boton hamburguesa
    hamburgerButton.addEventListener('click', toggleMenu);

    /*
       Cerrar el menu al hacer clic en cualquier enlace de navegacion
       Esto evita que el menu quede abierto despues de navegar a una seccion
    */
    var navLinks = navUl.querySelectorAll('a');
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', closeMenu);
    }

    /*
       Cerrar el menu al hacer clic fuera de el.
       Si el usuario hace clic en cualquier parte de la pagina que no sea
       el menu ni el boton hamburguesa, el menu se cierra.
    */
    document.addEventListener('click', function(event) {
        var isClickInsideNav = nav.contains(event.target);
        var isClickOnHamburger = hamburgerButton.contains(event.target);

        // Si el clic NO fue dentro del nav NI en el boton hamburguesa
        if (!isClickInsideNav && !isClickOnHamburger) {
            // Y el menu esta abierto
            if (nav.classList.contains('nav-open')) {
                closeMenu();
            }
        }
    });

});