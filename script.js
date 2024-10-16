function update() {
    if (gameOver) return;

    if (player.jump) {
        player.velocityY = -10;
        player.jump = false;
        player.rotation = 0; // Resetar rotação ao iniciar um novo pulo
    }

    player.velocityY += 0.5; // Gravidade
    player.y += player.velocityY;

    // Atualiza a rotação durante o salto
    if (player.jumpCount > 0) {
        player.rotation += 22.5; // Aumenta a rotação para simular giro de 90 graus
        if (player.rotation >= 10) {
            player.rotation = 0; // Reseta a rotação após completar o giro
        }
    }

    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.jumpCount = 0;
    }

    // Lógica para verificar se o personagem deve sorrir
    if (score > 0 && score % 10 === 0 && !player.smile) {
        smileSound.play(); // Reproduzir som quando o sorriso é ativado
        player.smile = true; // Ativar sorriso
    } else if (score % 10 !== 0) {
        player.smile = false; // Desativar sorriso
    }

    // Lógica de criação de obstáculos
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= 5;

        if (checkCollision(player, obstacles[i])) {
            gameOverSound.play(); // Reproduzir som de game over
            gameOver = true;
            finalScore.textContent = score;
            highScoreElement.textContent = Math.max(score, highScore); // Atualiza o recorde
            highScore = Math.max(score, highScore); // Mantém o recorde
            gameOverScreen.style.display = 'block'; // Mostra a tela de Game Over
            return;
        }

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            i--;
        }
    }

    updateParticles();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save(); // Salvar o contexto
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2); // Mover o contexto para o centro do jogador
    ctx.rotate(player.rotation * Math.PI / 180); // Rotacionar o contexto
    ctx.fillStyle = 'yellow'; // Cor do corpo do jogador
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height); // Desenhar o corpo
    ctx.restore(); // Restaurar o contexto

    // Desenhar a carinha
    drawFace(player.x, player.y);

    // Desenhar os obstáculos com suas cores
    for (let obstacle of obstacles) {
        ctx.fillStyle = obstacle.color; // Define a cor do obstáculo
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    ctx.fillStyle = 'brown';
    for (let particle of particles) {
        ctx.fillRect(particle.x, particle.y, 5, 5);
    }

    requestAnimationFrame(update);
}
