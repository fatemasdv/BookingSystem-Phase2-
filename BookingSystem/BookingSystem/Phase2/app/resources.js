// ===============================
// 1) DOM references
// ===============================
const actions = document.getElementById("resourceActions");
const resourceNameContainer = document.getElementById("resourceNameContainer");

const role = "admin"; // "reserver" | "admin"
let createButton = null;

// ===============================
// 2) Button creation helpers (Original Styles)
// ===============================
const BUTTON_BASE_CLASSES = "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";
const BUTTON_ENABLED_CLASSES = "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

function addButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  btn.name = "action";
  if (value) btn.value = value;
  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`.trim();
  actions.appendChild(btn);
  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;
  btn.disabled = !enabled;
  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);
}

function renderActionButtons(currentRole) {
  if (currentRole === "reserver" || currentRole === "admin") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  if (currentRole === "admin") {
    addButton({ label: "Update", value: "update", classes: BUTTON_ENABLED_CLASSES });
    addButton({ label: "Delete", value: "delete", classes: BUTTON_ENABLED_CLASSES });
  }

  setButtonEnabled(createButton, false);
}

// ===============================
// 3) Validation Logic
// ===============================
function setInputVisualState(input, isValid) {
  input.classList.remove("border-green-500", "bg-green-100", "border-red-500", "bg-red-100", "border-black/10");
  
  if (input.value.trim() === "") {
    input.classList.add("border-black/10");
  } else if (isValid) {
    input.classList.add("border-green-500", "bg-green-100");
  } else {
    input.classList.add("border-red-500", "bg-red-100");
  }
}

function validateAll() {
  const nameInput = document.getElementById("resourceName");
  const descInput = document.getElementById("resourceDescription");

  const nameVal = nameInput.value.trim();
  const isNameValid = /^[a-zA-Z0-9äöåÄÖÅ ]+$/.test(nameVal) && nameVal.length >= 5 && nameVal.length <= 30;

  const descVal = descInput.value.trim();
  const isDescValid = /^[a-zA-Z0-9äöåÄÖÅ\s.,!?]+$/.test(descVal) && descVal.length >= 10 && descVal.length <= 50;

  setInputVisualState(nameInput, isNameValid);
  setInputVisualState(descInput, isDescValid);

  setButtonEnabled(createButton, isNameValid && isDescValid);
}

// Initialization
renderActionButtons(role);

const nameInput = document.createElement("input");
nameInput.id = "resourceName";
nameInput.placeholder = "e.g., Meeting Room A";
nameInput.className = "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all duration-200 ease-out";
resourceNameContainer.appendChild(nameInput);

nameInput.addEventListener("input", validateAll);
document.getElementById("resourceDescription").addEventListener("input", validateAll);