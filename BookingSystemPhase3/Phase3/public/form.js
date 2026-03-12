// -------------- Helpers --------------
function $(id) {
  return document.getElementById(id);
}

// Timestamp
function timestamp() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').replace('Z', '');
}

// -------------- Form wiring --------------
document.addEventListener("DOMContentLoaded", () => {
  const form = $("resourceForm");
  if (form) {
    form.addEventListener("submit", onSubmit);
  }
});

async function onSubmit(event) {
  event.preventDefault();
  const submitter = event.submitter;
  const actionValue = submitter && submitter.value ? submitter.value : "create";
  const selectedUnit = document.querySelector('input[name="resourcePriceUnit"]:checked')?.value ?? "";
  const priceRaw = $("resourcePrice")?.value ?? "";
  const resourcePrice = priceRaw === "" ? 0 : Number(priceRaw);

  const payload = {
    action: actionValue,
    // BUG FIX 3: Changed "resourceNamee" to "resourceName" to match the actual ID
    resourceName: $("resourceName")?.value ?? "",
    resourceDescription: $("resourceDescription")?.value ?? "",
    resourceAvailable: $("resourceAvailable")?.checked ?? false,
    resourcePrice,
    resourcePriceUnit: selectedUnit
  };

  try {
    console.log("--------------------------");
    console.log("The request send to the server " + `[${timestamp()}]`);
    console.log("--------------------------");
    
    const response = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status} ${response.statusText}\n${text}`);
    }

    const data = await response.json();
    
    // BUG FIX 4: Added Price to the alert message to match reference screenshot
    let msg = "Server response " + `[${timestamp()}]\n`;
    msg += "--------------------------\n";
    msg += "Status ➡️ " + response.status + "\n";
    msg += "Action ➡️ " + data.echo.action + "\n";
    msg += "Name ➡️ "+ data.echo.resourceName + "\n";
    msg += "Description ➡️ " + data.echo.resourceDescription + "\n";
    msg += "Availability ➡️ " + data.echo.resourceAvailable + "\n";
    msg += "Price ➡️ " + data.echo.resourcePrice + "\n";
    msg += "Price unit ➡️ " + data.echo.resourcePriceUnit + "\n";

    console.log("Server response " + `[${timestamp()}]`);
    console.log("--------------------------");
    console.log("Status ➡️ ", response.status);
    console.log("Action ➡️ ", data.echo.action);
    console.log("Name ➡️ ", data.echo.resourceName);
    console.log("Price ➡️ ", data.echo.resourcePrice);
    console.log("--------------------------");
    
    alert(msg);

  } catch (err) {
    console.error("POST error:", err);
  }
}