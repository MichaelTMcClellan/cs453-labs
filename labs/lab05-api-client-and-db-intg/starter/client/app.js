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

function renderItems(items) {
  itemList.replaceChildren();

  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = `${item.id}: ${item.name} (${item.quantity})`;
    itemList.appendChild(li);
  }
}

async function loadItems() {
  setStatus("Loading items...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`);

    if (!response.ok) {
      throw new Error(`GET /api/items failed with status ${response.status}`);
    }

    const data = await response.json();
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `POST /api/items failed with status ${response.status}`);
    }

    setStatus(`Added item: ${data.item.name}`);
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

  itemNameInput.value = "";
  itemQuantityInput.value = "0";
  await addItem(name, quantity);
});
