const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector("#project-name").value.trim();
  const description = document.querySelector("#project-desc").value.trim();
  const difficulty = document.querySelector("#difficulty").value;
  const materials = document.querySelector("#materials").value.trim();
  const budget = document.querySelector("#budget").value.trim();
  if (name && description && difficulty && materials && budget) {
    const response = await fetch(`/api/projects`, {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        difficulty,
        material_checklist: materials,
        budget_estimation: budget,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.replace("/profile");
    } else {
      alert("Failed to create project");
    }
  }
};

let imageBtn = document.getElementById('imageBtn');
if (imageBtn) {
    imageBtn.addEventListener('click', function() {
        let form = document.getElementById('imageUploadForm');
        form.classList.toggle('hidden');
    });
};

const fileInput = document.getElementById('file-input');
const imageName = document.getElementById('imgname');

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const imageName = document.getElementById('imgname');
  const uploadButton = document.getElementById('imageBtn');

  uploadButton.addEventListener('click', () => {
    const file = fileInput.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('imgname', imageName); 

      fetch('/upload', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.text())
        .then(data => {
          console.log(data); 
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      console.error('No file selected.');
    }
  });
});

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute("data-id")) {
    const id = event.target.getAttribute("data-id");

    const response = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      document.location.replace("/profile");
    } else {
      alert("Failed to delete project");
    }
  }
};

document
  .querySelector(".new-project-form")
  .addEventListener("submit", newFormHandler);

document
  .querySelector(".project-list")
  .addEventListener("click", delButtonHandler);
