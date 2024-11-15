// Get DOM elements
const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const obstacle2 = document.getElementById('obstacle2');
const scoreElement = document.getElementById('score');
const collisionSound = document.getElementById('collision-sound');
const jumpSound = document.getElementById('jump-sound');
const gameOverOverlay = document.getElementById('game-over-overlay');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const startOverlay = document.getElementById('start-overlay');
const startButton = document.getElementById('start-button');
const grass = document.getElementById('grass'); // Element for grass animation
const runImages = ['image/Mickiv Walk Cycle-01.png', 'image/Mickiv Walk Cycle-02.png', 'image/Mickiv Walk Cycle-03.png'];
const initialCactusSpeed = 7// Store initial cactus speed
const initialObstacle2Speed = 7;
const stepSound = document.getElementById('step-sound'); // Ambil elemen suara langkah
const obstacle3 = document.getElementById('obstacle3');
const winScreen = document.getElementById('win-screen');
const initialObstacle3Speed = 5; // Store initial speed for reset
const mickiv = document.getElementById('mickiv');
const backgroundAudio = document.getElementById('background-audio');
const backgroundSound = document.getElementById('background-sound');
const volumeSlider = document.getElementById('volume-slider');
const muteButton = document.getElementById('mute-button');
const closeSettingsButton = document.getElementById('close-settings-button');
const volumeSliderSettings = document.getElementById('volume-slider-settings');
const themeSelector = document.getElementById('theme-selector');

let isMuted = false;

// Handle volume change
volumeSliderSettings.addEventListener('input', (event) => {
  const volume = event.target.value;
  // Set the volume for all audio elements
  document.getElementById('background-sound').volume = volume;
  document.getElementById('jump-sound').volume = volume;
  document.getElementById('step-sound').volume = volume;
  document.getElementById('collision-sound').volume = volume;
});

// Handle theme change
themeSelector.addEventListener('change', (event) => {
  const theme = event.target.value;
  if (theme === 'dark') {
    document.body.style.backgroundColor = '#333'; // Dark background
    document.body.style.color = '#fff'; // Light text
  } else {
    document.body.style.backgroundColor = '#fff'; // Light background
    document.body.style.color = '#000'; // Dark text
  }
});

// Set initial volume
backgroundSound.volume = volumeSlider.value;

// Event listener for volume slider
volumeSlider.addEventListener('input', (event) => {
    backgroundSound.volume = event.target.value; // Adjust volume based on slider value
});

// Fungsi untuk memulai background sound
function playBackgroundSound() {
  if (!isMuted) {
    backgroundSound.play().catch(error => {
      console.error("Error playing background sound:", error);
    });
  }
}

// Fungsi untuk pause background sound
function pauseBackgroundSound() {
  backgroundSound.pause();
}

// Event listener pada tombol mute
muteButton.removeEventListener('click', toggleMute);
muteButton.addEventListener('click', toggleMute);

// Putar audio otomatis ketika halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  playBackgroundSound();
});

function setViewportHeight() {
  // Hitung tinggi viewport dalam pixel
  let vh = window.innerHeight * 0.01; 
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set `--vh` pada awal dan saat ukuran layar berubah
setViewportHeight();
window.addEventListener('resize', setViewportHeight);

// Function to display and move obstacle3
function moveObstacle3() {
    if (!gameStarted) {
        clearInterval(moveObstacle3Interval); // Clear the interval if game is not started
        return;
      }

    moveObstacle3Interval = setInterval(() => {
        let currentRight = parseInt(obstacle3.style.right, 10);
        obstacle3.style.right = currentRight + obstacle3Speed + 'px';
  
        if (currentRight >= window.innerWidth) {
            obstacle3.style.right = '-20px'; // Reset position to start
        }
    }, 20);
}

function startGame() {
  lockToLandscape();
  backgroundSound.pause();
  backgroundSound.currentTime = 0;

  startOverlay.style.display = 'none';
  dino.style.display = 'block';
  cactus.style.display = 'block';
  obstacle2.style.display = 'block';
  obstacle3.style.display = 'block';

  cactusSpeed = initialCactusSpeed;
  obstacle2Speed = initialObstacle2Speed;
  obstacle3Speed = initialObstacle3Speed;

  // Atur posisi awal berdasarkan lebar layar
  cactus.style.right = `${-0.2 * window.innerWidth}px`; // Posisi cactus 20% dari lebar layar
  obstacle2.style.right = `${-0.7 * window.innerWidth}px`; // Posisi obstacle2 50% dari lebar layar
  obstacle3.style.right = `${-0.4 * window.innerWidth}px`; // Posisi obstacle3 40% dari lebar layar

  if (grass) grass.style.animation = 'grass-animation infinite linear';

  startRunAnimation();
  gameStarted = true;
  gameInterval = setInterval(updateGame, 20);
  moveObstacle3();
}

function gameOver() {
  if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();  // Unlock orientation

      pauseBackgroundSound();
  }

  // Stop the game animation by clearing the animation property
  const gameContainer = document.getElementById('game-container');
  gameContainer.style.animation = 'none'; // Stop background animation

  // Stop the game intervals
  clearInterval(gameInterval);
  clearInterval(moveObstacle3Interval);
  clearInterval(backgroundAnimationInterval); // Ensure this is cleared

  // Pause all sounds
  stepSound.pause();
  backgroundSound.pause();
  jumpSound.pause();

  // Reset the playback position for sounds
  stepSound.currentTime = 0;
  backgroundSound.currentTime = 0;
  jumpSound.currentTime = 0;

  // Show the game over overlay
  gameOverOverlay.style.display = 'flex';

  // Display final score
  finalScore.textContent = `Your score: ${score}`;

  // Show obstacle3 in the overlay
  obstacle3.style.display = 'block';
  obstacle3.style.position = 'absolute'; 
  obstacle3.style.right = '50%'; // Center it horizontally in the overlay
  obstacle3.style.bottom = '20px'; // Adjust as needed for vertical positioning

  // Hide game elements
  dino.style.display = 'none';
  cactus.style.display = 'none';
  obstacle2.style.display = 'none';

  // Reset variables if necessary
  isGameOver = true;
  score = 0;

  // Optionally, restart background sound for game over screen or menu
  backgroundSound.play(); // Play background sound again after game over
}

function updateGame() {
  if (!gameStarted || isGameOver) return;

  // Update posisi berdasarkan kecepatan
  const cactusPosition = parseInt(window.getComputedStyle(cactus).getPropertyValue('right'));
  cactus.style.right = `${cactusPosition + cactusSpeed}px`;

  const obstacle2Position = parseInt(window.getComputedStyle(obstacle2).getPropertyValue('right'));
  obstacle2.style.right = `${obstacle2Position + obstacle2Speed}px`;

  const obstacle3Position = parseInt(window.getComputedStyle(obstacle3).getPropertyValue('right'));
  obstacle3.style.right = `${obstacle3Position + obstacle3Speed}px`;

  // Reset posisi jika keluar dari layar, sesuaikan dengan lebar layar
  if (cactusPosition > window.innerWidth) {
      cactus.style.right = `${-0.2 * window.innerWidth}px`;
      score++;
      scoreElement.innerText = `Score: ${score}`;
  }

  if (obstacle2Position > window.innerWidth) {
      obstacle2.style.right = `${-0.5 * window.innerWidth}px`;
      score++;
      scoreElement.innerText = `Score: ${score}`;
  }

  if (obstacle3Position > window.innerWidth) {
      obstacle3.style.right = `${-0.4 * window.innerWidth}px`;
      score++;
      scoreElement.innerText = `Score: ${score}`;
  }

  // Cek untuk benturan
  if (detectCollision(cactus) || detectCollision(obstacle2)) {
      isGameOver = true;
      collisionSound.play();
      finalScore.innerText = score;
      gameOverOverlay.style.display = 'flex';
      clearInterval(runAnimationInterval);
  }
}

function restartGame() {
  // Menghapus animasi background dengan cara reset class
  const gameContainer = document.getElementById('game-container');
  
  // Hentikan animasi dengan menghapus class dan menambahkannya lagi
  gameContainer.style.animation = 'none';
  gameContainer.offsetHeight; // Trik untuk memaksa browser merender ulang elemen
  gameContainer.style.animation = 'fadeIn 1s forwards, moveBackground 70s linear infinite';

  // Lanjutkan proses restart lainnya (seperti reset score, posisi dino, dll.)
  // ...
}

function restartGame() {
  // Menghentikan interval dan animasi game
  clearInterval(gameInterval);
  clearInterval(moveObstacle3Interval);
  clearInterval(runAnimationInterval);
  
  isGameOver = false;
  score = 0;

  // Reset posisi objek
  cactus.style.right = '-100px';
  obstacle2.style.right = '-700px';
  obstacle3.style.right = '-400px';
  
  scoreElement.innerText = `Score: ${score}`;
  
  // Sembunyikan overlay game over
  gameOverOverlay.style.display = 'none';
  
  backgroundSound.play();

  // Reset posisi dan tampilan dino
  dino.style.left = '100px';
  dino.style.bottom = '-30px';
  dino.src = runImages[0]; // Reset gambar Dino
  
  // Reset animasi background dengan menghapus dan menambahkan kembali kelas animasi
  const gameContainer = document.getElementById('game-container');
  
  gameContainer.style.animation = 'none';  // Hentikan animasi
  gameContainer.offsetHeight;  // Memaksa browser untuk me-render ulang
  gameContainer.style.animation = 'moveBackground 70s linear infinite';  // Mulai ulang animasi
  
  // Jika ada animasi rumput
  if (grass) {
      grass.style.animation = 'none';
      grass.offsetHeight;  // Memaksa render ulang
      grass.style.animation = 'grass-animation 5s infinite linear';  // Mulai ulang animasi rumput
  }
  
  // Tampilkan layar awal
  startOverlay.style.display = 'flex';
  gameStarted = false;  // Set game belum dimulai
  
  // Hentikan suara langkah dan reset state
  stepSound.pause();
  stepSound.currentTime = 0;

  backgroundAudio.currentTime = 0; // Set waktu ke 0
  backgroundAudio.play(); // Mainkan audio

   // Terapkan status mute saat permainan di-restart
   backgroundSound.muted = isMuted; // Menerapkan status mute

   // Periksa status mute dan putar ulang background sound jika tidak mute
  if (!isMuted) {
    playBackgroundSound();
  }

  playBackgroundSound();
}

// Fungsi untuk toggle mute
function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) {
    pauseBackgroundSound();
    muteButton.innerText = '🔇';
  } else {
    playBackgroundSound();
    muteButton.innerText = '🔊';
  }
}

// Event listener for start button
startButton.addEventListener('click', startGame);

// Event listener untuk tombol mulai dan ulang
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

// Event listener untuk input keyboard
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

let currentRunImageIndex = 0;
let score = 0;
let isJumping = false;
let isGameOver = false;
let cactusSpeed = initialCactusSpeed;
let obstacle2Speed = initialObstacle2Speed;
let gameStarted = false;
let obstacle2Passed = false; // Track if obstacle2 has passed the dino
let runAnimationInterval;
let gameInterval;
let jumpCount = 2; // Allowed number of jumps in quick succession
let jumpCooldown = false; // Flag to prevent immediate jumps after landing
let currentImageIndex = 0;
let screenWidth = window.innerWidth;
let cactusWidth = screenWidth * 0.1; // 10% dari lebar layar
cactus.style.width = `${cactusWidth}px`;

function startRunAnimation() {
    runAnimationInterval = setInterval(() => {
      if (!isJumping && !isGameOver) {
        // Update dino image
        currentRunImageIndex = (currentRunImageIndex + 1) % runImages.length;
        dino.src = runImages[currentRunImageIndex];
  
        // Play step sound if it's not already playing and the dino isn't jumping or colliding
        if (stepSound.paused || stepSound.currentTime === 0) {
          stepSound.currentTime = 0; // Reset playback time if needed
          stepSound.play().catch(error => console.error("Error playing step sound:", error));
        }
      } else if (isJumping || isGameOver) {
        // Pause the step sound if the dino is jumping or the game is over
        stepSound.pause();
      }
    }, 150);
  }

function resetGame() {
    jumpCount = 2;
}

function detectCollision(element) {
    const dinoRect = dino.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const padding = -79; // Adjust the padding as needed to refine collision detection
    return !(
        dinoRect.right < elementRect.left - padding ||
        dinoRect.left > elementRect.right + padding ||
        dinoRect.bottom < elementRect.top - padding ||
        dinoRect.top > elementRect.bottom + padding
    );
}

function updateGame() {
    if (!gameStarted || isGameOver) return;

    if (score >= 10000) {
         // Hentikan permainan
        clearInterval(gameInterval);
        isGameOver = true;

    // Sembunyikan elemen game
    dino.style.display = 'none';
    cactus.style.display = 'none';
    obstacle2.style.display = 'none';
    obstacle3.style.display = 'none';

    // Tampilkan win-screen
    winScreen.style.display = 'block';
  }

    // Update cactus position
    const cactusPosition = parseInt(window.getComputedStyle(cactus).getPropertyValue('right'));
    cactus.style.right = `${cactusPosition + cactusSpeed}px`;

    // Update obstacle2 position
    const obstacle2Position = parseInt(window.getComputedStyle(obstacle2).getPropertyValue('right'));
    obstacle2.style.right = `${obstacle2Position + obstacle2Speed}px`;

    // Increase speed if score reaches 10
    if (score >= 10) {
        cactusSpeed = 10;
        obstacle2Speed = 10;
    }

    if (score >= 20) {
        cactusSpeed = 12;
        obstacle2Speed = 12;
    }

    if (score >= 30) {
        cactusSpeed = 15;
        obstacle2Speed = 15;
    }

    if (score >= 40) {
        cactusSpeed = 8;
        obstacle2Speed = 8;
    }

    if (score >= 50) {
        cactusSpeed = 10;
        obstacle2Speed = 10;
    }

    if (score >= 60) {
        cactusSpeed = 15;
        obstacle2Speed = 15;
    }

    if (score >= 70) {
        cactusSpeed = 8;
        obstacle2Speed = 8;
    }

    if (score >= 80) {
        cactusSpeed = 12;
        obstacle2Speed = 12;
    }

    if (score >= 90) {
        cactusSpeed = 15;
        obstacle2Speed = 15;
    }

    if (score >= 100) {
        cactusSpeed = 8;
        obstacle2Speed = 8;
    }

    if (score >= 110) {
        cactusSpeed = 10;
        obstacle2Speed = 10;
    }

    if (score >= 120) {
        cactusSpeed = 12;
        obstacle2Speed = 12;
    }

    if (score >= 130) {
        cactusSpeed = 15;
        obstacle2Speed = 15;
    }

    if (score >= 140) {
        cactusSpeed = 8;
        obstacle2Speed = 8;
    }

    if (score >= 150) {
        cactusSpeed = 10;
        obstacle2Speed = 10;
    }

    // Reset cactus position after it goes out of view
    if (cactusPosition > window.innerWidth) {
        cactus.style.right = '-100px';
        score++;
        scoreElement.innerText = `Score: ${score}`;
    }

    // Reset obstacle2 position after it goes out of view
    if (obstacle2Position > window.innerWidth) {
        obstacle2.style.right = '-100px';
        score++;
        scoreElement.innerText = `Score: ${score}`;
        obstacle2Passed = false; // Allow obstacle2 to be counted again
    }

    // Reset obstacle2Passed when obstacle2 reappears
    if (parseInt(window.getComputedStyle(obstacle2).getPropertyValue('right')) < -100) {
        obstacle2Passed = false;
    }

    // Check for collisions
    if (detectCollision(cactus) || detectCollision(obstacle2)) {
        isGameOver = true;
        collisionSound.play();
        finalScore.innerText = score;
        gameOverOverlay.style.display = 'flex';
        clearInterval(runAnimationInterval); // Stop running animation
    }
}

// Event listener for start button
startButton.addEventListener('click', startGame);

// Event listener for restart button
restartButton.addEventListener('click', restartGame);

// Event listener for keyboard input
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        jump();
    }
});

// Fungsi untuk menampilkan layar kemenangan
function showWinScreen() {
    winScreen.style.display = 'flex';
  }
  
  // Fungsi untuk menyembunyikan layar kemenangan dan me-reset permainan
  function hideWinScreen() {
    winScreen.style.display = 'none';
    // Tambahkan kode untuk me-reset permainan di sini
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Menampilkan tampilan awal
    startOverlay.style.display = 'flex';

    // Memutar backsound saat tampilan awal ditampilkan
    backgroundSound.loop = true; // Loop the sound continuously
    backgroundSound.play().catch(error => {
        console.error("Error playing background sound:", error);
    });
});

// Fungsi untuk mendeteksi apakah perangkat adalah mobile
function isMobile() {
  // Cek apakah user agent mengandung kata kunci seperti 'mobile', 'Android', 'iPhone', dll.
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Fungsi untuk membuat karakter melompat
function jump() {
  if (!isJumping && !isGameOver && gameStarted > 0 && jumpCount > 0 && !jumpCooldown) {
    isJumping = true;
    jumpCooldown = true; // Set cooldown after a jump

    // Play jump sound
    jumpSound.play(); // Ensure audio file is linked correctly

    jumpCount--;

    // Dino jump animation
    dino.src = 'image/Mickiv Walk Cycle-04.png'; // Replace with your jump image
    dino.style.transition = 'none';
    dino.style.bottom = '250px'; // Move dino up for jump

    setTimeout(() => {
      dino.style.transition = 'bottom 0.3s ease';
      dino.style.left = '100px'; // Adjust left position if needed
      dino.style.bottom = '-30px'; // Move dino down after jump
      dino.style.transition = 'bottom 0.3s ease'; // Reset transition for bottom
      isJumping = false;
      jumpCount = jumpCount === 0 ? 2 : jumpCount; // Reset jump count after landing

      // Reset jump cooldown after a short delay
      setTimeout(() => {
        jumpCooldown = false;
      }, 550); // Adjust cooldown duration as needed

      dino.src = runImages[currentRunImageIndex]; // Return to running image
    }, 500); // Adjust jump duration as needed 
  }
}

// Event listener untuk PC (spasi)
if (!isMobile()) {
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      jump();
    }
  });
}

// Event listener untuk mobile (ketuk layar)
if (isMobile()) {
  document.addEventListener('touchstart', () => {
    event.preventDefault();
    jump();
  });
}

window.addEventListener('orientationchange', () => {
  if (screen.orientation.type === 'landscape') {
    // Apply landscape styles (optional)
  } else {
    // Apply portrait styles (optional)
  }
});

function requestFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari */
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
    document.documentElement.mozRequestFullScreen();
  }
}

// Call requestFullscreen() when appropriate (e.g., on start game)

function lockToLandscape() {
  if (isMobile() && screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch((err) => {
      console.error("Orientation lock error:", err);
    });
  }
}

function checkOrientation() {
  if (isMobile() && window.innerHeight > window.innerWidth) {
    alert("Please rotate your device to landscape mode for better gameplay.");
  }
}

const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Control bird jump on keydown (for desktop)
document.addEventListener('keydown', () => {
  if (isGameOver) return;
  birdTop -= jumpHeight;
});

// Control bird jump on touchstart (for mobile and tablet)
document.addEventListener('touchstart', () => {
  if (isGameOver) return;
  birdTop -= jumpHeight;
});
