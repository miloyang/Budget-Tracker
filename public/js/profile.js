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
