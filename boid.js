// In order to increase or decrease the maximum speed and maximum force to be taken for boids, change the values in the constructor below.
class Boid {
  // Initializes the values of the boids
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.max_force = 1;
    this.max_speed = 4;
  }

  // Edge conditions are resolved here.
  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  //Performs rule alignment
  alignment(boids) {
    let perception_radius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perception_radius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

  //Performs rule separation
  separation(boids) {
    let perception_radius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perception_radius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }
  //Performs rule cohesion
  cohesion(boids) {
    let perception_radius = 100;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perception_radius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.max_speed);
      steering.sub(this.velocity);
      steering.limit(this.max_force);
    }
    return steering;
  }

  //Performs rule fleeing to get away from predators
  flee(boids,predator){
    if (predator.length){
        let perception_radius = 70;
        let steering = createVector();
        let total = 0;
        for (let other of predator) {
          let d = dist(
            this.position.x,
            this.position.y,
            other.position.x,
            other.position.y
          );
          if (other != this && d < perception_radius) {
            let diff = p5.Vector.sub(this.position, other.position);
            steering.add(diff);
            steering.add(diff);
            total++;
          }
        }
        if (total > 0) {
          steering.div(total);
          steering.setMag(this.max_speed);
          steering.sub(this.velocity);
          steering.limit(this.max_force);
        }
      return steering;
    }
    else {
      return 0;
    }
    
  } 

  //Performs rule obstacle avoid to get away from predators
  obstacle_avoid(boids, obstacle){
    if (obstacle.length){
      let perception_radius = 200;
      let steering = createVector();
      let total = 0;
      for (let other of obstacle) {
        let d = dist(
          this.position.x,
          this.position.y,
          other.pA1,
          other.pB1
        );
        if (other != this && (d-10) < perception_radius) {
          let diff = p5.Vector.sub(this.position, other.position);
          steering.add(diff);
          total++;
        }
      }
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.max_speed);
        steering.sub(this.velocity);
        steering.limit(this.max_force);
      }
      return steering;
    }

    else{
      return 0;
    }
  }

// Function to perform all the rules. The flee and obstacle_avoid will return 0 if the rules are not activated in sketch.js
  perform(boids, predator, obstacle) {
    let alignment = this.alignment(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);
    let flee = this.flee(boids,predator);
    let obstacle_avoid = this.obstacle_avoid(boids,obstacle);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
    this.acceleration.add(flee);
    this.acceleration.add(obstacle_avoid*10);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_speed);
    this.acceleration.mult(0);
  }

  show(size) {
    strokeWeight(size);
    stroke('green');
    point(this.position.x, this.position.y);
  }

}



// In order to increase or decrease the maximum speed and maximum force to be taken for boids, change the values in the constructor below.
class Predator {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.max_force_predator = 1;
    this.max_speed_predator = 6;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  alignment(boids) {
    let perception_radius = 120;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perception_radius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.max_speed_predator);
      steering.sub(this.velocity);
      steering.limit(this.max_force_predator);
    }
    return steering;
  }

  perform(boids, flock) {
    let alignment = this.alignment(flock);
    

    alignment.mult(alignSlider.value());
    

    this.acceleration.add(alignment);
    
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.max_speed);
    this.acceleration.mult(0);
  }

  show(size) {
    strokeWeight(size);
    stroke('red');
    point(this.position.x, this.position.y);
  }
}


// Initialize obstacle
class Obstacle{
  constructor(){
    this.pA1 = random(width);
    this.pB1 = random(height);
  }

// To show the obstacle on the simulation
  show() {
    stroke('black');
    fill('black');
    circle(this.pA1, this.pB1, 10);
  }
}