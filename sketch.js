const flock = [];
const predator = [];
const obstacle = [];

let alignSlider, cohesionSlider, separationSlider,pred,obs;

function setup() {
  createCanvas(1350, 450);
  alignSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  separationSlider = createSlider(0, 2, 1, 0.1);

  for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
  }

  // In order to add predator or obstacle uncomment the below for loops by removing the slashes below respectively. 
  // You can change the values of predators and obstacles by changing the value of pred and obs for predators and obstacles respectively.
  // Comment the lines again to remove functionality.
  
  pred= 3
  obs=2
  for (let i = 0; i < pred; i++) {
    predator.push(new Predator());
  } 
  for (let i = 0; i < obs; i++) {
   obstacle.push(new Obstacle());
  }
}

function draw() {
  background(150);

  // Use the below size variable to change size of predators on output.
  size=8
  if (predator != 0){
    for (let boid of predator) {
      boid.edges();
      boid.perform(predator,flock);
      boid.update();
      boid.show(size);
    }
  }

  if (obstacle != 0){
    for (let obs of obstacle){
      obs.show();
    }
  }
  
  // Use the below size variable to change size of boids on output.
  size=8
  for (let boid of flock) {
    boid.edges();
    boid.perform(flock,predator,obstacle);
    boid.update();
    boid.show(size);
  }

}