// ===========================
// STATE MANAGEMENT
// ===========================
const state = {
  isEnvelopeOpen: false,
  isEnvelopeLocked: false,
  selectedSeal: null,
  message: "",
  isMusicPlaying: false,
  photos: [],
  currentBorder: "roses",
  memoryPins: [],
  countdownComplete: false,
};

// ===========================
// FALLING HEARTS ANIMATION
// ===========================
function createFallingHearts() {
  const heartsContainer = document.getElementById("heartsContainer");
  const heartSymbols = ["❤️", "💕", "💖", "💗", "💓", "💝"];

  function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.textContent =
      heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDuration = Math.random() * 5 + 8 + "s";
    heart.style.fontSize = Math.random() * 15 + 15 + "px";

    heartsContainer.appendChild(heart);

    setTimeout(
      () => {
        heart.remove();
      },
      parseFloat(heart.style.animationDuration) * 1000,
    );
  }

  // Create hearts continuously
  setInterval(createHeart, 800);

  // Create initial batch
  for (let i = 0; i < 10; i++) {
    setTimeout(createHeart, i * 300);
  }
}

// ===========================
// COUNTDOWN TIMER
// ===========================
function initializeCountdown() {
  const valentinesDay = new Date("2026-02-05T13:59:00");
  const flowerField = document.getElementById("flowerField");

  function updateCountdown() {
    const now = new Date();
    const difference = valentinesDay - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      document.getElementById("days").textContent = String(days).padStart(
        2,
        "0",
      );
      document.getElementById("hours").textContent = String(hours).padStart(
        2,
        "0",
      );
      document.getElementById("minutes").textContent = String(minutes).padStart(
        2,
        "0",
      );
      document.getElementById("seconds").textContent = String(seconds).padStart(
        2,
        "0",
      );

      // Hide flowers while counting down
      if (flowerField && !flowerField.classList.contains("hidden")) {
        flowerField.classList.add("hidden");
      }
    } else {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";

      // Show flower field when countdown is over
      if (flowerField) {
        flowerField.classList.remove("hidden");
        console.log("💐 Happy Valentine's Day! Flowers are blooming! 💐");
      }

      // Unlock envelope and poem features
      if (!state.countdownComplete) {
        state.countdownComplete = true;
        unlockFeatures();
        console.log("💌 Envelope and Poem unlocked! 💌");
      }
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Function to unlock envelope and poem after countdown
function unlockFeatures() {
  const waxSealContainer = document.getElementById("waxSealContainer");
  const envelopeContainer = document.getElementById("envelopeContainer");
  const revealBtn = document.getElementById("revealPoemBtn");
  const poemSection = document.querySelector(".poem-section");

  // Unlock envelope
  if (waxSealContainer) {
    waxSealContainer.style.opacity = "1";
    waxSealContainer.style.cursor = "pointer";
    waxSealContainer.classList.remove("locked");
  }
  if (envelopeContainer) {
    envelopeContainer.classList.remove("locked");
  }

  // Unlock poem button
  if (revealBtn) {
    revealBtn.disabled = false;
    revealBtn.classList.remove("locked");
  }
  if (poemSection) {
    poemSection.classList.remove("locked");
  }
}

// Function to lock features initially
function lockFeatures() {
  const waxSealContainer = document.getElementById("waxSealContainer");
  const envelopeContainer = document.getElementById("envelopeContainer");
  const revealBtn = document.getElementById("revealPoemBtn");
  const poemSection = document.querySelector(".poem-section");

  // Lock envelope
  if (waxSealContainer) {
    waxSealContainer.style.opacity = "0.5";
    waxSealContainer.style.cursor = "not-allowed";
    waxSealContainer.classList.add("locked");
  }
  if (envelopeContainer) {
    envelopeContainer.classList.add("locked");
  }

  // Lock poem button
  if (revealBtn) {
    revealBtn.disabled = true;
    revealBtn.classList.add("locked");
  }
  if (poemSection) {
    poemSection.classList.add("locked");
  }
}

// ===========================
// MUSIC TOGGLE WITH PLAYLIST
// ===========================
const playlist = [
  {
    title: "It's You - Ali Gatie",
    src: "audio/Ali Gatie - It's You lyrics.mp3",
  },
  {
    title: "Day and Night",
    src: "audio/day and night.mp3",
  },
  {
    title: "Love of My Life",
    src: "audio/love of my life.mp3",
  },
  {
    title: "Only",
    src: "audio/only.mp3",
  },
  {
    title: "The Only One",
    src: "audio/the only one.mp3",
  },
];

let currentTrackIndex = 0;

function initializeMusicToggle() {
  const musicBtn = document.getElementById("musicBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const backgroundMusic = document.getElementById("backgroundMusic");
  const musicText = musicBtn.querySelector(".music-text");
  const songTitle = document.getElementById("songTitle");

  // Load first track
  loadTrack(currentTrackIndex);

  // Try to autoplay immediately
  const tryAutoplay = () => {
    backgroundMusic
      .play()
      .then(() => {
        // Fade in
        let volume = 0;
        backgroundMusic.volume = 0;
        const fadeIn = setInterval(() => {
          if (volume < 0.5) {
            volume += 0.05;
            backgroundMusic.volume = volume;
          } else {
            clearInterval(fadeIn);
          }
        }, 100);

        musicBtn.classList.add("playing");
        musicText.textContent = "Pause Music";
        state.isMusicPlaying = true;
        console.log("Music autoplaying...");

        // Remove click listener once playing
        document.removeEventListener("click", tryAutoplay);
      })
      .catch((err) => {
        console.log("Autoplay prevented, waiting for user interaction:", err);
      });
  };

  // Try autoplay after delay
  setTimeout(tryAutoplay, 500);

  // Also try on first user interaction
  document.addEventListener("click", tryAutoplay, { once: true });

  // Play/Pause button
  musicBtn.addEventListener("click", () => {
    if (state.isMusicPlaying) {
      backgroundMusic.pause();
      musicBtn.classList.remove("playing");
      musicText.textContent = "Play Music";
      state.isMusicPlaying = false;
    } else {
      backgroundMusic.play().catch((err) => {
        console.log("Audio playback failed:", err);
        alert("Please interact with the page to enable music.");
      });

      // Fade in
      let volume = 0;
      backgroundMusic.volume = 0;
      const fadeIn = setInterval(() => {
        if (volume < 0.5) {
          volume += 0.05;
          backgroundMusic.volume = volume;
        } else {
          clearInterval(fadeIn);
        }
      }, 100);

      musicBtn.classList.add("playing");
      musicText.textContent = "Pause Music";
      state.isMusicPlaying = true;
    }
  });

  // Previous button
  prevBtn.addEventListener("click", () => {
    currentTrackIndex =
      (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if (state.isMusicPlaying) {
      backgroundMusic.play();
    }
  });

  // Next button
  nextBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (state.isMusicPlaying) {
      backgroundMusic.play();
    }
  });

  // Auto-play next song when current ends
  backgroundMusic.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (state.isMusicPlaying) {
      backgroundMusic.play();
    }
  });

  function loadTrack(index) {
    const track = playlist[index];
    backgroundMusic.src = track.src;
    songTitle.textContent = track.title;
    console.log(`Loaded: ${track.title}`);
  }
}

// ===========================
// ENVELOPE INTERACTION
// ===========================
function initializeEnvelope() {
  const envelope = document.getElementById("envelope");
  const letter = document.getElementById("letter");

  // Set the static message
  state.message = `💘To My Dearest Love, Happy Valentine's Day. Every moment with you is a treasure I hold close to my heart. You are my forever and always. With all my love, Dada loves you truly.💕`;

  // Envelope starts closed and sealed
  state.isEnvelopeOpen = false;
  state.isEnvelopeLocked = true;
  envelope.classList.add("locked");

  // Click letter to close envelope
  letter.addEventListener("click", (e) => {
    e.stopPropagation();

    if (state.isEnvelopeOpen) {
      console.log("Letter clicked - closing envelope");
      closeEnvelope();
    }
  });

  // Add cursor pointer to letter when envelope is open
  letter.style.cursor = "pointer";
  letter.title = "Click to close the envelope";
}

// Helper function to close envelope
function closeEnvelope() {
  const envelope = document.getElementById("envelope");
  const waxSealContainer = document.getElementById("waxSealContainer");
  const waxSeal = document.getElementById("waxSeal");

  state.isEnvelopeOpen = false;

  envelope.classList.remove("open");

  // Show seal again with animation after envelope closes
  setTimeout(() => {
    waxSealContainer.classList.remove("hidden");
    waxSealContainer.style.opacity = "1";
    waxSealContainer.style.transform = "translateX(-50%) scale(1)";

    state.isEnvelopeLocked = true;
    envelope.classList.add("locked");

    // Add seal animation
    waxSeal.style.animation = "sealBounce 0.5s ease";
    setTimeout(() => {
      waxSeal.style.animation = "sealShine 3s ease-in-out infinite";
    }, 500);

    console.log("Envelope sealed with love! 💘");
  }, 800);
}

// ===========================
// WAX SEAL SYSTEM
// ===========================
function initializeWaxSeal() {
  const waxSeal = document.getElementById("waxSeal");
  const waxSealContainer = document.getElementById("waxSealContainer");
  const envelope = document.getElementById("envelope");

  // Set cupid seal by default - start closed
  state.selectedSeal = "cupid";

  // Make the wax seal clickable to open envelope
  waxSealContainer.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("Wax seal clicked!");
    console.log("Current state - Open:", state.isEnvelopeOpen);

    // Check if countdown is complete
    if (!state.countdownComplete) {
      alert(
        "🕒 Please wait until the countdown is over to open your love letter! 💌",
      );
      return;
    }

    if (!state.isEnvelopeOpen) {
      // Open the envelope
      state.isEnvelopeLocked = false;
      state.isEnvelopeOpen = true;

      envelope.classList.remove("locked");
      envelope.classList.add("open");

      // Hide seal with animation
      waxSealContainer.style.opacity = "0";
      waxSealContainer.style.transform = "translate(-50%, -50%) scale(0.5)";

      setTimeout(() => {
        waxSealContainer.classList.add("hidden");
      }, 300);

      console.log("Envelope opened! 💘");
    }
  });

  // Add hover effect
  waxSealContainer.style.cursor = "pointer";
  waxSealContainer.title = "Click to open the envelope";

  console.log("Wax seal initialized successfully");
}

// ===========================
// PHOTO GALLERY
// ===========================
function initializePhotoGallery() {
  const photoGallery = document.getElementById("photoGallery");
  const borderSelect = document.getElementById("borderSelect");
  const albumButtons = document.querySelectorAll(".album-btn");

  // Organize images by album
  const albums = {
    anda: [
      "Anda.jpg",
      "Anda1.jpg",
      "Anda2.jpg",
      "Anda3.jpg",
      "Anda4.jpg",
      "Anda5.jpg",
      "Anda6.jpg",
    ],
    bisu: [
      "BISU-Bilar Campus.jpg",
      "BISU-Bilar Campus1.jpg",
      "BISU-Bilar Campus2.jpg",
      "BISU-Bilar Campus3.jpg",
    ],
    bku: [
      "BKU.jpg",
      "BKU1.jpg",
      "BKU2.jpg",
      "BKU3.jpg",
      "BKU4.jpg",
      "BKU5.jpg",
      "BKU6.jpg",
      "BKU7.jpg",
    ],
    jollibee: [
      "Jollibee Alturas.jpg",
      "Jollibee Alturas1.jpg",
      "Jollibee Alturas2.jpg",
    ],
    fatima: [
      "Our Lady Of Fatima, Carmen.jpg",
      "Our Lady Of Fatima, Carmen1.jpg",
      "Our Lady Of Fatima, Carmen2.jpg",
    ],
    poblacion: [
      "poblacion.jpg",
      "poblacion1.jpg",
      "poblacion2.jpg",
      "poblacion3.jpg",
      "poblacion4.jpg",
      "poblacion5.jpg",
      "poblacion6.jpg",
      "poblacion7.jpg",
    ],
    puerto: [
      "puerto.jpg",
      "puerto1.jpg",
      "puerto2.jpg",
      "puerto3.jpg",
      "puerto4.jpg",
      "puerto5.jpg",
      "puerto6.jpg",
      "puerto7.jpg",
    ],
    screenville: [
      "screenville.jpg",
      "screenville1.jpg",
      "screenville2.jpg",
      "screenville3.jpg",
      "screenville4.jpg",
    ],
    sikatuna: [
      "Sikatuna Mirror of The World.jpg",
      "Sikatuna Mirror of The World1.jpg",
      "Sikatuna Mirror of The World2.jpg",
      "Sikatuna Mirror of The World3.jpg",
      "Sikatuna Mirror of The World4.jpg",
    ],
    wayside: ["Wayside.jpg", "Wayside1.jpg", "Wayside2.jpg", "Wayside3.jpg"],
    zamora: ["zamora.jpg", "zamora1.jpg", "zamora2.jpg", "zamora3.jpg"],
  };

  // Function to display photos for selected album
  function displayAlbum(albumName) {
    console.log(`displayAlbum called with: ${albumName}`);
    photoGallery.innerHTML = ""; // Clear gallery

    let imagesToShow = [];
    if (albumName === "all") {
      // Show all images
      Object.values(albums).forEach((albumImages) => {
        imagesToShow.push(...albumImages);
      });
    } else {
      // Show specific album
      imagesToShow = albums[albumName] || [];
    }

    console.log(
      `Displaying ${imagesToShow.length} images for album: ${albumName}`,
    );

    imagesToShow.forEach((imageName) => {
      const photoItem = document.createElement("div");
      photoItem.classList.add("photo-item", state.currentBorder);
      photoItem.setAttribute(
        "data-album",
        albumName === "all" ? getAlbumFromImage(imageName) : albumName,
      );

      const img = document.createElement("img");
      img.src = `our memories/${imageName}`;
      img.alt = "Memory photo";

      photoItem.appendChild(img);
      photoGallery.appendChild(photoItem);
    });
  }

  // Helper function to determine which album an image belongs to
  function getAlbumFromImage(imageName) {
    for (const [albumName, images] of Object.entries(albums)) {
      if (images.includes(imageName)) {
        return albumName;
      }
    }
    return "all";
  }

  // Load Anda album on page load
  displayAlbum("anda");
  console.log("Photo gallery initialized - showing Anda album");

  // Album button click handlers
  albumButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Album button clicked:", button.getAttribute("data-album"));

      // Remove active class from all buttons
      albumButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");

      // Display selected album
      const albumName = button.getAttribute("data-album");
      displayAlbum(albumName);
      console.log(`Displaying album: ${albumName}`);
    });
  });

  console.log(`Total album buttons found: ${albumButtons.length}`);

  borderSelect.addEventListener("change", (e) => {
    const newBorder = e.target.value;
    state.currentBorder = newBorder;

    // Re-display current album with new border
    const activeButton = document.querySelector(".album-btn.active");
    const currentAlbum = activeButton
      ? activeButton.getAttribute("data-album")
      : "anda";
    displayAlbum(currentAlbum);

    console.log(
      `Frame style changed to: ${newBorder}, re-displaying album: ${currentAlbum}`,
    );
  });
}

// ===========================
// POEM GENERATOR
// ===========================
function initializePoemGenerator() {
  const revealBtn = document.getElementById("revealPoemBtn");
  const poemContainer = document.getElementById("poemContainer");
  const poemText = document.getElementById("poemText");

  const poems = [
    `On this Valentine’s Day,
with 2026 written softly in time,
I don’t count the years or the dates—
I count the ways you’ve become my home.

You are the quiet miracle in my days,
the reason ordinary moments linger longer.
In your smile, the world learns gentleness;
in your voice, my worries learn to rest.

If love were measured in constellations,
I’d still be lost—
because every time I think I’ve mapped you,
you surprise me with something brighter.

I don’t promise perfection.
I promise presence.
Hands that stay,
a heart that chooses you again and again,
even on the days love is quiet and real.

So take this poem as a vow written in feeling:
that in every version of tomorrow,
in every February and far beyond it,
it is still you I am loving—
slowly, deeply, endlessly.

Happy Valentine’s Day, my love.`,

  ];

  let currentPoemIndex = -1;

  revealBtn.addEventListener("click", () => {
    // Check if countdown is complete
    if (!state.countdownComplete) {
      alert(
        "🕒 Please wait until the countdown is over to reveal the secret poem! ✨",
      );
      return;
    }

    if (poemContainer.classList.contains("revealed")) {
      // Hide poem
      poemContainer.classList.remove("revealed");
      revealBtn.innerHTML = "<span>✨ Reveal a Secret Poem ✨</span>";
    } else {
      // Show new poem
      currentPoemIndex = (currentPoemIndex + 1) % poems.length;
      poemText.textContent = poems[currentPoemIndex];
      poemContainer.classList.add("revealed");
      revealBtn.innerHTML = "<span>✨ Hide Poem ✨</span>";
    }
  });
}

// ===========================
// MEMORY MAP
// ===========================
let map;
const markers = [];

function initializeMemoryMap() {
  console.log("Attempting to initialize map...");

  // Check if Leaflet is loaded
  if (typeof L === "undefined") {
    console.error("Leaflet library not loaded!");
    return;
  }

  // Check if container exists
  const container = document.getElementById("mapCanvas");
  if (!container) {
    console.error("Map container not found!");
    return;
  }

  console.log("Container found:", container);
  console.log(
    "Container dimensions:",
    container.offsetWidth,
    "x",
    container.offsetHeight,
  );

  // Wait for container to be fully rendered
  setTimeout(() => {
    try {
      // Clear any existing map instance
      if (map) {
        map.remove();
      }

      // Initialize Leaflet map
      map = L.map("mapCanvas", {
        center: [9.85, 124.1435], // Bohol, Philippines
        zoom: 10,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: true,
      });

      console.log("Map object created:", map);

      // Add tile layer with error handling
      const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 2,
        },
      );

      tileLayer.on("tileerror", function (error) {
        console.error("Tile loading error:", error);
      });

      tileLayer.on("load", function () {
        console.log("Tiles loaded successfully!");
      });

      tileLayer.addTo(map);

      // Force map to resize properly after a brief delay
      setTimeout(() => {
        map.invalidateSize();
        console.log("Map invalidated and resized");
      }, 250);

      // Add click event to map
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        console.log("Map clicked at:", lat, lng);

        const memory = prompt("Enter a memory for this location:");

        if (memory && memory.trim()) {
          createMemoryPin(lat, lng, memory.trim());
          state.memoryPins.push({ lat, lng, memory: memory.trim() });
        }
      });

      // Add pre-pinned locations in Bohol
      const prePinnedLocations = [
        {
          lat: 10.1525,
          lng: 124.3663,
          memory: "Puerto San Pedro, Bien Unido, Bohol",
          images: [
            "our memories/puerto.jpg",
            "our memories/puerto1.jpg",
            "our memories/puerto2.jpg",
            "our memories/puerto3.jpg",
            "our memories/puerto4.jpg",
            "our memories/puerto5.jpg",
            "our memories/puerto6.jpg",
            "our memories/puerto7.jpg",
          ],
        },
        {
          lat: 10.1399,
          lng: 124.3765,
          memory: "Poblacion, Bien Unido, Bohol",
          images: [
            "our memories/poblacion1.jpg",
            "our memories/poblacion2.jpg",
            "our memories/poblacion3.jpg",
            "our memories/poblacion4.jpg",
            "our memories/poblacion.jpg",
            "our memories/poblacion5.jpg",
            "our memories/poblacion6.jpg",
            "our memories/poblacion7.jpg",
          ],
        },
        {
          lat: 9.7073703,
          lng: 124.1043902,
          memory: "Zamora, Bilar, Bohol",
          images: [
            "our memories/zamora1.jpg",
            "our memories/zamora.jpg",
            "our memories/zamora2.jpg",
            "our memories/zamora3.jpg",
          ],
        },
        {
          lat: 10.15,
          lng: 124.3167,
          memory: "Wayside Inn, San Isidro, Talibon, Bohol",
          images: [
            "our memories/wayside3.jpg",
            "our memories/wayside1.jpg",
            "our memories/wayside2.jpg",
            "our memories/wayside.jpg",
          ],
        },
        {
          lat: 9.6545,
          lng: 123.8695,
          memory:
            "ScreenVille Cinema, Island City Mall, Tagbilaran City, Bohol",
          images: [
            "our memories/screenville4.jpg",
            "our memories/screenville2.jpg",
            "our memories/screenville3.jpg",
            "our memories/screenville.jpg",
            "our memories/screenville1.jpg",
          ],
        },
        {
          lat: 9.85262,
          lng: 124.23192,
          memory: "Our Lady of Fatima Shrine, Carmen, Bohol",
          images: [
            "our memories/Our Lady Of Fatima, Carmen.jpg",
            "our memories/Our Lady Of Fatima, Carmen1.jpg",
            "our memories/Our Lady Of Fatima, Carmen2.jpg",
          ],
        },
        {
          lat: 9.68,
          lng: 123.97,
          memory:
            "Sikatuna's Mirror of the World and Botanical Garden, Sikatuna, Bohol",
          images: [
            "our memories/Sikatuna Mirror of The World.jpg",
            "our memories/Sikatuna Mirror of The World1.jpg",
            "our memories/Sikatuna Mirror of The World2.jpg",
            "our memories/Sikatuna Mirror of The World3.jpg",
            "our memories/Sikatuna Mirror of The World4.jpg",
          ],
        },
        {
          lat: 9.6416,
          lng: 123.8596,
          memory: "Jollibee Alturas Mall, Tagbilaran City, Bohol",
          images: [
            "our memories/Jollibee Alturas.jpg",
            "our memories/Jollibee Alturas1.jpg",
            "our memories/Jollibee Alturas2.jpg",
          ],
        },
        {
          lat: 9.7392,
          lng: 124.5748,
          memory: "Anda Beach (Quinale Beach), Anda, Bohol",
          images: [
            "our memories/Anda.jpg",
            "our memories/Anda1.jpg",
            "our memories/Anda2.jpg",
            "our memories/Anda3.jpg",
            "our memories/Anda4.jpg",
            "our memories/Anda5.jpg",
            "our memories/Anda6.jpg",
          ],
        },
        {
          lat: 9.7181,
          lng: 124.1096,
          memory: "BISU-Bilar Campus, Bilar, Bohol",
          images: [
            "our memories/BISU-Bilar Campus.jpg",
            "our memories/BISU-Bilar Campus1.jpg",
            "our memories/BISU-Bilar Campus2.jpg",
            "our memories/BISU-Bilar Campus3.jpg",
          ],
        },
        {
          lat: 9.722,
          lng: 124.1115,
          memory: "BKU Cafe & Resto, Zamora, Bilar, Bohol",
          images: [
            "our memories/BKU.jpg",
            "our memories/BKU1.jpg",
            "our memories/BKU2.jpg",
            "our memories/BKU3.jpg",
            "our memories/BKU4.jpg",
            "our memories/BKU5.jpg",
            "our memories/BKU6.jpg",
            "our memories/BKU7.jpg",
          ],
        },
      ];

      // Add pre-pinned locations to the map
      setTimeout(() => {
        prePinnedLocations.forEach((location) => {
          createMemoryPin(
            location.lat,
            location.lng,
            location.memory,
            location.images,
          );
          state.memoryPins.push(location);
        });
        console.log(`Added ${prePinnedLocations.length} pre-pinned locations`);
      }, 800);

      console.log("✅ Map initialized successfully!");
    } catch (error) {
      console.error("❌ Error initializing map:", error);
      alert("Error loading map. Please check the browser console for details.");
    }
  }, 500);
}

function createMemoryPin(lat, lng, memory, images = null) {
  if (!map) {
    console.error("Map not initialized yet");
    return;
  }

  const pinIcons = ["💖", "🌹", "💕", "❤️", "💝", "💗"];
  const randomIcon = pinIcons[Math.floor(Math.random() * pinIcons.length)];

  const customIcon = L.divIcon({
    className: "custom-heart-marker",
    html: `<div style="font-size: 2.5rem; text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); animation: bounce 0.6s ease;">${randomIcon}</div>`,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

  const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

  // Create popup content with images if available
  let popupContent = "";

  if (images && images.length > 0) {
    const imageGallery = images
      .map(
        (img) =>
          `<img src="${img}" style="flex: 0 0 auto; height: 200px; width: auto; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);" />`,
      )
      .join("");

    popupContent = `
      <div style="font-family: 'Great Vibes', cursive; color: #8B1538; text-align: center; padding: 10px; width: 350px;">
        <div style="display: flex; gap: 10px; overflow-x: auto; overflow-y: hidden; padding: 5px 0; scroll-behavior: smooth;">
          ${imageGallery}
        </div>
        <div style="font-size: 1.3rem; margin-top: 10px; padding-top: 10px; border-top: 2px solid #FFD1DC;">
          ${memory}
        </div>
      </div>
    `;
  } else {
    popupContent = `
      <div style="font-family: 'Great Vibes', cursive; font-size: 1.3rem; color: #8B1538; text-align: center; padding: 10px; min-width: 150px;">
        ${memory}
      </div>
    `;
  }

  marker.bindPopup(popupContent, {
    maxWidth: 400,
    className: "memory-popup",
  });
  markers.push(marker);

  // Auto-open popup briefly
  marker.openPopup();
  setTimeout(() => marker.closePopup(), 3000);
}

// ===========================
// INITIALIZE ALL FEATURES
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  createFallingHearts();

  // Initialize countdown and check if already complete
  const valentinesDay = new Date("2026-02-05T13:59:00");
  const now = new Date();

  if (now >= valentinesDay) {
    // Countdown already complete - unlock features
    state.countdownComplete = true;
    // Features will be unlocked after DOM elements are initialized
  } else {
    // Lock features until countdown completes
    state.countdownComplete = false;
  }

  initializeCountdown();
  initializeMusicToggle();
  initializeEnvelope();
  initializeWaxSeal();
  initializePhotoGallery();
  initializePoemGenerator();
  initializeMemoryMap();

  // Apply locked/unlocked state after all elements are initialized
  if (state.countdownComplete) {
    unlockFeatures();
  } else {
    lockFeatures();
  }

  console.log("💕 Valentine's Day Card 2026 - Loaded with Love! 💕");
});

// Add pulse animation to envelope
const style = document.createElement("style");
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);
