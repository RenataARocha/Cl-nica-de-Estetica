document.addEventListener("DOMContentLoaded", () => {
    // =====================================================
    // CONFIGURAÇÕES
    // =====================================================
    const TELEFONE_WHATSAPP = "5584000000000"; // TROQUE PELO NÚMERO REAL!

    // =====================================================
    // ELEMENTOS DO DOM
    // =====================================================
    const dataSelect = document.getElementById("data");
    const horarioSelect = document.getElementById("horario");
    const form = document.getElementById("agendamentoForm");
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const header = document.querySelector(".header");

    // =====================================================
    // HORÁRIOS DISPONÍVEIS
    // =====================================================
    const horarios = [
        "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
    ];

    // =====================================================
    // GERAR DATAS DISPONÍVEIS (PRÓXIMOS 14 DIAS)
    // =====================================================
    function gerarDatas() {
        const hoje = new Date();

        for (let i = 1; i <= 14; i++) {
            const data = new Date();
            data.setDate(hoje.getDate() + i);

            // Pular domingos (0 = domingo)
            if (data.getDay() === 0) continue;

            const opt = document.createElement("option");
            opt.value = data.toISOString().split("T")[0];

            // Formatar data em português
            const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "short" });
            const dataFormatada = data.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

            opt.textContent = `${diaSemana}, ${dataFormatada}`;
            dataSelect.appendChild(opt);
        }
    }

    // =====================================================
    // POPULAR HORÁRIOS QUANDO SELECIONAR DATA
    // =====================================================
    dataSelect.addEventListener("change", () => {
        horarioSelect.innerHTML = '<option value="">Selecione</option>';
        horarioSelect.disabled = false;

        horarios.forEach(h => {
            const opt = document.createElement("option");
            opt.value = h;
            opt.textContent = h;
            horarioSelect.appendChild(opt);
        });
    });

    // =====================================================
    // ENVIAR FORMULÁRIO PARA WHATSAPP
    // =====================================================
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Coletar dados do formulário
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const servico = document.getElementById("servico").value;
        const data = dataSelect.options[dataSelect.selectedIndex].text;
        const horario = horarioSelect.value;

        // Validação
        if (!nome || !telefone || !servico || !data || !horario) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        // Montar mensagem para WhatsApp
        const mensagem = `
🌟 *NOVO AGENDAMENTO*

👤 *Nome:* ${nome}
📱 *Telefone:* ${telefone}
💆‍♀️ *Tratamento:* ${servico}
📅 *Data:* ${data}
🕐 *Horário:* ${horario}

Aguardo confirmação! 😊
    `.trim();

        // Criar URL do WhatsApp
        const url = `https://wa.me/${5584986399847}?text=${encodeURIComponent(mensagem)}`;

        // Abrir WhatsApp em nova aba
        window.open(url, "_blank");

        // Limpar formulário (opcional)
        // form.reset();
        // horarioSelect.disabled = true;
    });

    // =====================================================
    // MENU MOBILE
    // =====================================================
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            mobileMenuToggle.classList.toggle("active");
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll(".nav-menu a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                mobileMenuToggle.classList.remove("active");
            });
        });
    }

    // =====================================================
    // SCROLL SUAVE PARA LINKS INTERNOS
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // =====================================================
    // HEADER SCROLL EFFECT
    // =====================================================
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.padding = "12px 0";
            header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
        } else {
            header.style.padding = "20px 0";
            header.style.boxShadow = "0 2px 20px rgba(0,0,0,0.08)";
        }

        lastScroll = currentScroll;
    });

    // =====================================================
    // ANIMAÇÃO DE ENTRADA DOS ELEMENTOS
    // =====================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    // Observar elementos que devem animar
    document.querySelectorAll(".diferencial-card, .tratamento-card, .contact-item").forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease";
        observer.observe(el);
    });

    // =====================================================
    // MÁSCARA DE TELEFONE
    // =====================================================
    const telefoneInput = document.getElementById("telefone");

    if (telefoneInput) {
        telefoneInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");

            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
                value = value.replace(/(\d)(\d{4})$/, "$1-$2");
            }

            e.target.value = value;
        });
    }

    // =====================================================
    // INICIALIZAR
    // =====================================================
    gerarDatas();

    // Log de inicialização (remover em produção)
    console.log("✅ Sistema de agendamento inicializado!");
    console.log("⚠️ Lembre-se de trocar o número do WhatsApp na linha 6 do script!");
});