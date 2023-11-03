var r = document.querySelector(':root');

document.getElementById('lightModeButton').addEventListener('click', () => {
  r.style.setProperty('--mainColour', "rgb(204,204,204)");
  r.style.setProperty('--contrastColour', "rgb(17,17,17)");
  r.style.setProperty('--contrastColour--darker', 'rgb(90, 90, 90)');
  welcomeExplosion.particleColour = [0, 0, 0, 255];
})

document.getElementById('darkModeButton').addEventListener('click', () => {
  r.style.setProperty('--mainColour', "rgb(17,17,17)");
  r.style.setProperty('--contrastColour', "rgb(204,204,204)");
  r.style.setProperty('--contrastColour--darker', 'rgb(130, 130, 130)');
  welcomeExplosion.particleColour = [255, 255, 255, 255];
})

const particleExplosionCanvas = document.getElementById('particleExplosion');
const { width, height } = particleExplosionCanvas.getBoundingClientRect();
const flooredHeight = ~~height;
const marginLeft = flooredHeight / 16;
const marginRight = flooredHeight / 16;
const marginTop = flooredHeight / 16;
const marginBottom = flooredHeight / 2 + marginTop;
const welcomeExplosion = new ParticleExplosion('particleExplosion', {
  marginLeft: marginLeft,
  marginRight: marginRight,
  marginTop: marginTop,
  marginBottom: marginBottom
});

console.log(r.style.getPropertyValue('--contrastColour'));