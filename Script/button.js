//Login/signup to access photos
let isSignup = false;

// Toggle Login/Signup mode
document.getElementById("toggleAuth").onclick = function (e) {
  e.preventDefault();
  isSignup = !isSignup;

  document.getElementById("modalTitle").innerText = isSignup
    ? "Signup"
    : "Login";
  document.getElementById("authBtn").innerText = isSignup ? "Signup" : "Login";
  document.getElementById("toggleText").innerHTML = isSignup
    ? `Already have an account? <a href="#" id="toggleAuth">Login here</a>`
    : `Don't have an account? <a href="#" id="toggleAuth">Signup here</a>`;

  document.getElementById("nameField").classList.toggle("d-none", !isSignup);
  document.getElementById("toggleAuth").onclick = arguments.callee;
};

// Handle form submission
document.getElementById("authForm").onsubmit = function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();
  const name = document.getElementById("fullName").value.trim();

  if (isSignup) {
    localStorage.setItem("user", JSON.stringify({ email, pass, name }));
    alert("Signup successful. Please log in.");
    document.getElementById("toggleAuth").click(); // switch to login
  } else {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored && stored.email === email && stored.pass === pass) {
      sessionStorage.setItem("loggedInUser", stored.name || stored.email);
      alert("Login successful!");
      location.reload();
    } else {
      alert("Invalid credentials!");
    }
  }
};

// On page load
window.onload = function () {
  const user = sessionStorage.getItem("loggedInUser");

  // Show name or Login button
  const loginBtn = document.getElementById("loginBtn");
  if (user) {
    loginBtn.innerText = `Welcome, ${user} (Logout)`;
    loginBtn.onclick = function () {
      sessionStorage.removeItem("loggedInUser");
      location.reload();
    };
  }

  // Protect all .protected elements (anchor tags or buttons)
  document.querySelectorAll(".protected").forEach((el) => {
    el.addEventListener("click", function (e) {
      if (!user) {
        e.preventDefault();
        alert("Please login to access this feature.");
        const modal = new bootstrap.Modal(
          document.getElementById("loginModal")
        );
        modal.show();
        return;
      }

      // If it's a button and has a data-file attribute (for download)
      const file = el.getAttribute("data-file");
      if (file) {
        const a = document.createElement("a");
        a.href = file;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  });
};


//blog
document.addEventListener("DOMContentLoaded", function () {
  const groups = document.querySelectorAll(".gallery-group");
  let currentGroup = 1;

  // Hide all groups except the first
  groups.forEach((group, index) => {
    if (index !== 0) {
      group.classList.add("d-none");
    }
  });

  const loadMoreBtn = document.getElementById("loadMoreBtn");

  loadMoreBtn.addEventListener("click", function () {
    if (currentGroup < groups.length) {
      const nextGroup = groups[currentGroup];
      nextGroup.classList.remove("d-none");

      // Animate each gallery card
      nextGroup.querySelectorAll(".gallery-card").forEach((card, i) => {
        setTimeout(() => {
          card.classList.add("fade-in");
        }, i * 100);
      });

      
      currentGroup++;

      if (currentGroup >= groups.length) {
        loadMoreBtn.style.display = "none";
      }
    }
  });
});


//blog modal
function openModal(imageSrc) {
  const modalImg = document.getElementById("modalImage");
  modalImg.src = imageSrc;
  const modal = new bootstrap.Modal(document.getElementById("imageModal"));
  modal.show();
}

function likeImage(btn) {
  const countSpan = btn.querySelector(".like-count");
  let count = parseInt(countSpan.innerText);
  count++;
  countSpan.innerText = count;
}

//footer modal
  const contentData = {
    about: "This website curates and shares rich collections of Nigerian cultural and historical images.",
    history: "Founded in 2025, our platform is dedicated to preserving Nigeria’s visual heritage.",
    press: "Featured in top Nigerian media outlets for its visual contribution to cultural awareness.",
    contact: "Reach us via email at info@photonaija.com or on social media @photonaija."
  };

  function openPopup(type) {
    const popupBox = document.getElementById("popupBox");
    const popupContent = document.getElementById("popupContent");
    popupContent.textContent = contentData[type] || "No information available.";
    popupBox.classList.remove("d-none");
  }

  function closePopup() {
    document.getElementById("popupBox").classList.add("d-none");
  }



