// three-animation.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.z = 25;

    // PARTICLES SETUP
    const particleCount = 4000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#6366f1'); // Primary indigo
    const color2 = new THREE.Color('#8b5cf6'); // Lighter purple

    // Create an organic sphere shape
    for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;

        // Random radius for a slightly fluffy sphere
        const r = 10 + Math.random() * 2;

        const x = r * Math.cos(theta) * Math.sin(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        originalPositions[i * 3] = x;
        originalPositions[i * 3 + 1] = y;
        originalPositions[i * 3 + 2] = z;

        velocities[i * 3] = 0;
        velocities[i * 3 + 1] = 0;
        velocities[i * 3 + 2] = 0;

        // Mix colors
        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Glow Material using Additive Blending
    // We create a circular texture for softer particles
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 32;
    canvasTexture.height = 32;
    const ctx = canvasTexture.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    const particleTexture = new THREE.CanvasTexture(canvasTexture);

    const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        map: particleTexture
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Position object slightly to the left as requested
    particles.position.x = -8;

    // On mobile, center it
    if (window.innerWidth < 992) {
        particles.position.x = 0;
        particles.position.y = 5;
    }

    // MOUSE INTERACTION (Raycaster & Physics)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-9999, -9999);
    let targetRotationX = 0;
    let targetRotationY = 0;

    window.addEventListener('mousemove', (event) => {
        // Normalize mouse coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Subtle object rotation based on mouse
        targetRotationY = mouse.x * 0.5;
        targetRotationX = -mouse.y * 0.5;
    });

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (window.innerWidth < 992) {
            particles.position.x = 0;
            particles.position.y = 5;
        } else {
            particles.position.x = -8;
            particles.position.y = 0;
        }
    });

    // PHYSICS PARAMETERS
    const repulsionRadius = 6;
    const repulsionForce = 0.8;
    const returnForce = 0.08;
    const friction = 0.90;

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smoothly rotate the whole object towards target rotation
        particles.rotation.y += (targetRotationY - particles.rotation.y) * 0.05;
        particles.rotation.x += (targetRotationX - particles.rotation.x) * 0.05;

        // Add ambient organic rotation
        particles.rotation.y += 0.003;
        particles.rotation.z = Math.sin(elapsedTime * 0.5) * 0.1;

        // Particle Physics Update
        raycaster.setFromCamera(mouse, camera);

        // Intersect with a plane at the depth of the particles to find the 3D mouse position
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), -particles.position.z);
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(planeZ, target);

        // Adjust target relative to particle object's local space
        if (target) {
            target.sub(particles.position);
        }

        const posAttribute = geometry.attributes.position;
        const currentPositions = posAttribute.array;

        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;

            const px = currentPositions[idx];
            const py = currentPositions[idx + 1];
            const pz = currentPositions[idx + 2];

            const ox = originalPositions[idx];
            const oy = originalPositions[idx + 1];
            const oz = originalPositions[idx + 2];

            // Organic floating motion per particle
            const floatX = Math.sin(elapsedTime * 1.5 + oy) * 0.2;
            const floatY = Math.cos(elapsedTime * 1.5 + ox) * 0.2;
            const floatZ = Math.sin(elapsedTime * 1.5 + oz) * 0.2;

            const targetX = ox + floatX;
            const targetY = oy + floatY;
            const targetZ = oz + floatZ;

            // Calculate distance to mouse target
            let dx = 0, dy = 0, dz = 0, dist = 9999;

            if (target) {
                dx = px - target.x;
                dy = py - target.y;
                dz = pz - target.z;
                dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            }

            // Repulsion force
            if (dist < repulsionRadius) {
                // Stronger force closer to center
                const force = Math.pow((repulsionRadius - dist) / repulsionRadius, 2);
                velocities[idx] += (dx / dist) * force * repulsionForce;
                velocities[idx + 1] += (dy / dist) * force * repulsionForce;
                velocities[idx + 2] += (dz / dist) * force * repulsionForce;
            }

            // Return force (elasticity) pulling back to target (original + float)
            velocities[idx] += (targetX - px) * returnForce;
            velocities[idx + 1] += (targetY - py) * returnForce;
            velocities[idx + 2] += (targetZ - pz) * returnForce;

            // Damping / Friction
            velocities[idx] *= friction;
            velocities[idx + 1] *= friction;
            velocities[idx + 2] *= friction;

            // Apply velocity
            currentPositions[idx] += velocities[idx];
            currentPositions[idx + 1] += velocities[idx + 1];
            currentPositions[idx + 2] += velocities[idx + 2];
        }

        posAttribute.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();
});