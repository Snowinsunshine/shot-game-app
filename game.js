class ShotGame {
    constructor() {
        this.gameActive = false;
        this.score = 0;
        this.ammo = 30;
        this.maxAmmo = 30;
        this.timeRemaining = 60;
        this.maxTime = 60;
        this.shotsFired = 0;
        this.shotsHit = 0;
        this.targets = [];
        this.gameAreaElement = document.getElementById('gameArea');
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.gameOverScreen = document.getElementById('gameOver');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.timerInterval = null;
        this.targetInterval = null;

        this.initEventListeners();
    }

    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.playAgainBtn.addEventListener('click', () => this.restartGame());
        this.gameAreaElement.addEventListener('click', (e) => this.handleGameAreaClick(e));
    }

    startGame() {
        this.gameActive = true;
        this.score = 0;
        this.ammo = this.maxAmmo;
        this.timeRemaining = this.maxTime;
        this.shotsFired = 0;
        this.shotsHit = 0;
        this.targets = [];
        this.gameOverScreen.style.display = 'none';

        this.startBtn.disabled = true;
        this.restartBtn.disabled = false;
        this.gameAreaElement.innerHTML = '';

        this.updateUI();
        this.startTimer();
        this.spawnTargets();
    }

    restartGame() {
        this.gameActive = false;
        this.stopTimer();
        clearInterval(this.targetInterval);
        this.gameAreaElement.innerHTML = '';
        this.gameOverScreen.style.display = 'none';
        this.startBtn.disabled = false;
        this.restartBtn.disabled = true;
        this.score = 0;
        this.ammo = this.maxAmmo;
        this.timeRemaining = this.maxTime;
        this.updateUI();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateUI();

            if (this.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    spawnTargets() {
        this.targetInterval = setInterval(() => {
            if (!this.gameActive) return;

            const target = this.createTarget();
            this.targets.push(target);
            this.gameAreaElement.appendChild(target);

            setTimeout(() => {
                if (target.parentNode) {
                    target.remove();
                    this.targets = this.targets.filter(t => t !== target);
                }
            }, 3000);
        }, 800);
    }

    createTarget() {
        const target = document.createElement('div');
        target.className = 'target';
        const x = Math.random() * (this.gameAreaElement.clientWidth - 50);
        const y = Math.random() * (this.gameAreaElement.clientHeight - 50);
        target.style.left = x + 'px';
        target.style.top = y + 'px';
        target.textContent = '🎯';
        target.addEventListener('click', (e) => this.hitTarget(e, target));

        return target;
    }

    handleGameAreaClick(e) {
        if (this.gameActive && e.target === this.gameAreaElement) {
            this.shotsFired++;
            this.ammo--;
            this.updateUI();

            if (this.ammo <= 0) {
                this.endGame();
            }
        }
    }

    hitTarget(e, target) {
        e.stopPropagation();

        if (!this.gameActive) return;

        this.shotsFired++;
        this.ammo--;
        this.shotsHit++;
        this.score += 10;

        target.classList.add('hit');
        this.gameAreaElement.classList.add('flash');
        setTimeout(() => this.gameAreaElement.classList.remove('flash'), 200);

        target.style.pointerEvents = 'none';
        setTimeout(() => {
            target.remove();
            this.targets = this.targets.filter(t => t !== target);
        }, 500);

        this.updateUI();

        if (this.ammo <= 0) {
            this.endGame();
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('ammo').textContent = this.ammo;
        document.getElementById('timer').textContent = this.timeRemaining;
    }

    endGame() {
        this.gameActive = false;
        this.stopTimer();
        clearInterval(this.targetInterval);

        const accuracy = this.shotsFired > 0 ? Math.round((this.shotsHit / this.shotsFired) * 100) : 0;

        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('shotsFired').textContent = this.shotsFired;
        document.getElementById('accuracy').textContent = accuracy;

        this.gameOverScreen.style.display = 'flex';
        this.startBtn.disabled = false;
        this.restartBtn.disabled = true;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShotGame();
});