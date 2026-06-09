///////////////////////////////////////////////////////////
// CONFETTI
///////////////////////////////////////////////////////////

/** Singleton class representing the Confetti animation controller. */
class ConfettiManager 
{
  #animationTimer;
  #canvas;
  #colors;
  #context;
  #errors;
  #particles;
  #lastFrameTime;
  #pause;
  #streaming;
  #waveAngle;
  static #instance = null;

  alpha;
  frameInterval;
  gradient;
  maxCount;
  speed;
  
  /** Creates the confetti manager. */
  constructor() 
  {
    this.alpha = 1.0;
    this.frameInterval = 15;
    this.gradient = false;
    this.maxCount = 150;
    this.speed = 2;
  
    this.#colors = 
    [
      "rgba(30,144,255,", "rgba(107,142,35,", "rgba(255,215,0,", "rgba(255,192,203,",
      "rgba(106,90,205,", "rgba(173,216,230,", "rgba(238,130,238,", "rgba(152,251,152,",
      "rgba(70,130,180,", "rgba(244,164,96,", "rgba(210,105,30,", "rgba(220,20,60,"
    ];

    this.#errors = 
    {
      singleInstanceError: 'ConfettiManager Error: Only one ConfettiManager instance can exist at a time.',
      timeoutTypeError: 'Confetti Error: Expected type number for timeout.'
    };

    this.#lastFrameTime = Date.now();
    this.#particles = [];
    this.#pause = false;
    this.#streaming = false;
    this.#waveAngle = 0;

    if(ConfettiManager.#instance) 
    {
      console.error(this.#errors.singleInstanceError);
      return ConfettiManager.#instance;
    }
    ConfettiManager.#instance = this;
  }

  /** Static method to return a singleton instance. */
  static getInstance() 
  {
    return new ConfettiManager();
  }

  /** Private method to draw all confetti particles. */
  #drawParticles() 
  {
    for(let p of this.#particles) 
    {
      this.#context.beginPath();
      let x2 = p.x + p.tilt;
      let y2 = p.y + p.tilt + p.diameter / 2;
      let x = x2 + p.diameter / 2;

      if(this.gradient) 
      {
        let grad = this.#context.createLinearGradient(p.x, p.y, x2, y2);
        grad.addColorStop("0", p.color);
        grad.addColorStop("1.0", p.color2);
        this.#context.strokeStyle = grad;
      } 
      else this.#context.strokeStyle = p.color;

      this.#context.lineWidth = p.diameter;
      this.#context.moveTo(x, p.y);
      this.#context.lineTo(x2, y2);
      this.#context.stroke();
    }
  }

  /** Private method to create canvas if it doesn’t exist. */
  #initCanvas() 
  {
    if(!this.#canvas) 
    {
      this.#canvas = document.createElement('canvas');
      this.#canvas.id = 'confetti-canvas';
      this.#canvas.style.cssText = 'display:block;z-index:999999;pointer-events:none;position:fixed;top:0;left:0;';
      document.body.prepend(this.#canvas);
      this.#canvas.width = window.innerWidth;
      this.#canvas.height = window.innerHeight;
      window.addEventListener('resize', () => 
      {
        this.#canvas.width = window.innerWidth;
        this.#canvas.height = window.innerHeight;
      });
      this.#context = this.#canvas.getContext('2d');
    }
  }

  /** Private method to reset particle state. */
  #resetParticle(p, width, height) 
  {
    p.color = this.#colors[Math.floor(Math.random() * this.#colors.length)] + this.alpha + ")";
    p.color2 = this.#colors[Math.floor(Math.random() * this.#colors.length)] + this.alpha + ")";
    p.x = Math.random() * width;
    p.y = Math.random() * height - height;
    p.diameter = Math.random() * 10 + 5;
    p.tilt = Math.random() * 10 - 10;
    p.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
    p.tiltAngle = Math.random() * Math.PI;
    return p;
  }

  /** Private method to animate confetti frame by frame. */
  #runAnimation() 
  {
    if(this.#pause) return;

    let now = Date.now();
    let delta = now - this.#lastFrameTime;

    if(delta > this.frameInterval) 
    {
      this.#context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.#updateParticles();
      this.#drawParticles();
      this.#lastFrameTime = now - (delta % this.frameInterval);
    }

    if(this.#particles.length > 0) this.#animationTimer = requestAnimationFrame(() => this.#runAnimation());
    else 
    {
      this.#context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.#animationTimer = null;
    }
  }

  /** Private method to update all particle positions. */
  #updateParticles() 
  {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.#waveAngle += 0.01;

    for(let i = 0; i < this.#particles.length; i++) 
    {
      let p = this.#particles[i];
      if(!this.#streaming && p.y < -15) p.y = height + 100;
      else 
      {
        p.tiltAngle += p.tiltAngleIncrement;
        p.x += Math.sin(this.#waveAngle) - 0.5;
        p.y += (Math.cos(this.#waveAngle) + p.diameter + this.speed) * 0.5;
        p.tilt = Math.sin(p.tiltAngle) * 15;
      }

      if(p.x > width + 20 || p.x < -20 || p.y > height) 
      {
        if(this.#streaming && this.#particles.length <= this.maxCount) this.#particles[i] = this.#resetParticle({}, width, height);
        else 
        {
          this.#particles.splice(i, 1);
          i--;
        }
      }
    }
  }

  /** 
   * Get property to return if the animation is currently paused or not.
   * @return {boolean} If animation is currently paused or not.
   */
  get isPaused() 
  {
    return this.#pause;
  }

  /** 
   * Get property to return if the animation is currently running or not.
   * @return {boolean} If animation is currently running or not.
   */
  get isRunning() 
  {
    return this.#streaming;
  }

  /** Public method to pause animation. */
  pause() 
  {
    this.#pause = true;
  }

  /** Public method to completely remove all confetti and the canvas. */
  remove() 
  {
    this.stop();
    this.#pause = true;
    this.#particles = [];
  
    if(this.#animationTimer) 
    {
      cancelAnimationFrame(this.#animationTimer);
      this.#animationTimer = null;
    }
  
    if(this.#canvas) 
    {
      this.#canvas.remove();
      this.#canvas = null;
      this.#context = null;
    }
  }

  /** Public method to resume animation. */
  resume() 
  {
    if(!this.#pause) return;
    this.#pause = false;
    this.#runAnimation();
  }

  /** 
  * Public method to start the confetti animation. 
  * @param {number} timeout - The time amount for delaying the stop of the animation in milliseconds.
  */
  start({ timeout } = {}) 
  {
    let min = null;
    let max = null;

    if(timeout)
    {
      if(!typechecker.check({ type: 'number', value: timeout })) console.error(this.#errors.timeoutTypeError);
    }
    
    this.#initCanvas();

    let width = window.innerWidth;
    let height = window.innerHeight;
    let count = this.maxCount;

    if(min !== null) 
    {
      if(max !== null) count += (min === max) ? max : Math.floor(Math.random() * (Math.max(min, max) - Math.min(min, max)) + Math.min(min, max)); 
      else count += min;
    } 
    else if(max !== null) count += max;

    while(this.#particles.length < count) this.#particles.push(this.#resetParticle({}, width, height));
  
    this.#streaming = true;
    this.#pause = false;
    this.#runAnimation();

    if(timeout) setTimeout(() => this.stop(), timeout);
  }

  /** Public method to stop generating new confetti, but let existing fall. */
  stop() 
  {
    this.#streaming = false;
  }

  /** Public method to toggle confetti on or off. */
  toggle() 
  {
    this.#streaming ? this.stop() : this.start();
  }

  /** Public method to toggle the pause. */
  togglePause() 
  {
    this.#pause ? this.resume() : this.pause();
  }
}

///////////////////////////////////////////////////////////

globalThis.confetti = ConfettiManager.getInstance();

///////////////////////////////////////////////////////////