/* ===============================
   FIREBASE INITIALIZATION
================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCs_A6v34SUtQE_rcH7PtCe0kpVIrtw9Fk",
  authDomain: "unanicare-240.firebaseapp.com",
  projectId: "unanicare-240",
  storageBucket: "unanicare-240.firebasestorage.app",
  messagingSenderId: "493283987962",
  appId: "1:493283987962:web:be7d97114cbd630b6a1443"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ===============================
   GLOBAL NAV + BASIC SETUP
================================ */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');
  const navLinks = document.querySelectorAll('nav ul li a');

  toggle.addEventListener('click', () => navList.classList.toggle('show'));
  navLinks.forEach(link =>
    link.addEventListener('click', () => navList.classList.remove('show'))
  );

  document.addEventListener('contextmenu', e => e.preventDefault());

  // ONLY FIREBASE CONTENT
  loadTestimonials();
});

/* ===============================
   ADMIN ACCESS (TESTIMONIAL ONLY)
================================ */
window.addContent = function (section) {
  if (section === "medicine") {
    alert("Medicines are static and cannot be modified.");
    return;
  }

  if (section === "testimonial") {
    openAdminForm("testimonial");
  }
};

/* ===============================
   ADMIN FORM HANDLING
================================ */
function openAdminForm(section) {
  document.getElementById('admin-form-overlay').classList.remove('hidden');

  document
    .querySelectorAll('#admin-form-overlay .admin-form')
    .forEach(f => f.classList.add('hidden'));

  if (section === 'testimonial') {
    document.getElementById('adminFormTitle').innerText = "Add Testimonial";
    document.getElementById('testimonialForm').classList.remove('hidden');
  }
}

function closeAdminForm() {
  document.getElementById('admin-form-overlay').classList.add('hidden');
}

/* ===============================
   TESTIMONIALS (FIREBASE ONLY)
================================ */
async function saveTestimonial() {
  const text = document.getElementById('tText').value.trim();
  const name = document.getElementById('tName').value.trim() || "Anonymous";

  if (!text) return alert("Testimonial required");

  try {
    await addDoc(collection(db, "testimonials"), {
      text,
      name,
      createdAt: Date.now()
    });

    alert("Thank you for your testimonial!");
    closeAdminForm();
    loadTestimonials();
  } catch (err) {
    console.error(err);
    alert("Failed to save testimonial");
  }
}

async function loadTestimonials() {
  const box = document.querySelector(".testimonial-boxes");
  box.innerHTML = "";

  try {
    const snap = await getDocs(collection(db, "testimonials"));
    snap.forEach(d => {
      const t = d.data();
      if (!t?.text) return;

      const div = document.createElement("div");
      div.className = "testimonial-box";
      div.style.background =
        "url('blurbackground.jpg') no-repeat center/cover";

      div.innerHTML = `
        <p>"${t.text}"</p>
        <h4>- ${t.name || "Anonymous"}</h4>
      `;

      box.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

/* ===============================
   BUY MEDICINE POPUP (STATIC)
================================ */
document.addEventListener('click', e => {
  if (e.target.classList.contains('buy-btn')) {
    document.getElementById('medicineName').value =
      e.target.getAttribute('data-medicine');

    document.getElementById('buy-form-overlay')
      .classList.remove('hidden');
  }
});

window.closeBuyForm = function () {
  document.getElementById('buy-form-overlay').classList.add('hidden');
  document.getElementById('buyForm').reset();
};

document.getElementById('buyForm').addEventListener('submit', async e => {
  e.preventDefault();

  const orderData = {
    medicine: document.getElementById('medicineName').value,
    name: document.getElementById('buyerName').value,
    contact: document.getElementById('buyerContact').value,
    message: document.getElementById('buyerMessage').value,
    time: new Date().toLocaleString(), // matches {{time}}
    createdAt: Date.now()
  };

  try {
    //Save to Firebase
    await addDoc(collection(db, "orders"), orderData);

   //Send Email via EmailJS
    await emailjs.send(
      "service_4cli6bo",     // EmailJS → Email Services
      "template_xwt3jor",    // EmailJS → Email Templates
      orderData
    );

    alert("Order sent successfully! We will contact you soon.");
    closeBuyForm();

  } catch (err) {
    console.error(err);
    alert("Failed to send order");
  }
});


/* ===============================
   MEDICINE SEARCH (STATIC HTML)
================================ */
function searchMedicine() {
  const input = document
    .getElementById('medicineSearch')
    .value
    .toLowerCase();

  document.querySelectorAll('#medicine-grid .medicine-item')
    .forEach(card => {
      const name = card.querySelector('h4').innerText.toLowerCase();
      card.style.display = name.includes(input) ? "block" : "none";
    });
}

document.getElementById("searchBtn")
  .addEventListener("click", searchMedicine);


/* ===============================
   EXPORTS
================================ */
// ===== MAKE FUNCTIONS GLOBAL FOR HTML =====
window.searchMedicine = searchMedicine;
window.addContent = addContent;
window.saveTestimonial = saveTestimonial;
window.closeAdminForm = closeAdminForm;
window.closeBuyForm = closeBuyForm;



