const actions = document.getElementById("resourceActions");
const resourceNameCnt = document.getElementById("resourceNameCnt");
const resourceDescriptionCnt = document.getElementById("resourceDescriptionCnt");
const role = "admin"; // Change this to "reserver" to test different views

let createButton = null;
let updateButton = null;
let deleteButton = null;

let resourceNameValid = false;
let resourceDescriptionValid = false;

const BUTTON_BASE_CLASSES = "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";
const BUTTON_ENABLED_CLASSES = "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";
const BUTTON_DISABLED_CLASSES = "cursor-not-allowed opacity-50";

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
  if (!enabled) {
    btn.classList.remove("hover:bg-brand-dark/80");
  } else {
    btn.classList.add("hover:bg-brand-dark/80");
  }
}

function renderActionButtons(currentRole) {
  if (currentRole === "reserver") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create", // BUG FIX 5: Added missing value for reserver
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  if (currentRole === "admin") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES,
    });

    // BUG FIX 6: Correctly assigned global variables for admin buttons
    updateButton = addButton({
      label: "Update",
      value: "update",
      classes: BUTTON_ENABLED_CLASSES,
    });

    deleteButton = addButton({
      label: "Delete",
      value: "delete",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  setButtonEnabled(createButton, false);
  setButtonEnabled(updateButton, false);
  setButtonEnabled(deleteButton, false);
}

function createResourceNameInput(container) {
  const input = document.createElement("input");
  input.id = "resourceName";
  input.name = "resourceName";
  input.type = "text";
  input.placeholder = "e.g., Meeting Room A";
  input.className = `mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all duration-200 ease-out`;
  container.appendChild(input);
  return input;
}

function isResourceNameValid(value) {
  const trimmed = value.trim();
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;
  return trimmed.length >= 5 && trimmed.length <= 30 && allowedPattern.test(trimmed);
}

function createResourceDescriptionArea(container) {
  const textarea = document.createElement("textarea");
  textarea.id = "resourceDescription";
  textarea.name = "resourceDescription";
  textarea.rows = 5;
  textarea.placeholder = "Describe location, capacity, equipment...";
  textarea.className = `mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all duration-200 ease-out`;
  container.appendChild(textarea);
  return textarea;
}

function isResourceDescriptionValid(value) {
  const trimmed = value.trim();
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ><!\?\-\+\/\\]+$/;
  return trimmed.length >= 10 && trimmed.length <= 50 && allowedPattern.test(trimmed);
}

function setInputVisualState(input, state) {
  input.classList.remove("border-green-500", "bg-green-100", "border-red-500", "bg-red-100");
  if (state === "valid") {
    input.classList.add("border-green-500", "bg-green-100");
  } else if (state === "invalid") {
    input.classList.add("border-red-500", "bg-red-100");
  }
}

function attachResourceNameValidation(input) {
  input.addEventListener("input", () => {
    resourceNameValid = isResourceNameValid(input.value);
    setInputVisualState(input, input.value.trim() === "" ? "neutral" : (resourceNameValid ? "valid" : "invalid"));
    setButtonEnabled(createButton, resourceNameValid && resourceDescriptionValid);
    setButtonEnabled(updateButton, resourceNameValid && resourceDescriptionValid);
    setButtonEnabled(deleteButton, resourceNameValid && resourceDescriptionValid);
  });
}

function attachResourceDescriptionValidation(input) {
  input.addEventListener("input", () => {
    resourceDescriptionValid = isResourceDescriptionValid(input.value);
    setInputVisualState(input, input.value.trim() === "" ? "neutral" : (resourceDescriptionValid ? "valid" : "invalid"));
    setButtonEnabled(createButton, resourceNameValid && resourceDescriptionValid);
    setButtonEnabled(updateButton, resourceNameValid && resourceDescriptionValid);
    setButtonEnabled(deleteButton, resourceNameValid && resourceDescriptionValid);
  });
}

// Bootstrap
renderActionButtons(role);
const nameInp = createResourceNameInput(resourceNameCnt);
attachResourceNameValidation(nameInp);
const descInp = createResourceDescriptionArea(resourceDescriptionCnt);
attachResourceDescriptionValidation(descInp);