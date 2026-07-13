const API_BASE_URL = "http://localhost:3000";

const loadButton = document.querySelector("#load-items");
const itemList = document.querySelector("#items");
const form = document.querySelector("#add-item-form");
const itemNameInput = document.querySelector("#item-name");
const itemQuantityInput = document.querySelector("#item-quantity");
const statusBox = document.querySelector("#status");

function setStatus(message) {
  statusBox.textContent = message;
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function createButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.className = className;
  button.addEventListener("click", onClick);
  return button;
}

function renderItems(items) {
  itemList.replaceChildren();

  if (items.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "No items found.";
    itemList.appendChild(emptyMessage);
    return;
  }

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "item-card";

    const itemSummary = document.createElement("span");
    itemSummary.className = "item-summary";
    itemSummary.textContent = `${item.id}: ${item.name} (${item.quantity})`;

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "item-actions";
    buttonGroup.append(
      createButton("View", "secondary", () => viewItem(item.id)),
      createButton("Replace", "secondary", () => replaceItem(item)),
      createButton("Update Quantity", "secondary", () => updateQuantity(item)),
      createButton("Delete", "danger", () => deleteItem(item))
    );

    li.append(itemSummary, buttonGroup);
    itemList.appendChild(li);
  }
}

async function loadItems() {
  setStatus("Loading items...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`);
    const data = await readJson(response);

    if (!response.ok) {
      throw new Error(data.message ?? `GET /api/items failed with status ${response.status}`);
    }

    renderItems(data.items);
    setStatus("Items loaded.");
  } catch (error) {
    setStatus(error.message);
  }
}

async function addItem(name, quantity) {
  setStatus("Adding item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity })
    });

    const data = await readJson(response);

    if (!response.ok) {
      throw new Error(data.message ?? `POST /api/items failed with status ${response.status}`);
    }

    setStatus(`Added item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function viewItem(id) {
  setStatus(`Loading item ${id}...`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`);
    const data = await readJson(response);

    if (!response.ok) {
      throw new Error(data.message ?? `GET /api/items/${id} failed with status ${response.status}`);
    }

    setStatus(`Item ${data.item.id}: ${data.item.name}, quantity ${data.item.quantity}.`);
  } catch (error) {
    setStatus(error.message);
  }
}

async function replaceItem(item) {
  const nameInput = window.prompt("Enter the replacement name:", item.name);

  if (nameInput === null) {
    return;
  }

  const quantityInput = window.prompt("Enter the replacement quantity:", String(item.quantity));

  if (quantityInput === null) {
    return;
  }

  const name = nameInput.trim();
  const quantity = Number(quantityInput);

  if (!name || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Replacement requires a name and a non-negative integer quantity.");
    return;
  }

  setStatus(`Replacing item ${item.id}...`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity })
    });

    const data = await readJson(response);

    if (!response.ok) {
      throw new Error(data.message ?? `PUT /api/items/${item.id} failed with status ${response.status}`);
    }

    setStatus(`Replaced item ${data.item.id}.`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function updateQuantity(item) {
  const quantityInput = window.prompt("Enter the new quantity:", String(item.quantity));

  if (quantityInput === null) {
    return;
  }

  const quantity = Number(quantityInput);

  if (!Number.isInteger(quantity) || quantity < 0) {
    setStatus("Quantity must be a non-negative integer.");
    return;
  }

  setStatus(`Updating item ${item.id}...`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ quantity })
    });

    const data = await readJson(response);

    if (!response.ok) {
      throw new Error(data.message ?? `PATCH /api/items/${item.id} failed with status ${response.status}`);
    }

    setStatus(`Updated quantity for ${data.item.name}.`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

async function deleteItem(item) {
  const confirmed = window.confirm(`Delete ${item.name}?`);

  if (!confirmed) {
    return;
  }

  setStatus(`Deleting item ${item.id}...`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${item.id}`, {
      method: "DELETE"
    });

    const data = await readJson(response);

    if (!response.ok) {
      throw new Error(data.message ?? `DELETE /api/items/${item.id} failed with status ${response.status}`);
    }

    setStatus(`Deleted item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

loadButton.addEventListener("click", loadItems);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const quantity = Number(itemQuantityInput.value);

  if (!name || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Enter a name and a non-negative integer quantity.");
    return;
  }

  await addItem(name, quantity);
  form.reset();
  itemQuantityInput.value = "0";
});

loadItems();
