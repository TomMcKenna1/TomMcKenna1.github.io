/** Class representing a particle explosion */
class ParticleExplosion {
  /**
   * Create a particle explosion.
   * @param {string} canvasID - The ID of the canvas.
   * @param {number} [particleSpacing=3] - The spacing between particles.
   * @param {number} [particleColour=[255,255,255,255]] - The colour of the particles.
   */
  constructor (
    canvasID,
    particleSpacing = 3,
    particleColour = [255,255,255,255]
  ) {
    /** @type {HTMLCanvasElement} */
    this.canvas = document.getElementById(canvasID);
    this.particlePrototype = {
      ox: 0,
      oy: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      density: 0
    };
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleSpacing = particleSpacing;
    this.particleColour = particleColour;
    this.mouseFactor = 0.1;
    this.drag = 0.95;
    this.ease = 0.25;
    this.tic = true;
    this.width;
    this.height;
    this.explosionDiameter;
    this.margin;

    this.animateReqID;

    this.canvas.addEventListener( 'mousemove', (event) => {
      const { left, top } = this.canvas.getBoundingClientRect()
      // Set explosion to centre and move with mouse.
      this.groundZeroX = this.width / 2 + this.mouseFactor * (event.clientX - left - this.width / 2);
      this.groundZeroY = this.height / 2 + this.mouseFactor * (event.clientY - top - this.height / 2);
    });

    this.canvas.addEventListener( 'mouseleave', (_event) => {
      this.groundZeroX = -this.width;
      this.groundZeroY = -this.height;
    });

    window.addEventListener( 'resize', () => {
      this.stop();
      this.init();
      this.start();
    })

    this.init();
    this.start();
  }

  /**
   * Initialise the particle canvas.
   */
  init = () => {
    const { width, height } = this.canvas.getBoundingClientRect()
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;

    this.explosionDiameter = (this.width * this.width);
    this.margin =  this.height / 8;

    this.particles = [];
    for (let i = this.margin; i < this.width - this.margin; i += this.particleSpacing) {
      for (let j = this.margin; j < this.height - this.margin; j += this.particleSpacing) {
        let particle = Object.create( this.particlePrototype );
        particle.x = particle.ox = i;
        particle.y = particle.oy = j;
        particle.density = Math.random() * 6;
        this.particles.push(particle);
      }
    }
    console.log(`${this.particles.length} particles rendered`)
  }

  /**
   * Start the particle animation.
   */
  start = () => {
    // Only calculate particle positions every other animation frame.
    if ( this.tic = !this.tic ) {
      this.updateParticles();
    } 
    else {
      this.ctx.putImageData( this.getParticleImage(), 0, 0 );
    }
    this.animateReqID = requestAnimationFrame( this.start );
  }
  
  /**
   * Stop the particle animation.
   */
  stop = () => {
    cancelAnimationFrame(this.animateReqID);
  }

  /**
   * Update the position of particles.
   */
  updateParticles = () => {
    for ( let i = 0; i < this.particles.length; i++ ) {
      let particle = this.particles[i];
      const dx = this.groundZeroX - particle.x;
      const dy = this.groundZeroY - particle.y
      const distanceFromM = dx * dx + dy * dy;
      const f = -this.explosionDiameter / distanceFromM;

      if ( distanceFromM < this.explosionDiameter ) {
        let t = Math.atan2( dy, dx );
        particle.vx += f * Math.cos(t);
        particle.vy += f * Math.sin(t);
      }

      particle.x += ( particle.vx *= this.drag ) + (particle.ox - particle.x) * this.ease * particle.density;
      particle.y += ( particle.vy *= this.drag ) + (particle.oy - particle.y) * this.ease * particle.density; 
    }
  }

  /**
   * Update the canvas image.
   */
  getParticleImage = () => {
    let newParticleImage = this.ctx.createImageData( this.width, this.height )
    let b = newParticleImage.data;
    for ( let i = 0; i < this.particles.length; i++ ) {
      let p = this.particles[i];
      let n = (( ~~p.x) + (~~p.y) * this.width) * 4;
      b[n] = this.particleColour[0];
      b[n+1] = this.particleColour[1];
      b[n+2] = this.particleColour[2];
      b[n+3] = this.particleColour[3];
    }
    return newParticleImage;
  }
}

const welcomeExplosion = new ParticleExplosion('interactiveName');