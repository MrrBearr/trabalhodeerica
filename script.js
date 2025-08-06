class LinearFunctionGame {
    constructor() {
        this.canvas = document.getElementById('graph');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.currentA = 1;
        this.currentB = 0;
        this.targetPoints = [];
        this.tolerance = 0.5;
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateChallenge();
        this.drawGraph();
    }

    initializeElements() {
        this.sliderA = document.getElementById('slider-a');
        this.sliderB = document.getElementById('slider-b');
        this.valueA = document.getElementById('value-a');
        this.valueB = document.getElementById('value-b');
        this.coefA = document.getElementById('coef-a');
        this.coefB = document.getElementById('coef-b');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.livesElement = document.getElementById('lives');
        this.challengeText = document.getElementById('challenge-text');
        this.checkButton = document.getElementById('check-answer');
        this.nextButton = document.getElementById('next-level');
    }

    setupEventListeners() {
        this.sliderA.addEventListener('input', (e) => {
            this.currentA = parseFloat(e.target.value);
            this.updateDisplay();
            this.drawGraph();
        });

        this.sliderB.addEventListener('input', (e) => {
            this.currentB = parseFloat(e.target.value);
            this.updateDisplay();
            this.drawGraph();
        });

        this.checkButton.addEventListener('click', () => {
            this.checkAnswer();
        });

        this.nextButton.addEventListener('click', () => {
            this.nextLevel();
        });
    }

    updateDisplay() {
        this.valueA.textContent = this.currentA.toFixed(1);
        this.valueB.textContent = this.currentB.toFixed(1);
        this.coefA.textContent = this.currentA.toFixed(1);
        this.coefB.textContent = this.currentB >= 0 ? this.currentB.toFixed(1) : this.currentB.toFixed(1);
    }

    drawGraph() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Limpar canvas
        ctx.clearRect(0, 0, width, height);
        
        // Configurar sistema de coordenadas
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 20;
        
        // Desenhar grade
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        // Linhas verticais
        for (let x = 0; x <= width; x += scale) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Linhas horizontais
        for (let y = 0; y <= height; y += scale) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Desenhar eixos
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 2;
        
        // Eixo X
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        
        // Eixo Y
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();
        
        // Desenhar números nos eixos
        ctx.fillStyle = '#4a5568';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        // Números no eixo X
        for (let i = -10; i <= 10; i++) {
            if (i !== 0) {
                const x = centerX + i * scale;
                if (x >= 0 && x <= width) {
                    ctx.fillText(i.toString(), x, centerY + 15);
                }
            }
        }
        
        // Números no eixo Y
        ctx.textAlign = 'right';
        for (let i = -10; i <= 10; i++) {
            if (i !== 0) {
                const y = centerY - i * scale;
                if (y >= 0 && y <= height) {
                    ctx.fillText(i.toString(), centerX - 5, y + 4);
                }
            }
        }
        
        // Desenhar função linear
        ctx.strokeStyle = '#3182ce';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const startX = -12;
        const endX = 12;
        const startY = this.currentA * startX + this.currentB;
        const endY = this.currentA * endX + this.currentB;
        
        const canvasStartX = centerX + startX * scale;
        const canvasStartY = centerY - startY * scale;
        const canvasEndX = centerX + endX * scale;
        const canvasEndY = centerY - endY * scale;
        
        ctx.moveTo(canvasStartX, canvasStartY);
        ctx.lineTo(canvasEndX, canvasEndY);
        ctx.stroke();
        
        // Desenhar pontos alvo
        this.targetPoints.forEach(point => {
            const canvasX = centerX + point.x * scale;
            const canvasY = centerY - point.y * scale;
            
            ctx.fillStyle = '#f56565';
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.strokeStyle = '#c53030';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Adicionar rótulo do ponto
            ctx.fillStyle = '#2d3748';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`(${point.x}, ${point.y})`, canvasX, canvasY - 15);
        });
        
        // Destacar intercepto Y
        if (Math.abs(this.currentB) <= 10) {
            const interceptY = centerY - this.currentB * scale;
            ctx.fillStyle = '#48bb78';
            ctx.beginPath();
            ctx.arc(centerX, interceptY, 6, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    generateChallenge() {
        this.targetPoints = [];
        
        switch (this.level) {
            case 1:
                // Nível 1: Função simples passando por dois pontos
                this.targetPoints = [
                    { x: 0, y: 2 },
                    { x: 2, y: 4 }
                ];
                this.challengeText.textContent = "Faça a reta passar pelos pontos (0, 2) e (2, 4)";
                break;
                
            case 2:
                // Nível 2: Função com intercepto diferente
                this.targetPoints = [
                    { x: -1, y: 1 },
                    { x: 1, y: 5 }
                ];
                this.challengeText.textContent = "Faça a reta passar pelos pontos (-1, 1) e (1, 5)";
                break;
                
            case 3:
                // Nível 3: Função decrescente
                this.targetPoints = [
                    { x: 0, y: 3 },
                    { x: 3, y: 0 }
                ];
                this.challengeText.textContent = "Faça a reta passar pelos pontos (0, 3) e (3, 0)";
                break;
                
            case 4:
                // Nível 4: Função com coeficientes decimais
                this.targetPoints = [
                    { x: -2, y: -1 },
                    { x: 2, y: 3 }
                ];
                this.challengeText.textContent = "Faça a reta passar pelos pontos (-2, -1) e (2, 3)";
                break;
                
            default:
                // Níveis avançados: pontos aleatórios
                const x1 = Math.floor(Math.random() * 8) - 4;
                const x2 = Math.floor(Math.random() * 8) - 4;
                const y1 = Math.floor(Math.random() * 10) - 5;
                const y2 = Math.floor(Math.random() * 10) - 5;
                
                if (x1 !== x2) {
                    this.targetPoints = [
                        { x: x1, y: y1 },
                        { x: x2, y: y2 }
                    ];
                    this.challengeText.textContent = `Faça a reta passar pelos pontos (${x1}, ${y1}) e (${x2}, ${y2})`;
                } else {
                    this.generateChallenge(); // Regenerar se x1 = x2
                }
                break;
        }
    }

    checkAnswer() {
        let correct = true;
        
        for (let point of this.targetPoints) {
            const expectedY = this.currentA * point.x + this.currentB;
            const difference = Math.abs(expectedY - point.y);
            
            if (difference > this.tolerance) {
                correct = false;
                break;
            }
        }
        
        if (correct) {
            this.score += this.level * 10;
            this.scoreElement.textContent = this.score;
            
            this.checkButton.style.display = 'none';
            this.nextButton.style.display = 'inline-block';
            
            // Animação de sucesso
            document.querySelector('.challenge-area').classList.add('correct-answer');
            this.challengeText.textContent = "🎉 Parabéns! Resposta correta!";
            
            // Tocar som de sucesso (se disponível)
            this.playSuccessSound();
            
        } else {
            this.lives--;
            this.updateLives();
            
            // Animação de erro
            document.querySelector('.challenge-area').classList.add('wrong-answer');
            this.challengeText.textContent = "❌ Tente novamente! Ajuste os coeficientes.";
            
            setTimeout(() => {
                document.querySelector('.challenge-area').classList.remove('wrong-answer');
                this.generateChallengeText();
            }, 2000);
            
            if (this.lives <= 0) {
                this.gameOver();
            }
        }
        
        setTimeout(() => {
            document.querySelector('.challenge-area').classList.remove('correct-answer');
        }, 2000);
    }

    generateChallengeText() {
        const points = this.targetPoints.map(p => `(${p.x}, ${p.y})`).join(' e ');
        this.challengeText.textContent = `Faça a reta passar pelos pontos ${points}`;
    }

    nextLevel() {
        this.level++;
        this.levelElement.textContent = this.level;
        
        // Reset sliders
        this.currentA = 1;
        this.currentB = 0;
        this.sliderA.value = 1;
        this.sliderB.value = 0;
        this.updateDisplay();
        
        this.generateChallenge();
        this.drawGraph();
        
        this.checkButton.style.display = 'inline-block';
        this.nextButton.style.display = 'none';
        
        // Aumentar dificuldade
        if (this.level > 4) {
            this.tolerance = Math.max(0.2, this.tolerance - 0.05);
        }
    }

    updateLives() {
        const hearts = '❤️'.repeat(this.lives) + '🖤'.repeat(3 - this.lives);
        this.livesElement.textContent = hearts;
    }

    gameOver() {
        alert(`Game Over! Sua pontuação final: ${this.score} pontos.\nVocê chegou ao nível ${this.level}!`);
        
        // Reset do jogo
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.tolerance = 0.5;
        
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.updateLives();
        
        this.currentA = 1;
        this.currentB = 0;
        this.sliderA.value = 1;
        this.sliderB.value = 0;
        this.updateDisplay();
        
        this.generateChallenge();
        this.drawGraph();
        
        this.checkButton.style.display = 'inline-block';
        this.nextButton.style.display = 'none';
    }

    playSuccessSound() {
        // Criar um som simples usando Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio não disponível');
        }
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new LinearFunctionGame();
});

// Adicionar algumas funções utilitárias para melhorar a experiência
document.addEventListener('keydown', (e) => {
    // Permitir usar as setas do teclado para ajustar os sliders
    const sliderA = document.getElementById('slider-a');
    const sliderB = document.getElementById('slider-b');
    
    if (e.target === sliderA || e.target === sliderB) {
        if (e.key === 'ArrowLeft') {
            e.target.value = parseFloat(e.target.value) - parseFloat(e.target.step);
            e.target.dispatchEvent(new Event('input'));
        } else if (e.key === 'ArrowRight') {
            e.target.value = parseFloat(e.target.value) + parseFloat(e.target.step);
            e.target.dispatchEvent(new Event('input'));
        }
    }
    
    // Atalhos do teclado
    if (e.key === 'Enter') {
        document.getElementById('check-answer').click();
    } else if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        const nextButton = document.getElementById('next-level');
        if (nextButton.style.display !== 'none') {
            nextButton.click();
        }
    }
});

// Adicionar tooltips informativos
const addTooltips = () => {
    const sliderA = document.getElementById('slider-a');
    const sliderB = document.getElementById('slider-b');
    
    sliderA.title = "Use as setas ← → para ajustes finos";
    sliderB.title = "Use as setas ← → para ajustes finos";
    
    document.getElementById('check-answer').title = "Pressione Enter para verificar";
    document.getElementById('next-level').title = "Pressione Espaço para continuar";
};

// Adicionar tooltips quando a página carregar
document.addEventListener('DOMContentLoaded', addTooltips);
