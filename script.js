document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');
  const navLinks = document.querySelectorAll('nav ul li a');

  toggle.addEventListener('click', () => {
    navList.classList.toggle('show');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navList.classList.remove('show');
      }
    });
  });

  // Disable right‑click / context menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert('Right-click is disabled.');
  });
});

// Password + Plus‑button logic
const correctPassword = "yourSecretPassword";  // change this
let currentSection = null;

function addContent(section) {
  currentSection = section;
  const promptDiv = document.getElementById('password-prompt');
  promptDiv.classList.remove('hidden');
  document.getElementById('password').value = '';
  document.getElementById('password').focus();
}

function verifyPassword() {
  const pwdInput = document.getElementById('password').value;
  const promptDiv = document.getElementById('password-prompt');

  if (pwdInput === correctPassword) {
    promptDiv.classList.add('hidden');
    promptToAddContent();
  } else {
    alert('Incorrect password. Please try again.');
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
  }
}

function promptToAddContent() {
  if (!currentSection) return;

  let content = prompt(`Enter the new content (for ${currentSection}):`);
  if (!content) return;

  addNewContent(currentSection, content);
}

function addNewContent(section, content) {
  let container = null;

  if (section === 'video') {
    container = document.getElementById('videos-list');
    // For video: we expect maybe a YouTube link or embed code
    let div = document.createElement('div');
    div.innerHTML = `<iframe src="${content}" allowfullscreen style="width:100%; aspect-ratio:16/9; margin:0.5rem 0;"></iframe>`;
    container.appendChild(div);
  }
  else if (section === 'medicine') {
  container = document.getElementById('medicine-grid');
  let div = document.createElement('div');
  div.className = 'medicine-item';
  div.innerHTML = `
    <img src="placeholder.jpg" alt="${content.split('|')[0]}">
    <h4>${content.split('|')[0]}</h4>
    <p>${content.split('|')[1] || ''}</p>
    <p class="price">${content.split('|')[2] || '₹--'}</p>
    <button class="buy-btn" data-medicine="${content.split('|')[0]}">Buy Now</button>
  `;
  container.insertBefore(div, document.querySelector('.plus-button'));
}

  else if (section === 'testimonial') {
    container = document.querySelector('.testimonial-boxes');
    let div = document.createElement('div');
    div.className = 'testimonial-box';
    div.innerHTML = `<p>"${content}"</p><h4>- Anonymous</h4>`;
    container.appendChild(div);
  }

  // Reset currentSection
  currentSection = null;
}

// === Buy Medicine Popup Logic ===
document.addEventListener('DOMContentLoaded', () => {
  const buyButtons = document.querySelectorAll('.buy-btn');
  const buyFormOverlay = document.getElementById('buy-form-overlay');
  const buyForm = document.getElementById('buyForm');
  const medicineInput = document.getElementById('medicineName');

  // Open popup with correct medicine name
  buyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const medicineName = button.getAttribute('data-medicine');
      medicineInput.value = medicineName;
      buyFormOverlay.classList.remove('hidden');
    });
  });

  // Close form function
  window.closeBuyForm = function () {
    buyFormOverlay.classList.add('hidden');
    buyForm.reset();
  };

  // Handle form submission
  const API_URL = "https://api.unanicare.com/sendOrder"; // Replace with your API endpoint

  buyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const orderData = {
      medicine: medicineInput.value,
      name: document.getElementById('buyerName').value,
      contact: document.getElementById('buyerContact').value,
      message: document.getElementById('buyerMessage').value
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        alert("✅ Your order has been sent successfully!");
        closeBuyForm();
      } else {
        alert("❌ Failed to send your order. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Connection error. Please try again later.");
    }
  });
});

// === Smooth Scroll to Section Start ===
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // stop default jump

    const targetId = this.getAttribute('href').substring(1);
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      // Scroll to section start smoothly
      window.scrollTo({
        top: targetEl.offsetTop - 60, // adjust offset if header height ≠ 60px
        behavior: 'smooth'
      });
    }

    // Optional: close mobile menu if open
    document.querySelector('nav ul').classList.remove('open');
  });
});


function searchMedicine() {
  const input = document.getElementById('medicineSearch').value.toLowerCase().trim();
  const cards = document.querySelectorAll('.medicine-item');
  let found = false;

  cards.forEach(card => {
    const name = card.querySelector('h4').textContent.toLowerCase();

    // Reset previous highlights
    card.classList.remove('highlight');

    if (name.includes(input) && input !== "") {
      // Highlight and scroll to first match
      if (!found) {
        card.classList.add('highlight');
        card.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        found = true;
      }
    }
  });

  // Optional: if no result found, show alert
  if (input !== "" && !found) {
    alert("No medicine found with that name.");
  }
}

