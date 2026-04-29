document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const envelopeContainer = document.getElementById('envelope-container');
    const invitationContent = document.getElementById('invitation-content');
    const rsvpForm = document.getElementById('rsvp-form');

    // Open Envelope Logic
    envelope.addEventListener('click', () => {
        envelope.classList.add('open');
        const hint = document.querySelector('.click-hint');
        if (hint) {
            hint.style.transition = 'opacity 0.3s ease';
            hint.style.opacity = '0';
            setTimeout(() => hint.style.display = 'none', 300);
        }
        
        // Wait for the animation (flap + letter sliding out) to finish
        setTimeout(() => {
            envelopeContainer.style.display = 'none';
            invitationContent.classList.remove('hidden');
            invitationContent.style.opacity = '1';
            
            // Trigger entry animations for hero section
            const heroCard = document.querySelector('.hero-card-container');
            if (heroCard) {
                heroCard.style.animation = 'fadeInUp 1s ease forwards';
            }

            // Start falling petals only after opening
            startPetals();
        }, 2800);
    });

    // RSVP Form Submission to WhatsApp
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(rsvpForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const attendance = formData.get('attendance') === 'yes' ? '✅ Sí, confirmo con alegría' : '❌ Lo siento, no podré asistir';
        const message = formData.get('message');
        
        // Número de WhatsApp al que llegarán los mensajes (Ej. 52 para México + tu número)
        const waNumber = '527202491024'; 
        
        let waText = `¡Hola! Soy *${name}*.\nQuiero confirmar mi respuesta a tu invitación de 18 Años:\n\n*Asistencia:* ${attendance}\n*Correo:* ${email}`;
        
        if (message && message.trim() !== '') {
            waText += `\n\n*Mensaje para ti:*\n"${message}"`;
        }
        
        // Simple visual feedback
        const submitBtn = rsvpForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Redirigiendo a WhatsApp...';
        submitBtn.disabled = true;

        setTimeout(() => {
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');
            
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
            rsvpForm.reset();
        }, 1000);
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add to Calendar Functionality (Simplified)
    const calendarBtn = document.querySelector('.location-info .btn-secondary:last-child');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', () => {
            const event = {
                title: 'Fiesta de 18 Años',
                location: 'Dirección completa del lugar, Ciudad, País',
                description: 'Celebración de mis 18 años.',
                start: '202X0101T180000', // Update with actual date logic if needed
                end: '202X0102T010000'
            };
            
            // In a real app, this would generate an .ics file or redirect to a calendar URL
            alert('Funcionalidad para añadir al calendario próximamente. ¡Anota la fecha!');
        });
    }

    // Rose Petal Generation
    const petalsContainer = document.getElementById('petals-container');
    const petalCount = 25;

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        const size = Math.random() * 15 + 10 + 'px';
        petal.style.width = size;
        petal.style.height = size;
        
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 5 + 5 + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        
        // Random petal shape variation
        const borderRadius = Math.random() * 50 + 50 + '% 0 ' + (Math.random() * 50 + 50) + '% 0';
        petal.style.borderRadius = borderRadius;

        petalsContainer.appendChild(petal);

        // Remove petal after animation to prevent DOM bloat
        setTimeout(() => {
            petal.remove();
            createPetal();
        }, (parseFloat(petal.style.animationDuration) + parseFloat(petal.style.animationDelay)) * 1000);
    }

    function startPetals() {
        for (let i = 0; i < petalCount; i++) {
            setTimeout(createPetal, i * 200);
        }
    }

    // Countdown Timer Logic
    const targetDate = new Date('July 11, 2026 18:00:00').getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            clearInterval(countdownInterval);
            const container = document.querySelector('.countdown-container');
            if(container) container.innerHTML = "<h3 style='color: var(--accent-color); font-size: 2rem;'>¡El día ha llegado!</h3>";
            return;
        }

        // Calculate time units
        // Approximation: 1 month = 30.44 days
        const daysInMonth = 30.44;
        const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
        
        const months = Math.floor(totalDays / daysInMonth);
        const days = Math.floor(totalDays % daysInMonth);
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Update DOM
        const elMonths = document.getElementById('cd-months');
        const elDays = document.getElementById('cd-days');
        const elHours = document.getElementById('cd-hours');
        const elMinutes = document.getElementById('cd-minutes');
        const elSeconds = document.getElementById('cd-seconds');

        if(elMonths) elMonths.innerText = months.toString().padStart(2, '0');
        if(elDays) elDays.innerText = days.toString().padStart(2, '0');
        if(elHours) elHours.innerText = hours.toString().padStart(2, '0');
        if(elMinutes) elMinutes.innerText = minutes.toString().padStart(2, '0');
        if(elSeconds) elSeconds.innerText = seconds.toString().padStart(2, '0');
    }, 1000);

    // Add to Calendar Logic for the Countdown Button
    const addCalendarBtn = document.getElementById('add-calendar-btn');
    if (addCalendarBtn) {
        addCalendarBtn.addEventListener('click', () => {
            // Crear el archivo .ics para la app nativa de calendario
            const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Fiesta de 18 Años de Analy Luna
DTSTART:20260711T180000Z
DTEND:20260712T020000Z
LOCATION:Lugar de la Fiesta
DESCRIPTION:¡Celebración de mis 18 años! No faltes.
END:VEVENT
END:VCALENDAR`;

            // Redirigir usando un data URI fuerza al celular a abrir la app asociada (Calendario)
            const dataUri = 'data:text/calendar;charset=utf8,' + encodeURIComponent(icsContent);
            
            // Usamos un enlace oculto para forzar la descarga/apertura nativa
            const link = document.createElement('a');
            link.href = dataUri;
            link.setAttribute('download', 'invitacion.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Copy to Clipboard Logic for Gifts Section
    const copyBtn = document.getElementById('copy-btn');
    const accountNumberSpan = document.getElementById('account-number');
    
    if (copyBtn && accountNumberSpan) {
        copyBtn.addEventListener('click', () => {
            const textToCopy = accountNumberSpan.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyBtn.innerText;
                copyBtn.innerText = '✔️ ¡Copiado!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                    copyBtn.classList.remove('copied');
                }, 2500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('No se pudo copiar automáticamente. Por favor, selecciona el texto manualmente.');
            });
        });
    }
});

// Custom CSS Animations injected via JS for the reveal
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    #invitation-content {
        transition: opacity 1s ease;
    }
`;
document.head.appendChild(style);

// RSVP Form to WhatsApp
const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const message = document.getElementById('message').value;
        
        const phoneNumber = "527713149904";
        
        let whatsappMessage = `¡Hola! He recibido la invitación a tus 18 Años.%0A%0A`;
        whatsappMessage += `*Nombre:* ${name}%0A`;
        whatsappMessage += `*¿Asistiré?:* ${attendance === 'yes' ? 'Sí, confirmo con alegría 🎉' : 'Lo siento, no podré asistir 😔'}%0A`;
        
        if (message.trim() !== '') {
            whatsappMessage += `*Mensaje:* ${message}`;
        }
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');
    });
}
