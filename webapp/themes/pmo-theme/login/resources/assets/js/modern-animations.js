document.addEventListener("DOMContentLoaded", () => {
  initNetworkMode();
  initFormEnhancements();
  initBackgroundMode();
  revealWhenReady();
});

function shouldUseLiteMode() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reducedMotion;
}

function isSlowNetwork() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) {
    return false;
  }

  const slowTypes = ["slow-2g", "2g", "3g"];
  return Boolean(
    connection.saveData ||
    slowTypes.includes(connection.effectiveType) ||
    connection.downlink && connection.downlink < 1.5 ||
    connection.rtt && connection.rtt > 700
  );
}

function initNetworkMode() {
  if (!isSlowNetwork()) {
    return;
  }

  document.body.classList.add("slow-network");
  stopBackgroundVideo();

  const href = new URL("../css/slow-network.css", import.meta.url).href;
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.append(link);
  }
}

async function initBackgroundMode() {
  if (document.body.classList.contains("slow-network")) {
    document.body.classList.add("poster-bg");
    document.body.classList.remove("video-bg", "css-bg");
    return;
  }

  const liteMode = shouldUseLiteMode();
  document.body.classList.toggle("css-bg", liteMode);
  document.body.classList.toggle("video-bg", !liteMode);

  if (liteMode) {
    stopBackgroundVideo();
  }
}

function stopBackgroundVideo() {
  const video = document.querySelector(".background-video");
  if (!video) {
    return;
  }

  video.pause();
  video.removeAttribute("src");
  video.querySelectorAll("source").forEach((source) => {
    source.removeAttribute("src");
  });
  video.load();
}

function initFormEnhancements() {
  const loginForm = document.querySelector("#kc-form-login, .pmo-card form");
  if (!loginForm) {
    return;
  }

  const username = loginForm.querySelector("#username:not([type='hidden'])");
  const password = loginForm.querySelector("#password");
  const toggle = loginForm.querySelector(".password-toggle");

  if (username) {
    window.setTimeout(() => username.focus({ preventScroll: true }), 80);
  }

  if (toggle && password) {
    toggle.addEventListener("click", () => {
      const isVisible = password.type === "text";
      password.type = isVisible ? "password" : "text";
      toggle.classList.toggle("is-visible", !isVisible);
      toggle.setAttribute("aria-pressed", String(!isVisible));
      toggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
      password.focus({ preventScroll: true });
    });
  }

  [username, password].filter(Boolean).forEach((field) => {
    field.addEventListener("input", () => {
      if (field.value.trim()) {
        setFieldError(field, "");
      }
    });
  });

  loginForm.addEventListener("submit", (event) => {
    const hasBackendAction = Boolean(loginForm.getAttribute("action"));
    if (!hasBackendAction) {
      event.preventDefault();
    }

    const hasUsername = username ? validateRequired(username, "Enter your user name or email.") : true;
    const hasPassword = password ? validateRequired(password, "Enter your password.") : true;

    if (!hasUsername || !hasPassword) {
      event.preventDefault();
      (hasUsername ? password : username)?.focus({ preventScroll: false });
      loginForm.classList.remove("is-submitting");
      return;
    }

    if (hasBackendAction) {
      loginForm.classList.add("is-submitting");
      const submit = loginForm.querySelector("button[type='submit']");
      if (submit) {
        submit.textContent = "Loading...";
      }
    }
  });
}

function revealWhenReady() {
  const video = document.querySelector(".background-video");
  const reveal = () => document.body.classList.add("is-ready");
  const fallback = window.setTimeout(reveal, 1400);

  if (!video || document.body.classList.contains("css-bg")) {
    reveal();
    return;
  }

  if (video.readyState >= 2) {
    window.clearTimeout(fallback);
    reveal();
    return;
  }

  video.addEventListener("loadeddata", () => {
    window.clearTimeout(fallback);
    reveal();
  }, { once: true });
}

function validateRequired(field, message) {
  if (field.value.trim()) {
    setFieldError(field, "");
    return true;
  }

  setFieldError(field, message);
  return false;
}

function setFieldError(field, message) {
  const group = field.closest(".field-group");
  const error = group?.querySelector(".field-error");
  if (!group || !error) {
    return;
  }

  group.classList.toggle("is-invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
}

function initPmoScene(THREE) {
  const canvas = document.querySelector("#pmo-3d-scene");
  if (!canvas || !window.WebGLRenderingContext) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 3.2, 9.5);
  camera.lookAt(1.8, -1.1, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    preserveDrawingBuffer: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setClearColor(0x000000, 0);

  const ambient = new THREE.AmbientLight(0x8db6ff, 1.2);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
  keyLight.position.set(-3, 6, 7);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x4d8dff, 8, 18);
  rimLight.position.set(4, 2, 4);
  scene.add(rimLight);

  const rig = new THREE.Group();
  rig.position.set(2.35, -1.25, -0.4);
  rig.rotation.set(-0.48, -0.25, 0.04);
  rig.scale.setScalar(window.innerWidth < 920 ? 0.9 : 0.98);
  scene.add(rig);

  const panelMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0d3f7d,
    metalness: 0.2,
    roughness: 0.25,
    clearcoat: 0.8,
    clearcoatRoughness: 0.18,
    transparent: true,
    opacity: 0.82
  });

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x9eb8d6,
    metalness: 0.65,
    roughness: 0.28
  });

  const panelGeometry = new THREE.BoxGeometry(1.18, 0.68, 0.035);
  const frameGeometry = new THREE.BoxGeometry(1.28, 0.78, 0.03);

  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.set((col - 3.5) * 1.36, 0, (row - 2) * 0.86);
      frame.rotation.x = -Math.PI / 2;
      rig.add(frame);

      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.set(frame.position.x, 0.035, frame.position.z);
      panel.rotation.x = -Math.PI / 2;
      rig.add(panel);
    }
  }

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x71a7ff,
    transparent: true,
    opacity: 0.32
  });

  for (let i = 0; i < 12; i += 1) {
    const points = [
      new THREE.Vector3(-6.2 + i * 1.1, 0.07, -2.4),
      new THREE.Vector3(-4.8 + i * 1.1, 0.07, 2.4)
    ];
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial);
    rig.add(line);
  }

  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.lookAt(1.8, -1.1, 0);
    rig.scale.setScalar(width < 920 ? 0.9 : 0.98);
    renderer.setSize(width, height, false);
  }

  resize();
  window.addEventListener("resize", resize);

  let frameId = 0;
  const clock = new THREE.Clock();

  function render() {
    const elapsed = clock.getElapsedTime();
    if (!prefersReducedMotion) {
      rig.rotation.y = -0.25 + Math.sin(elapsed * 0.55) * 0.16;
      rig.rotation.z = 0.04 + Math.sin(elapsed * 0.34) * 0.055;
      rig.position.y = -1.25 + Math.sin(elapsed * 0.42) * 0.1;
    }
    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(render);
  }

  render();

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(frameId);
    renderer.dispose();
    panelGeometry.dispose();
    frameGeometry.dispose();
    panelMaterial.dispose();
    frameMaterial.dispose();
    lineMaterial.dispose();
  }, { once: true });
}
