// Script para o aplauso interativo

document.addEventListener('DOMContentLoaded', function() {
    const leftHand = document.getElementById('leftHand');
    const rightHand = document.getElementById('rightHand');
    const clapSound = document.getElementById('clapSound');
    const container = document.querySelector('.container');
    
    // Variáveis de controle
    let isClapping = false;
    let clapTimeout;
    let lastClapTime = 0;
    
    // Função para criar partículas
    function createParticles(x, y) {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Posição aleatória ao redor do centro
            const randomX = x + (Math.random() - 0.5) * 100;
            const randomY = y + (Math.random() - 0.5) * 100;
            
            particle.style.left = randomX + 'px';
            particle.style.top = randomY + 'px';
            
            // Propriedades aleatórias para variedade
            const size = Math.random() * 4 + 2;
            const speed = Math.random() * 1000 + 500;
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.animationDuration = (speed / 1000) + 's';
            
            container.appendChild(particle);
            
            // Remover partícula após animação
            setTimeout(() => {
                particle.remove();
            }, speed);
        }
    }
    
    // Função para tocar o som de aplauso
    function playClapSound() {
        // Resetar o som se já estiver tocando
        clapSound.currentTime = 0;
        clapSound.play().catch(e => {
            console.log('Reprodução de áudio bloqueada:', e);
        });
    }
    
    // Função para iniciar o aplauso
    function startClap(e) {
        const now = Date.now();
        
        // Evitar múltiplos toques rápidos
        if (now - lastClapTime < 200) return;
        lastClapTime = now;
        
        if (!isClapping) {
            isClapping = true;
            
            // Adicionar classe de animação
            container.classList.add('clapping');
            
            // Obter posição do toque/click
            const rect = container.getBoundingClientRect();
            const x = e.clientX || (e.touches && e.touches[0].clientX) || rect.width / 2;
            const y = e.clientY || (e.touches && e.touches[0].clientY) || rect.height / 2;
            
            // Criar partículas
            createParticles(x, y);
            
            // Tocar som
            playClapSound();
            
            // Remover classe após animação
            clearTimeout(clapTimeout);
            clapTimeout = setTimeout(() => {
                container.classList.remove('clapping');
                isClapping = false;
            }, 300);
        }
    }
    
    // Eventos de clique e toque
    leftHand.addEventListener('mousedown', startClap);
    leftHand.addEventListener('touchstart', startClap, { passive: true });
    
    rightHand.addEventListener('mousedown', startClap);
    rightHand.addEventListener('touchstart', startClap, { passive: true });
    
    // Eventos para desktop
    document.addEventListener('mousedown', (e) => {
        // Verificar se o clique foi nas mãos
        if (e.target.closest('.hand')) {
            startClap(e);
        }
    });
    
    // Eventos para mobile
    document.addEventListener('touchstart', (e) => {
        // Verificar se o toque foi nas mãos
        if (e.target.closest('.hand')) {
            startClap(e);
        }
    }, { passive: true });
    
    // Feedback visual ao pressionar
    const hands = document.querySelectorAll('.hand');
    
    hands.forEach(hand => {
        hand.addEventListener('mousedown', () => {
            hand.style.transform = 'scale(0.95)';
        });
        
        hand.addEventListener('mouseup', () => {
            hand.style.transform = '';
        });
        
        hand.addEventListener('mouseleave', () => {
            hand.style.transform = '';
        });
        
        hand.addEventListener('touchstart', () => {
            hand.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        hand.addEventListener('touchend', () => {
            hand.style.transform = '';
        }, { passive: true });
    });
    
    // Mensagem de instruções que desaparece após primeiro toque
    const instructions = document.querySelector('.instructions');
    
    function hideInstructions() {
        instructions.style.opacity = '0';
        instructions.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            instructions.style.display = 'none';
        }, 300);
    }
    
    // Esconder instruções após 3 segundos ou no primeiro toque
    setTimeout(hideInstructions, 3000);
    
    hands.forEach(hand => {
        hand.addEventListener('mousedown', hideInstructions);
        hand.addEventListener('touchstart', hideInstructions, { passive: true });
    });
    
    // Carregar som automaticamente (para navegadores que permitem)
    clapSound.load();
    
    // Tentar carregar som silenciosamente para teste
    clapSound.volume = 0;
    clapSound.play().then(() => {
        clapSound.pause();
        clapSound.currentTime = 0;
        clapSound.volume = 1; // Restaurar volume
    }).catch(() => {
        // Se falhar, o som será carregado no primeiro toque
        clapSound.volume = 1;
    });
});