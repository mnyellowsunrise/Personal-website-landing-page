import * as THREE from 'three';


// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5.8;



// Create a container div for the list
const infoContainer = document.createElement('div');
infoContainer.id = 'info-container';
document.body.appendChild(infoContainer);

// Create the list items
const listItems = [
  'Matthew Nobile',
  'University of Washington Bothell',
  'BA Applied Computing',
  `<a href="https://github.com/mnyellowsunrise" target="_blank">GitHub</a>`,
  `<a href="https://www.linkedin.com/in/mnswe" target="_blank">LinkedIn</a>`,
];

listItems.forEach((itemText) => {
  const listItem = document.createElement('div');
  listItem.className = 'info';
  listItem.innerHTML = itemText;
  infoContainer.appendChild(listItem);
});

//const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//directionalLight.position.set(1, 1, 1);
//scene.add(directionalLight);


// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const octahedronGeometry = new THREE.OctahedronGeometry(1);
const octahedronMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFF00, transparent: true, opacity: 0.8 });
const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
scene.add(octahedron);

// Create a 3D ring (Torus)
const ringGeometry = new THREE.TorusGeometry(4, 1, 30, 200);
const ringMaterial = new THREE.MeshStandardMaterial({ color: 0x9370DB, transparent: true, opacity: 0.8 });
ringMaterial.blending = THREE.NormalBlending;
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
scene.add(ring);





const textureLoader = new THREE.TextureLoader();



// Create a particle system
const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });

const particlesCount = 1000;
const particlePositions = new Float32Array(particlesCount * 3);
const particleColors = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 10;
  particlePositions[i * 3] = x;
  particlePositions[i * 3 + 1] = y;
  particlePositions[i * 3 + 2] = z;

  // Generate a random color for each particle
  const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  randomColor.toArray(particleColors, i * 3);
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Initialize variables for mouse interaction
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

// Event listener for mouse down
document.addEventListener('mousedown', (event) => {
  isDragging = true;
  previousMouseX = event.clientX;
  previousMouseY = event.clientY;
});

// Event listener for mouse up
document.addEventListener('mouseup', () => {
  isDragging = false;
});

// Event listener for mouse move
document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;

    // Adjust camera position based on mouse movement
    camera.position.x += deltaX * 0.01;
    camera.position.y -= deltaY * 0.01;

    // Update the camera's lookAt position
    camera.lookAt(scene.position);

    // Store current mouse position for the next frame
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
  }
});

const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 1.5); // Sky color, Ground color, Intensity
scene.add(hemisphereLight);


const animate = () => {
  requestAnimationFrame(animate);

  // Rotate the octahedron
  octahedron.rotation.x += 0.001;
  octahedron.rotation.y += 0.001;
  octahedron.rotation.z += 0.001;

  // Rotate the ring
  ring.rotation.y += 0.001;

  // Update particle positions for diagonal movement (from right to left)
  const positions = particleGeometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] -= 0.001; // Move particles to the left
    positions[i + 1] -= 0.001; // Move particles diagonally (change in y position)
    if (positions[i] < -5 || positions[i + 1] < -5) {
      // Reset particles if they go beyond a certain threshold
      positions[i] = (Math.random() - 0.5) * 10; // Random X position
      positions[i + 1] = (Math.random() - 0.5) * 10; // Random Y position
      positions[i + 2] = (Math.random() - 0.5) * 10; // Random Z position
    }
  }
  particleGeometry.attributes.position.needsUpdate = true;

  // Update particle colors for changing colors
  const colors = particleGeometry.attributes.color.array;
  for (let i = 0; i < colors.length; i += 3) {
    colors[i] += (Math.random() - 0.5) * 0.01; // Randomly change the red channel
    colors[i + 1] += (Math.random() - 0.5) * 0.01; // Randomly change the green channel
    colors[i + 2] += (Math.random() - 0.5) * 0.01; // Randomly change the blue channel
  }
  particleGeometry.attributes.color.needsUpdate = true;

  // Render the scene
  renderer.render(scene, camera);
};


animate();
