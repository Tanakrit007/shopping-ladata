/**
 * ประกาศตัวแปร cart เป็น Object ว่างใช้เก็บข้อมูลสินค้าในรถเข็นเริ่มต้น
 */
const cart = {};

/**
 * ใช้ querySelectorAll เลือกทุก element ที่มี class 'add-to-cart' 
 * และใช้ forEach loop เพื่อเพิ่ม event ที่จะทำงานเมื่อกดปุ่ม Add to Cart
 */
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.getAttribute("data-product-id");
    const price = parseFloat(button.getAttribute("data-price"));

    // ค้นหา select ที่เกี่ยวข้องกับสินค้านี้
    const productContainer = button.closest(".product");
    const paperTypeSelect = productContainer.querySelector(".paper-type");
    const paperColorSelect = productContainer.querySelector(".paper-color");

    let details = "ธรรมดา";
    if (paperTypeSelect) {
      details = paperTypeSelect.value;
    } else if (paperColorSelect) {
      details = paperColorSelect.value;
    }

    const cartKey = `${productId} (${details})`; // ให้รวมประเภท/สีเข้าไปใน cartKey

    if (!cart[cartKey]) {
      cart[cartKey] = { quantity: 1, price: price, details: details };
    } else {
      cart[cartKey].quantity++;
    }

    updateCartDisplay();
  });
});

/**
 * ฟังก์ชันแสดงรายการสินค้าในตะกร้า
 */
function updateCartDisplay() {
  const cartElement = document.getElementById("cart");
  cartElement.innerHTML = "";

  let totalPrice = 0;
  const table = document.createElement("table");
  table.classList.add("table", "table-striped");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Product", "Quantity", "Price", "Total", "Actions"];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const cartKey in cart) {
    const item = cart[cartKey];
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;

    const tr = document.createElement("tr");
    const productNameCell = document.createElement("td");
    productNameCell.textContent = cartKey;
    tr.appendChild(productNameCell);

    const quantityCell = document.createElement("td");
    quantityCell.textContent = item.quantity;
    tr.appendChild(quantityCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = `฿${item.price}`;
    tr.appendChild(priceCell);

    const totalCell = document.createElement("td");
    totalCell.textContent = `฿${itemTotalPrice}`;
    tr.appendChild(totalCell);

    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.classList.add("btn", "btn-danger", "delete-product");
    deleteButton.setAttribute("data-product-id", cartKey);
    deleteButton.addEventListener("click", () => {
      delete cart[cartKey];
      updateCartDisplay();
    });
    actionsCell.appendChild(deleteButton);
    tr.appendChild(actionsCell);

    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  cartElement.appendChild(table);

  if (Object.keys(cart).length === 0) {
    cartElement.innerHTML = "<p>No items in cart.</p>";
  } else {
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Total Price: ฿${totalPrice}`;
    cartElement.appendChild(totalPriceElement);
  }
}

/**
 * ฟังก์ชันสร้างใบเสร็จสินค้า
 */
/**
 * ฟังก์ชันสร้างใบเสร็จสินค้า
 */
function generateCartReceipt() {
  let receiptContent = `
    <div style="text-align: center; font-family: Arial, sans-serif; width: 80mm; margin: auto;">
      <h2>Cart Receipt</h2>
      <hr>
  `;

  let totalPrice = 0;
  for (const cartKey in cart) {
    const item = cart[cartKey];
    const itemTotalPrice = item.quantity * item.price;
    totalPrice += itemTotalPrice;
    receiptContent += `
      <p>${cartKey}<br> ${item.quantity} x ฿${item.price} = ฿${itemTotalPrice}</p>
    `;
  }

  receiptContent += `
      <hr>
      <h3>Total: ฿${totalPrice}</h3>
      <p>พบปัญหาติดต่อ 0888-888-888</p>
      <img src="./product_img/myqrcode.jpg" alt="QR Code" style="width: 300px; height: 300px; margin-top: 50px;">
      <p>QRCODE สำหรับการสั่งซื้อของ</p>
    </div>
    <script>
      window.onload = function() {
        window.print();
        setTimeout(() => window.close(), 500);
      };
    </script>
  `;

  // เปิดหน้าต่างใหม่แบบเต็มจอ
  const receiptWindow = window.open("", "_blank", `width=${screen.width},height=${screen.height}`);
  receiptWindow.document.write(`
    <html>
    <head>
      <title>Receipt</title>
      <style>
        body { text-align: center; font-family: Arial, sans-serif; }
        h2, h3, p { margin: 5px 0; }
      </style>
    </head>
    <body>
      ${receiptContent}
    </body>
    </html>
  `);
  receiptWindow.document.close();
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("printCart").addEventListener("click", generateCartReceipt);
});

