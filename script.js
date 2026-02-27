document.addEventListener('DOMContentLoaded', () => {

    // --- HTML Elements ---
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const questionScreen = document.getElementById('question-screen');
    const successScreen = document.getElementById('success-screen');
    const savedStatus = document.getElementById('saved-status');
    const okayBtn = document.getElementById('okay-btn');
    const helperText = document.getElementById('helper-text');
    const chaosWarning = document.getElementById('chaos-warning');
    const errorPopup = document.getElementById('error-popup');
    const errorFixBtn = document.getElementById('error-fix-btn');
    const apologyPopup = document.getElementById('apology-popup');
    const apologyCloseBtn = document.getElementById('apology-close-btn');

    // --- Configuration & Content ---
    const PHASE_THRESHOLDS = {
        shy: 3,
        playful: 7,
        dramatic: 12,
        emotional: 15
    };

    const TOOLTIPS = {
        shy: ["Hitha kaduna manikee 💔", "raththaran", "Manikeeeee", "Suduuuuuuuu", "SweetHeart "],
        playful: ["Hitha kaduna manikee 💔", "Manikeeeeeeeee", "raththaran", "Suduuuuu", "Prinsesssss "],
        dramatic: ["Hitha kaduna manikee 💔", "Suduuuuuuuu", "Manikeeeeeeee", "Honneyyyyy", "Ehemada raththaran 😒"],
        emotional: ["Hitha kaduna manikee 💔", "raththaran", "Manikeeeeeee", "Suduuuuuuuu", "Manikeeeeeeee "],
    };

    const HELPER_TEXTS = {
        shy: "Choose wisely... ",
        playful: "Why are you chasing it Manikee? 🤔",
        dramatic: " Eka wada karanne na sudu 😰",
        emotional: "I think it's not working. oyata YES kiyanna wenoo sudu? 🥺"
    };

    // --- State ---
    let noAttemptCount = 0;
    let chaosActivated = false;

    // --- Dexie Database Setup ---
    const db = new Dexie('valentine_db');
    db.version(1).stores({
        responses: '++id, response, date, attempts, chaosMode'
    });

    // --- Welcome Screen Logic ---
    okayBtn.addEventListener('click', () => {
        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            welcomeScreen.style.display = 'none';

            questionScreen.classList.remove('hidden');
            void questionScreen.offsetWidth; // Trigger reflow
            questionScreen.style.display = 'block';
            questionScreen.style.opacity = '1';
        }, 500);
    });

    // --- Helper Logic ---
    const getPhase = () => {
        if (noAttemptCount < PHASE_THRESHOLDS.shy) return "shy";
        if (noAttemptCount < PHASE_THRESHOLDS.playful) return "playful";
        if (noAttemptCount < PHASE_THRESHOLDS.dramatic) return "dramatic";
        return "emotional";
    };

    const showTooltip = (text, x, y) => {
        const tooltip = document.createElement('div');
        tooltip.textContent = text;
        tooltip.className = 'fixed bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-bold shadow-lg pointer-events-none z-50 animate-bounce transition-opacity duration-500 whitespace-nowrap border border-gray-200';
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y - 40}px`;
        tooltip.style.transform = 'translateX(-50%)'; // Center horizontally

        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 500);
        }, 1000);
    };

    const updateHelperText = (phase) => {
        helperText.textContent = HELPER_TEXTS[phase];
        helperText.classList.add('scale-110', 'text-pink-600');
        setTimeout(() => {
            helperText.classList.remove('scale-110', 'text-pink-600');
        }, 200);
    };

    // --- "No" Button Interaction ---
    const handleNoInteraction = (e) => {
        // Essential: Move to body if needed
        if (noBtn.parentNode !== document.body) {
            const rect = noBtn.getBoundingClientRect();
            document.body.appendChild(noBtn);
            noBtn.style.position = 'absolute';
            noBtn.style.left = `${rect.left}px`;
            noBtn.style.top = `${rect.top}px`;
        }

        // Chaos Mode Activation
        if (noAttemptCount >= PHASE_THRESHOLDS.playful && !chaosActivated) {
            chaosActivated = true;
            chaosWarning.classList.remove('hidden');
            document.body.classList.remove('from-purple-200', 'via-violet-100', 'to-purple-300');
            document.body.classList.add('bg-red-50'); // Simplify bg or make it chaotic, but NO shaking
            // Add a red tint overlay or something if desired, but text change is good enough
        }

        // Betrayal Popup Logic (Chance during chaos)
        if (chaosActivated && Math.random() < 0.3) {
            errorPopup.classList.remove('hidden');
            errorPopup.style.display = 'flex';
            return; // Stop the button from moving this time, force interaction with popup
        }

        // Move the button
        moveNoButton();

        // Update State
        noAttemptCount++;
        const phase = getPhase();
        updateHelperText(phase);

        // Tooltip
        const tooltips = TOOLTIPS[phase];
        const randomTooltip = tooltips[Math.floor(Math.random() * tooltips.length)];
        const rect = noBtn.getBoundingClientRect();
        showTooltip(randomTooltip, rect.left + rect.width / 2, rect.top);
    };

    const moveNoButton = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const btnRect = noBtn.getBoundingClientRect();
        const phase = getPhase();

        const maxX = viewportWidth - btnRect.width - 20;
        const maxY = viewportHeight - btnRect.height - 20;

        let newX, newY;

        if (phase === "emotional") {
            // Hide in corners
            const corners = [
                { x: 30, y: 30 },
                { x: maxX, y: 30 },
                { x: 30, y: maxY },
                { x: maxX, y: maxY }
            ];
            const corner = corners[Math.floor(Math.random() * corners.length)];
            newX = corner.x;
            newY = corner.y;
            // No shrinking
        } else {
            // ALWAYS jump to a random place (Shy, Playful, Dramatic)
            // This ensures "eka thanin thanata yanawa" (goes from place to place) behavior immediately
            newX = Math.random() * maxX;
            newY = Math.random() * maxY;
        }

        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;

        // Random Rotation if playful/dramatic (but NO scaling)
        if (phase === "dramatic" || phase === "playful" || phase === "shy") {
            const rotate = Math.random() * 30 - 15;
            noBtn.style.transform = `rotate(${rotate}deg)`;
        }
    };

    // Event Listeners
    noBtn.addEventListener('mouseover', handleNoInteraction);
    noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleNoInteraction(); });

    // Fix Button Logic
    errorFixBtn.addEventListener('click', () => {
        errorPopup.classList.add('hidden');
        errorPopup.style.display = 'none';
        yesBtn.click(); // Auto-click Yes
    });

    // --- "Yes" Button Logic (Step 1: Show Apology) ---
    yesBtn.addEventListener('click', () => {
        apologyPopup.classList.remove('hidden');
        apologyPopup.style.display = 'flex';
        // Celebrate a little bit maybe? No, wait for final confirmation
    });

    // --- "Apology Close" Button Logic (Step 2: Real Success) ---
    apologyCloseBtn.addEventListener('click', async () => {
        // Hide Apology
        apologyPopup.classList.add('hidden');
        apologyPopup.style.display = 'none';

        // Trigger Celebration
        celebrate();

        // UI Transition
        questionScreen.style.opacity = '0';
        questionScreen.style.pointerEvents = 'none';

        // Hide Chaos items
        if (noBtn.parentNode === document.body) noBtn.remove();
        chaosWarning.classList.add('hidden');

        setTimeout(() => {
            questionScreen.classList.add('hidden');
            questionScreen.style.display = 'none';

            successScreen.classList.remove('hidden');
            successScreen.style.display = 'block';
            void successScreen.offsetWidth;
            successScreen.style.opacity = '1';

            celebrate();
        }, 500);

        // Save to Database
        try {
            await db.responses.add({
                response: 'Yes',
                date: new Date().toISOString(),
                attempts: noAttemptCount, // Save how hard they tried to say no :P
                chaosMode: chaosActivated
            });
            savedStatus.textContent = "Your answer has been saved forever! 💾❤️";
        } catch (error) {
            console.error("Failed to save to Dexie:", error);
        }
    });

    // --- Confetti Effect Function ---
    function celebrate() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);

        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
        });
    }

    // --- Mouse Heart Trail ---
    let lastTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime < 50) return; // Limit creation rate (every 50ms)
        lastTime = now;

        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        heart.style.fontSize = Math.random() * 20 + 10 + 'px'; // Random size
        heart.style.pointerEvents = 'none'; // Ensure it doesn't block clicks
        heart.style.transform = 'translate(-50%, -50%) scale(0.5)';
        heart.style.zIndex = '1000';
        heart.style.transition = 'all 1s ease-out';
        heart.style.opacity = '0.8';

        document.body.appendChild(heart);

        // Simple animation: float up slightly and fade out
        requestAnimationFrame(() => {
            heart.style.transform = `translate(-50%, -${50 + Math.random() * 50}px) rotate(${Math.random() * 60 - 30}deg) scale(1)`;
            heart.style.opacity = '0';
        });

        setTimeout(() => {
            heart.remove();
        }, 1000);
    });

});
