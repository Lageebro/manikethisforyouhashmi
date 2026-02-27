# Valentine Proposal Web App - Technical Requirements & Instructions

Meka thamai machan project eke mulu roadmap eka. Me steps tika hariyata follow kaloth supiri website ekak hadaganna puluwan.

## 1. Project Overview
Interactive website ekak hadanna thamai balaporoththu wenne "Will you be my Valentine?" kiyala girlfriendgen ahanna. Main feature eka thamai "No" button eka click karanna yaddi eka move wena eka.

## 2. Technical Stack
* **HTML5:** Structure eka hadaganna.
* **Tailwind CSS (via CDN):** Styles saha layout eka ikmanata lassanata kara ganna.
* **JavaScript (Vanilla):** Button movement logic saha interactions walata.
* **Dexie.js:** "Yes" click karama eka local database ekaka save karanna (for persistent data).

## 3. Core Requirements & Logic

### A. The "No" Button Logic (Teleportation)
* **Event Listener:** Button ekata `mouseover` event ekak danna one.
* **Calculation:** Screen eke `window.innerWidth` saha `window.innerHeight` aran, button eke width/height minus karala random position ekak calculate karanna.
* **Positioning:** Button ekata `absolute` position eka dila `top` saha `left` values random widihata update karanna JavaScript walin.

### B. The "Yes" Button Logic
* **Action:** Click karama "Yay! I love you!" wage message ekak saha lassanata GIF ekak display wenna danna.
* **Data Persistence:** Dexie.js use karala `valentine_db` kiyala database ekak hadala, "Response: Yes" saha "Date" eka save karanna.

## 4. Implementation Steps (Code Structure)

### Step 1: HTML Boilerplate
Tailwind CSS saha Dexie.js scripts tika `<head>` ekata add karaganna.
```html
<script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>
<script src="[https://unpkg.com/dexie/dist/dexie.js](https://unpkg.com/dexie/dist/dexie.js)"></script>