function $(id) {
  return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = $("resourceForm");
  if (form) form.addEventListener("submit", onSubmit);
});

async function onSubmit(event) {
  event.preventDefault();
  const submitter = event.submitter;
  const actionValue = submitter && submitter.value ? submitter.value : "create";

  // Requirement 3: Clean/Trimmed values
  const payload = {
    action: actionValue,
    resourceName: ($("resourceName")?.value ?? "").trim(),
    resourceDescription: ($("resourceDescription")?.value ?? "").trim(),
    resourceAvailable: $("resourceAvailable")?.checked ?? false,
    resourcePrice: $("resourcePrice")?.value ?? "0",
    resourcePriceUnit: document.querySelector('input[name="resourcePriceUnit"]:checked')?.value ?? "hour"
  };

  try {
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Server Error");
    const data = await response.json();
    console.log("Success:", data.json);
  } catch (err) {
    console.error("POST error:", err);
  }
}