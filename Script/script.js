//Home  
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Scroll to top after reload
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  });

//navbar scrroll
const navbar = document.getElementById("top");
const hero = document.getElementById("heroSection");

window.addEventListener("scroll", () => {
  const heroBottom = hero.offsetHeight;

  if (window.scrollY > heroBottom - 50) {
    navbar.style.display = "none";
  } else {
    navbar.style.display = "flex"; // or 'block' if using standard nav
  }
});


// Categories
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('href').replace('#', '');

      // Show all items in the target category if using filter logic
      document.querySelectorAll('.gallery-item').forEach(img => {
        const tags = img.getAttribute('data-tags');
        if (tags && tags.includes(targetId)) {
          img.style.display = 'block';
        } else {
          img.style.display = 'none';
        }
      });
    });
  });


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

// hamburger menu
const hamburgerBtn = document.getElementById("customHamburger");
const popup = document.getElementById("hamburgerPopup");
const closePopup = document.getElementById("closePopup");

hamburgerBtn.addEventListener("click", () => {
  popup.style.display = "block";
});

closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});


//search bar
const gallerySearchInput = document.getElementById("gallerySearchInput");
const gallerySearchBtn = document.getElementById("gallerySearchBtn");
const galleryItems = document.querySelectorAll(".gallery-item");
const gallerySection = document.getElementById("gallerySection");
const noResultsMessage = document.getElementById("noResultsMessage");
const filterButtons = document.querySelectorAll(".filter-btn");

// Filter Function (for both search and buttons)
function filterGalleryByTag(tag) {
  let matchFound = false;

  galleryItems.forEach((item) => {
    const itemTags = item.getAttribute("data-tags").toLowerCase();
    const isMatch = tag === "all" || itemTags.includes(tag);
    item.style.display = isMatch ? "block" : "none";
    if (isMatch) matchFound = true;
  });

  // Show or hide "no results"
  noResultsMessage.style.display = matchFound ? "none" : "block";

  // Scroll only if results found
  if (matchFound) {
    scrollToGallery();
  }
}

// Scroll to gallery with offset
function scrollToGallery() {
  const yOffset = 200; // Offset in px, adjust for header height
  const y = gallerySection.getBoundingClientRect().top + window.scrollY + yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
}

// Search: Button Click
gallerySearchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const value = gallerySearchInput.value.toLowerCase().trim();
  if (value) {
    filterGalleryByTag(value);
  }
});

// Search: Enter Key
gallerySearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const value = gallerySearchInput.value.toLowerCase().trim();
    if (value) {
      filterGalleryByTag(value);
    }
  }
});

// Buttons
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tag = btn.getAttribute("data-tag").toLowerCase();
    filterGalleryByTag(tag);
  });
});

// Initial load = show all
    filterGalleryByTag("all");

// Tag filter with scroll
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tag = btn.getAttribute("data-tag").toLowerCase();
    let matchFound = false;

    galleryItems.forEach((item) => {
      const itemTags = item.getAttribute("data-tags").toLowerCase();
      const isMatch = tag === "all" || itemTags.includes(tag);
      item.style.display = isMatch ? "block" : "none";
      if (isMatch) matchFound = true;
    });

    // Scroll only if matches are found
    if (matchFound) {
      const offset = -100; // Adjust offset if you have a sticky header
      const position = gallerySection.getBoundingClientRect().top + window.scrollY + offset;

      window.scrollTo({
        top: position,
        behavior: "smooth"
      });
    }

    // Optional: Hide or show "no results" message
    noResultsMessage.style.display = matchFound ? "none" : "block";
  });
});


// modal image for explore categories
const galleryImages = document.querySelectorAll(".gallery-img");
const modalImage = document.getElementById("modalImage");

galleryImages.forEach((img) => {
  img.addEventListener("click", () => {
    const fullImageUrl = img.getAttribute("data-full");
    modalImage.src = fullImageUrl;
  });
});


// modal for featured photos
 const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalDownloadBtn = document.getElementById("modalDownloadBtn");

  document.querySelectorAll(".card-img-top").forEach(img => {
    img.addEventListener("click", () => {
      const src = img.getAttribute("data-img");
      modalImg.src = src;
      modalDownloadBtn.href = src;
    });
  });

//Carousel for next and previous page
const carouselElement = document.getElementById("groupCarousel");
const carouselWrapper = document.getElementById("myCarouselWrapper");
carouselElement.addEventListener("slid.bs.carousel", function () {
  carouselWrapper.scrollIntoView({ behavior: "smooth" });
});



// This is for the uploaded photos
const uploadForm = document.getElementById("uploadForm");
const photoUpload = document.getElementById("photoUpload");
const photoTitle = document.getElementById("photoTitle");
const photoGallery = document.getElementById("photoGallery");

window.addEventListener("DOMContentLoaded", loadStoredImages);

function loadStoredImages() {
  const stored = JSON.parse(localStorage.getItem("uploadedPhotos")) || [];
  stored.forEach((photo) => {
    addImageToGallery(photo.dataURL, photo.title, photo.uploadedAt);
  });
}

uploadForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const files = photoUpload.files;
  const title = photoTitle.value.trim();

  if (files.length === 0 || title === "") {
    alert("Please add a title and at least one photo.");
    return;
  }

  const stored = JSON.parse(localStorage.getItem("uploadedPhotos")) || [];

  Array.from(files).forEach((file) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        // Resize for display only
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedDisplayURL = canvas.toDataURL("image/jpeg", 0.9); // For display
        const originalDataURL = event.target.result; // Original

        const uploadedAt = new Date().toLocaleString();

        // Save to localStorage
        stored.push({ title, dataURL: originalDataURL, uploadedAt });
        localStorage.setItem("uploadedPhotos", JSON.stringify(stored));

        // Display
        addImageToGallery(originalDataURL, title, uploadedAt);
      };
    };

    reader.readAsDataURL(file);
  });

  uploadForm.reset();
});

function addImageToGallery(dataURL, title, uploadedAt) {
  const wrapper = document.createElement("div");
  wrapper.className = "m-2 text-center";

  const img = document.createElement("img");
  img.src = dataURL;
  img.alt = title;
  img.className = "uploaded-photo rounded shadow";
  img.style.maxWidth = "300px";
  img.style.maxHeight = "300px";

  const caption = document.createElement("div");
  caption.textContent = title;
  caption.className = "mt-2 fw-medium";

  const timeTag = document.createElement("div");
  timeTag.textContent = `Uploaded: ${uploadedAt}`;
  timeTag.className = "text-muted small mb-2";

  const downloadBtn = document.createElement("a");
  downloadBtn.href = dataURL;
  downloadBtn.download = `${title.replace(/\s+/g, "_")}.jpg`;
  downloadBtn.className = "btn btn-sm btn-success me-2";
  downloadBtn.textContent = "Download";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm btn-danger";
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = function () {
    wrapper.remove();
    removeImageFromStorage(dataURL);
  };

  wrapper.appendChild(img);
  wrapper.appendChild(caption);
  wrapper.appendChild(timeTag);
  wrapper.appendChild(downloadBtn);
  wrapper.appendChild(deleteBtn);
  photoGallery.appendChild(wrapper);
}

function removeImageFromStorage(dataURL) {
  let stored = JSON.parse(localStorage.getItem("uploadedPhotos")) || [];
  stored = stored.filter((photo) => photo.dataURL !== dataURL);
  localStorage.setItem("uploadedPhotos", JSON.stringify(stored));
}


//Allow right-click everywhere, except on images
document.addEventListener("contextmenu", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault(); // disable right-click only on images
  }
});

//The back to top
window.addEventListener("scroll", function () {
  const btn = document.getElementById("backToTop");
  btn.style.display = window.scrollY > 300 ? "block" : "none";
});

document.getElementById("backToTop").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
