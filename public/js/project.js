document.addEventListener('DOMContentLoaded', function() {

    let addExpenseBtn = document.getElementById('addExpense');
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', addExpense);
    }

    let addMaterialBtn = document.getElementById('addMaterial');
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', addMaterial);
    }

    document.querySelectorAll('.lockButton').forEach(button => {
        button.addEventListener('click', function() {
            toggleLock(this.dataset.section, this);
        });
    });

    let progressBar = document.getElementById('progressBar');
    if (progressBar) {
        updateProgress();
    }

    let imageBtn = document.getElementById('imageBtn');
    if (imageBtn) {
        imageBtn.addEventListener('click', function() {
            let form = document.getElementById('imageUploadForm');
            form.classList.toggle('hidden');
        });
    }
});

let totalExpenses = 0;
const budgetLimit = 1000; // Preset budget limit
let isBudgetEstimationLocked = true; // Initially locked
let isMaterialsChecklistLocked = true; // Initially locked

function addExpense() {
    if (isBudgetEstimationLocked) {
        console.error('Budget Estimation is locked. Cannot add expenses.');
        return;
    }

    const expenseValue = parseFloat(document.getElementById('spentAmount').value) || 0;
    if (expenseValue <= 0) {
        return;
    }

    totalExpenses += expenseValue;
    const expenseList = document.getElementById('expenseList');
    const newExpense = document.createElement('li');
    newExpense.textContent = `$${expenseValue.toFixed(2)}`;
    expenseList.appendChild(newExpense);

    updateProgress();
    document.getElementById('spentAmount').value = '';
}

function updateProgress() {
    let progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = Math.min(100, (totalExpenses / budgetLimit) * 100);
        progressBar.style.width = progress + '%';
        // Change color based on progress
        if (progress < 50) {
            progressBar.style.backgroundColor = 'green';
        } else if (progress >= 50 && progress < 75) {
            progressBar.style.backgroundColor = 'orange';
        } else {
            progressBar.style.backgroundColor = 'red';
        }
    }
}

function addMaterial() {
    if (isMaterialsChecklistLocked) {
        console.error('Materials Checklist is locked. Cannot add items.');
        return;
    }

    const materialValue = document.getElementById('materialItem').value.trim();
    if (materialValue === '') {
        return; // can't add empty items
    }

    const materialList = document.getElementById('materialList');
    const newMaterial = document.createElement('li');
    newMaterial.textContent = materialValue;
    materialList.appendChild(newMaterial);

    document.getElementById('materialItem').value = ''; // Reset input
}

function toggleLock(sectionId, button) {
    const section = document.getElementById(sectionId);
    console.log(sectionId)
    if (!section) {
        console.error(`Element with ID '${sectionId}' not found.`);
        return;
    } else if (sectionId === 'projectDiff') {
        const isDisabled = section.disabled;
        section.disabled = !isDisabled;
        button.innerHTML = isDisabled ? '<i class="fas fa-unlock"></i>' : '<i class="fas fa-lock"></i>';
    }

    const isLocked = section.getAttribute('contenteditable') === 'true';
    section.setAttribute('contenteditable', !isLocked);

    // Update lock button icon
    button.innerHTML = isLocked ? '<i class="fas fa-lock text-yellow-200"></i>' : '<i class="fas fa-unlock text-yellow-200"></i>';

    if (sectionId === 'budgetEst') {
        isBudgetEstimationLocked = isLocked;
        document.getElementById('spentAmount').readOnly = isLocked;
        document.getElementById('addExpense').disabled = isLocked;
    }

    if (sectionId === 'materialsChecklist') {
        isMaterialsChecklistLocked = isLocked;
        document.getElementById('materialItem').readOnly = isLocked;
        document.getElementById('addMaterial').disabled = isLocked;
    }
}

document.getElementById('imageUploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const submitButton = this.querySelector('[type="submit"]');
    submitButton.value = 'Uploading...';
    submitButton.disabled = true;

    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.imagePath) {
            const uploadedImage = document.getElementById('uploadedImage');
            uploadedImage.src = data.imagePath;
            uploadedImage.classList.remove('hidden');

            // Hide only the upload controls
            uploadControls.classList.add('hidden');
        } else {
            console.error('Upload failed');
            submitButton.value = 'Upload';
            submitButton.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        submitButton.value = 'Upload';
        submitButton.disabled = false;
    });
});

