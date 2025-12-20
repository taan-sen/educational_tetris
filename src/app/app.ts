import { Component, signal, HostListener, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface FallingChar {
  id: number;
  character: string;
  x: number;
  y: number;
  color: string;
  font: string;
  size: number;
  weight: string;
  speed: number;
  popped: boolean;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

interface SplashParticle {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  color: string;
  size: number;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  showWater = false;
  showConfig = false;
  waterLevel = 10;
  targetWaterLevel = 10; // Target level for smooth animation
  score = 0;
  charactersPopped = 0; // Track total characters popped
  fallingChars: FallingChar[] = [];
  confettiParticles: ConfettiParticle[] = [];
  splashParticles: SplashParticle[] = [];
  charactersToTop = 10; // Configurable: characters needed to reach 100%
  Math = Math; // Expose Math to template
  private charId = 0;
  private confettiId = 0;
  private gameInterval: any;
  private fallInterval: any;

  private characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  private colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'];
  private fonts = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Comic Sans MS'];
  private weights = ['normal', 'bold', '300', '600', '800'];

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  startWater() {
    this.showWater = true;
    setTimeout(() => {
      this.startCharacterFall();
    }, 100);
  }

  toggleConfig() {
    this.showConfig = !this.showConfig;
  }

  restartGame() {
    this.showWater = false;
    this.showConfig = false;
    this.waterLevel = 10;
    this.targetWaterLevel = 10; // Reset target level too
    this.score = 0;
    this.charactersPopped = 0; // Reset popped counter
    this.fallingChars = [];
    this.confettiParticles = []; // Clear confetti
    this.splashParticles = []; // Clear splash particles
    this.charactersToTop = 10; // Reset to default
    this.stopCharacterFall();
  }

  private startCharacterFall() {
    // console.log('Starting character fall');
    
    // Spawn first character immediately
    this.spawnCharacter();
    
    this.gameInterval = setInterval(() => {
      // Spawn multiple characters based on difficulty level, max 3
      const spawnCount = Math.min(3, Math.floor(this.charactersPopped / 10) + 1);
      for (let i = 0; i < spawnCount; i++) {
        setTimeout(() => this.spawnCharacter(), i * 200); // Stagger spawns by 200ms
      }
      // console.log('Spawned characters:', spawnCount, 'total:', this.fallingChars.length);
    }, 2000);

    // Use requestAnimationFrame instead of setInterval
    const animate = () => {
      this.updateCharacters();
      this.fallInterval = requestAnimationFrame(animate);
    };
    animate();
  }

  private increaseSpawnRate() {
    // console.log('Spawn rate increased! Characters popped:', this.charactersPopped);
    // The spawn rate is automatically increased in startCharacterFall based on charactersPopped
  }

  private triggerScoreAnimation() {
    // Re-trigger the number pulse animation by adding/removing a class
    const scoreElement = document.querySelector('.score-number');
    if (scoreElement) {
      scoreElement.classList.remove('score-updated');
      setTimeout(() => scoreElement.classList.add('score-updated'), 10);
    }
  }

  private stopCharacterFall() {
    if (this.gameInterval) clearInterval(this.gameInterval);
    if (this.fallInterval) cancelAnimationFrame(this.fallInterval);
  }

  private spawnCharacter() {
    const char: FallingChar = {
      id: this.charId++,
      character: this.characters[Math.floor(Math.random() * this.characters.length)],
      x: Math.random() * (window.innerWidth - 50),
      y: -50,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      font: this.fonts[Math.floor(Math.random() * this.fonts.length)],
      size: 50 + Math.random() * 30,
      weight: this.weights[Math.floor(Math.random() * this.weights.length)],
      speed: 0.421875 + Math.random() * 0.6328125,
      popped: false
    };
    this.fallingChars.push(char);
  }

  private updateCharacters() {
    const waterTop = window.innerHeight - (window.innerHeight * this.waterLevel / 100);
    
    // Smoothly animate water level towards target
    if (this.waterLevel < this.targetWaterLevel) {
      this.waterLevel = Math.min(this.targetWaterLevel, this.waterLevel + 0.5); // Rise by 0.5% per frame
    }
    
    // Stop spawning if game over
    if (this.waterLevel >= 100) {
      this.stopCharacterFall();
    }
    
    let characterCrossedWater = false;
    
    this.fallingChars.forEach(char => {
      if (!char.popped) {
        const wasAboveWater = char.y < waterTop;
        char.y += char.speed;
        
        // Check if character just crossed into water
        if (wasAboveWater && char.y >= waterTop && char.speed > 0) {
          char.speed = 0; // Stop at water level
          this.createSplash(char.x + 25, waterTop); // Create splash at water surface
          this.increaseWaterLevel();
          characterCrossedWater = true;
        }
      }
    });

    // If a character crossed water, remove all other falling characters
    if (characterCrossedWater) {
      this.fallingChars = this.fallingChars.filter(char => 
        char.popped || char.speed === 0 // Keep popped chars and chars already in water
      );
    }

    // Remove characters that are too far down or popped for too long
    this.fallingChars = this.fallingChars.filter(char => 
      char.y < window.innerHeight + 100 && (!char.popped || char.y > -100)
    );
    
    // Clean up old confetti particles
    this.confettiParticles = this.confettiParticles.filter(confetti => 
      Date.now() - confetti.id < 1000 // Remove after 1 second
    );
    
    // Update splash particles
    this.splashParticles.forEach(splash => {
      splash.x += splash.velocityX;
      splash.y += splash.velocityY;
      splash.velocityY += 0.4; // Stronger gravity
      splash.size *= 0.96; // Faster shrinking for dramatic effect
    });
    
    // Clean up old splash particles
    this.splashParticles = this.splashParticles.filter(splash => 
      splash.y < window.innerHeight + 50 && splash.size > 1
    );
    
    // Force change detection
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  private createConfettiBurst(x: number, y: number) {
    const confettiColors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];
    
    // Create 12 confetti particles in a burst pattern
    for (let i = 0; i < 12; i++) {
      const confetti: ConfettiParticle = {
        id: Date.now() + i, // Use timestamp for cleanup
        x: x + (Math.random() - 0.5) * 100, // Spread around character position
        y: y + (Math.random() - 0.5) * 100,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: i * 50 // Stagger the animations
      };
      this.confettiParticles.push(confetti);
    }
  }

  private createSplash(x: number, y: number) {
    const splashColors = ['rgba(135,206,250,0.9)', 'rgba(176,224,230,1)', 'rgba(255,255,255,0.9)', 'rgba(100,200,255,0.8)'];
    
    // Create 16 splash particles for more intensity
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const speed = 4 + Math.random() * 6; // Increased speed
      
      const splash: SplashParticle = {
        id: Date.now() + i,
        x: x,
        y: y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 4, // More upward velocity
        color: splashColors[Math.floor(Math.random() * splashColors.length)],
        size: 6 + Math.random() * 12 // Larger particles
      };
      this.splashParticles.push(splash);
    }
    
    // Add additional large droplets
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      
      const splash: SplashParticle = {
        id: Date.now() + i + 16,
        x: x + (Math.random() - 0.5) * 40,
        y: y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 6, // High arc
        color: 'rgba(255,255,255,0.95)',
        size: 12 + Math.random() * 8 // Large droplets
      };
      this.splashParticles.push(splash);
    }
  }

  private increaseWaterLevel() {
    const increaseAmount = 90 / this.charactersToTop; // 90% increase spread over charactersToTop
    this.targetWaterLevel = Math.min(100, this.targetWaterLevel + increaseAmount);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (!this.showWater) return;
    
    const pressedKey = event.key.toLowerCase();
    const matchingChar = this.fallingChars.find(char => 
      !char.popped && char.character.toLowerCase() === pressedKey
    );

    if (matchingChar) {
      matchingChar.popped = true;
      this.score += 10;
      this.charactersPopped++;
      this.createConfettiBurst(matchingChar.x + 25, matchingChar.y + 25); // Center of character
      
      // Trigger score animation
      this.triggerScoreAnimation();
      
      // Check if we need to increase spawn rate
      if (this.charactersPopped % 10 === 0) {
        this.increaseSpawnRate();
      }
      
      // Remove after animation
      setTimeout(() => {
        const index = this.fallingChars.indexOf(matchingChar);
        if (index > -1) this.fallingChars.splice(index, 1);
      }, 500);
    }
    
    // Prevent default to avoid any interference
    event.preventDefault();
  }

  trackChar(index: number, char: FallingChar): number {
    return char.id;
  }

  trackConfetti(index: number, confetti: ConfettiParticle): number {
    return confetti.id;
  }

  trackSplash(index: number, splash: SplashParticle): number {
    return splash.id;
  }

  ngOnDestroy() {
    this.stopCharacterFall();
  }
}
