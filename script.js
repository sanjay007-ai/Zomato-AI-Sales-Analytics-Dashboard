// Premium Zomato AI Dashboard

let orders = [];
let filteredOrders = [];
let cityChart, monthlyChart, foodChart, statusChart, restaurantChart, ordersChart, paymentChart;

const cityFilter = document.getElementById("cityFilter");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const paymentFilter = document.getElementById("paymentFilter");
const amountSlider = document.getElementById("amountSlider");
const amountValue = document.getElementById("amountValue");
const quantitySlider = document.getElementById("quantitySlider");
const quantityValue = document.getElementById("quantityValue");
const dateStart = document.getElementById("dateStart");
const dateEnd = document.getElementById("dateEnd");
const resetBtn = document.getElementById("resetBtn");
const themeToggle = document.getElementById("themeToggle");
const liveClock = document.getElementById("liveClock");
const searchBox = document.getElementById("searchBox");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const ordersTableBody = document.getElementById("ordersTableBody");

window.addEventListener("DOMContentLoaded", () => {
    initTheme();
    startClock();
    initializeDashboard();
});

async function initializeDashboard() {
    await loadOrdersCSV();
    applyFilters();
    addEventListeners();
}

async function loadOrdersCSV() {
    try {
        const response = await fetch("orders.csv", { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`CSV fetch failed: ${response.status}`);
        }
        const text = await response.text();
        await parseCsvText(text);
    } catch (error) {
        console.warn("CSV load failed, using built-in sample data:", error);
        parseOrders(buildFallbackOrders());
    }
}

function parseCsvText(text) {
    return new Promise((resolve, reject) => {
        try {
            const lines = text.trim().split(/\r?\n/).filter(Boolean);
            if (!lines.length) {
                throw new Error("CSV is empty");
            }
            const headers = lines[0].split(",").map(header => header.trim());
            const rows = lines.slice(1).map(line => {
                const values = line.split(",").map(value => value.trim());
                return headers.reduce((acc, header, index) => {
                    acc[header] = values[index] || "";
                    return acc;
                }, {});
            });
            parseOrders(rows);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function buildFallbackOrders() {
    return [
        { Order_ID: "ORD0001", Order_Date: "2025-08-21", Customer_ID: "CUST152", Restaurant_ID: "R053", City: "Jaipur", Food_Category: "Biryani", Quantity: 4, Order_Amount: 1760, Delivery_Partner_ID: "DP069", Delivery_Time_Min: 35, Payment_ID: "PAY0001", Rating_ID: "RAT0001", Offer_ID: "OFF006", Order_Status: "Delivered" },
        { Order_ID: "ORD0002", Order_Date: "2025-01-29", Customer_ID: "CUST302", Restaurant_ID: "R065", City: "Ahmedabad", Food_Category: "South Indian", Quantity: 1, Order_Amount: 710, Delivery_Partner_ID: "DP078", Delivery_Time_Min: 33, Payment_ID: "PAY0002", Rating_ID: "RAT0002", Offer_ID: "OFF007", Order_Status: "Delivered" },
        { Order_ID: "ORD0003", Order_Date: "2024-05-09", Customer_ID: "CUST019", Restaurant_ID: "R075", City: "Ahmedabad", Food_Category: "North Indian", Quantity: 2, Order_Amount: 1000, Delivery_Partner_ID: "DP065", Delivery_Time_Min: 34, Payment_ID: "PAY0003", Rating_ID: "RAT0003", Offer_ID: "OFF003", Order_Status: "Delivered" },
        { Order_ID: "ORD0004", Order_Date: "2024-01-07", Customer_ID: "CUST058", Restaurant_ID: "R066", City: "Bengaluru", Food_Category: "Chinese", Quantity: 1, Order_Amount: 1310, Delivery_Partner_ID: "DP037", Delivery_Time_Min: 34, Payment_ID: "PAY0004", Rating_ID: "RAT0004", Offer_ID: "OFF017", Order_Status: "Delivered" },
        { Order_ID: "ORD0005", Order_Date: "2024-06-17", Customer_ID: "CUST135", Restaurant_ID: "R031", City: "Jaipur", Food_Category: "Beverages", Quantity: 1, Order_Amount: 860, Delivery_Partner_ID: "DP067", Delivery_Time_Min: 48, Payment_ID: "PAY0005", Rating_ID: "RAT0005", Offer_ID: "OFF002", Order_Status: "Pending" },
        { Order_ID: "ORD0006", Order_Date: "2025-04-28", Customer_ID: "CUST441", Restaurant_ID: "R031", City: "Kolkata", Food_Category: "Desserts", Quantity: 3, Order_Amount: 1120, Delivery_Partner_ID: "DP037", Delivery_Time_Min: 54, Payment_ID: "PAY0006", Rating_ID: "RAT0006", Offer_ID: "OFF002", Order_Status: "Delivered" },
        { Order_ID: "ORD0007", Order_Date: "2025-08-03", Customer_ID: "CUST089", Restaurant_ID: "R070", City: "Kolkata", Food_Category: "Biryani", Quantity: 4, Order_Amount: 1770, Delivery_Partner_ID: "DP038", Delivery_Time_Min: 28, Payment_ID: "PAY0007", Rating_ID: "RAT0007", Offer_ID: "OFF005", Order_Status: "Delivered" },
        { Order_ID: "ORD0008", Order_Date: "2024-05-06", Customer_ID: "CUST415", Restaurant_ID: "R053", City: "Mumbai", Food_Category: "South Indian", Quantity: 3, Order_Amount: 530, Delivery_Partner_ID: "DP017", Delivery_Time_Min: 25, Payment_ID: "PAY0008", Rating_ID: "RAT0008", Offer_ID: "OFF005", Order_Status: "Delivered" },
        { Order_ID: "ORD0009", Order_Date: "2024-03-02", Customer_ID: "CUST068", Restaurant_ID: "R090", City: "Kolkata", Food_Category: "Chinese", Quantity: 4, Order_Amount: 1640, Delivery_Partner_ID: "DP098", Delivery_Time_Min: 49, Payment_ID: "PAY0009", Rating_ID: "RAT0009", Offer_ID: "OFF003", Order_Status: "Delivered" },
        { Order_ID: "ORD0010", Order_Date: "2024-12-18", Customer_ID: "CUST210", Restaurant_ID: "R018", City: "Mumbai", Food_Category: "Biryani", Quantity: 1, Order_Amount: 1410, Delivery_Partner_ID: "DP013", Delivery_Time_Min: 23, Payment_ID: "PAY0010", Rating_ID: "RAT0010", Offer_ID: "OFF001", Order_Status: "Delivered" },
        { Order_ID: "ORD0011", Order_Date: "2025-03-23", Customer_ID: "CUST131", Restaurant_ID: "R092", City: "Jaipur", Food_Category: "Burger", Quantity: 5, Order_Amount: 1910, Delivery_Partner_ID: "DP044", Delivery_Time_Min: 43, Payment_ID: "PAY0011", Rating_ID: "RAT0011", Offer_ID: "OFF018", Order_Status: "Delivered" },
        { Order_ID: "ORD0012", Order_Date: "2024-09-16", Customer_ID: "CUST127", Restaurant_ID: "R078", City: "Hyderabad", Food_Category: "Pizza", Quantity: 1, Order_Amount: 1580, Delivery_Partner_ID: "DP084", Delivery_Time_Min: 15, Payment_ID: "PAY0012", Rating_ID: "RAT0012", Offer_ID: "OFF016", Order_Status: "Delivered" },
        { Order_ID: "ORD0013", Order_Date: "2024-12-06", Customer_ID: "CUST177", Restaurant_ID: "R003", City: "Bengaluru", Food_Category: "North Indian", Quantity: 5, Order_Amount: 1410, Delivery_Partner_ID: "DP003", Delivery_Time_Min: 45, Payment_ID: "PAY0013", Rating_ID: "RAT0013", Offer_ID: "OFF014", Order_Status: "Delivered" },
        { Order_ID: "ORD0014", Order_Date: "2024-07-25", Customer_ID: "CUST080", Restaurant_ID: "R096", City: "Bengaluru", Food_Category: "Beverages", Quantity: 1, Order_Amount: 650, Delivery_Partner_ID: "DP035", Delivery_Time_Min: 60, Payment_ID: "PAY0014", Rating_ID: "RAT0014", Offer_ID: "OFF014", Order_Status: "Delivered" },
        { Order_ID: "ORD0015", Order_Date: "2025-06-12", Customer_ID: "CUST418", Restaurant_ID: "R022", City: "Hyderabad", Food_Category: "Burger", Quantity: 5, Order_Amount: 1860, Delivery_Partner_ID: "DP079", Delivery_Time_Min: 41, Payment_ID: "PAY0015", Rating_ID: "RAT0015", Offer_ID: "OFF014", Order_Status: "Delivered" },
        { Order_ID: "ORD0016", Order_Date: "2025-06-20", Customer_ID: "CUST178", Restaurant_ID: "R062", City: "Mumbai", Food_Category: "Healthy Food", Quantity: 3, Order_Amount: 830, Delivery_Partner_ID: "DP083", Delivery_Time_Min: 19, Payment_ID: "PAY0016", Rating_ID: "RAT0016", Offer_ID: "OFF013", Order_Status: "Pending" },
        { Order_ID: "ORD0017", Order_Date: "2024-02-13", Customer_ID: "CUST305", Restaurant_ID: "R023", City: "Chennai", Food_Category: "Pizza", Quantity: 3, Order_Amount: 150, Delivery_Partner_ID: "DP091", Delivery_Time_Min: 36, Payment_ID: "PAY0017", Rating_ID: "RAT0017", Offer_ID: "OFF017", Order_Status: "Delivered" },
        { Order_ID: "ORD0018", Order_Date: "2024-10-23", Customer_ID: "CUST313", Restaurant_ID: "R032", City: "Kolkata", Food_Category: "Biryani", Quantity: 5, Order_Amount: 1970, Delivery_Partner_ID: "DP010", Delivery_Time_Min: 19, Payment_ID: "PAY0018", Rating_ID: "RAT0018", Offer_ID: "OFF004", Order_Status: "Delivered" },
        { Order_ID: "ORD0019", Order_Date: "2025-04-06", Customer_ID: "CUST441", Restaurant_ID: "R071", City: "Chennai", Food_Category: "Rolls", Quantity: 5, Order_Amount: 1850, Delivery_Partner_ID: "DP056", Delivery_Time_Min: 33, Payment_ID: "PAY0019", Rating_ID: "RAT0019", Offer_ID: "OFF006", Order_Status: "Delivered" },
        { Order_ID: "ORD0020", Order_Date: "2025-07-02", Customer_ID: "CUST231", Restaurant_ID: "R013", City: "Mumbai", Food_Category: "Chinese", Quantity: 1, Order_Amount: 1740, Delivery_Partner_ID: "DP002", Delivery_Time_Min: 18, Payment_ID: "PAY0020", Rating_ID: "RAT0020", Offer_ID: "OFF010", Order_Status: "Delivered" },
        { Order_ID: "ORD0021", Order_Date: "2024-06-07", Customer_ID: "CUST488", Restaurant_ID: "R100", City: "Kolkata", Food_Category: "South Indian", Quantity: 1, Order_Amount: 760, Delivery_Partner_ID: "DP053", Delivery_Time_Min: 20, Payment_ID: "PAY0021", Rating_ID: "RAT0021", Offer_ID: "OFF002", Order_Status: "Pending" },
        { Order_ID: "ORD0022", Order_Date: "2024-10-02", Customer_ID: "CUST298", Restaurant_ID: "R053", City: "Delhi", Food_Category: "Beverages", Quantity: 5, Order_Amount: 1310, Delivery_Partner_ID: "DP042", Delivery_Time_Min: 52, Payment_ID: "PAY0022", Rating_ID: "RAT0022", Offer_ID: "OFF017", Order_Status: "Delivered" },
        { Order_ID: "ORD0023", Order_Date: "2024-09-25", Customer_ID: "CUST271", Restaurant_ID: "R087", City: "Kolkata", Food_Category: "Biryani", Quantity: 2, Order_Amount: 1230, Delivery_Partner_ID: "DP055", Delivery_Time_Min: 30, Payment_ID: "PAY0023", Rating_ID: "RAT0023", Offer_ID: "OFF001", Order_Status: "Delivered" },
        { Order_ID: "ORD0024", Order_Date: "2025-11-04", Customer_ID: "CUST210", Restaurant_ID: "R015", City: "Kochi", Food_Category: "Pizza", Quantity: 4, Order_Amount: 410, Delivery_Partner_ID: "DP038", Delivery_Time_Min: 22, Payment_ID: "PAY0024", Rating_ID: "RAT0024", Offer_ID: "OFF017", Order_Status: "Delivered" },
        { Order_ID: "ORD0025", Order_Date: "2024-04-23", Customer_ID: "CUST240", Restaurant_ID: "R014", City: "Kolkata", Food_Category: "Rolls", Quantity: 2, Order_Amount: 1050, Delivery_Partner_ID: "DP096", Delivery_Time_Min: 50, Payment_ID: "PAY0025", Rating_ID: "RAT0025", Offer_ID: "OFF018", Order_Status: "Delivered" }
    ];
}

function parseOrders(data) {
    orders = Array.isArray(data)
        ? data.filter(row => row && row.Order_ID)
        : [];
    filteredOrders = [...orders];
    populateFilters();
    initializeAmountSlider();
    initializeQuantitySlider();
    initializeDateRange();
    updateDashboard();
}

function initializeAmountSlider() {
    if (!amountSlider || !amountValue || !orders.length) return;
    const amounts = orders.map(row => Number(row.Order_Amount || 0)).filter(n => !Number.isNaN(n));
    const maxAmount = amounts.length ? Math.max(...amounts) : 1000;
    amountSlider.min = 0;
    amountSlider.max = Math.ceil(maxAmount / 10) * 10;
    amountSlider.value = amountSlider.max;
    amountSlider.step = 10;
    amountValue.textContent = `₹${formatNumber(amountSlider.value)}`;
}

function initializeQuantitySlider() {
    if (!quantitySlider || !quantityValue || !orders.length) return;
    const quantities = orders.map(row => Number(row.Quantity || 0)).filter(n => !Number.isNaN(n));
    const maxQty = quantities.length ? Math.max(...quantities) : 10;
    quantitySlider.min = 1;
    quantitySlider.max = Math.max(10, Math.ceil(maxQty));
    quantitySlider.value = quantitySlider.max;
    quantitySlider.step = 1;
    quantityValue.textContent = quantitySlider.value;
}

function initializeDateRange() {
    if (!dateStart || !dateEnd || !orders.length) return;
    const parsedDates = orders
        .map(row => new Date(row.Order_Date))
        .filter(d => !Number.isNaN(d.getTime()));
    if (!parsedDates.length) return;
    const firstDate = new Date(Math.min(...parsedDates));
    const lastDate = new Date(Math.max(...parsedDates));
    dateStart.value = firstDate.toISOString().slice(0, 10);
    dateEnd.value = lastDate.toISOString().slice(0, 10);
    dateStart.min = firstDate.toISOString().slice(0, 10);
    dateStart.max = lastDate.toISOString().slice(0, 10);
    dateEnd.min = firstDate.toISOString().slice(0, 10);
    dateEnd.max = lastDate.toISOString().slice(0, 10);
}

function addEventListeners() {
    cityFilter.addEventListener("change", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
    paymentFilter.addEventListener("change", applyFilters);
    amountSlider.addEventListener("input", handleAmountChange);
    quantitySlider.addEventListener("input", handleQuantityChange);
    dateStart.addEventListener("change", applyFilters);
    dateEnd.addEventListener("change", applyFilters);
    resetBtn.addEventListener("click", resetFilters);
    themeToggle.addEventListener("click", toggleTheme);
    searchBox.addEventListener("input", applyFilters);
    exportCsvBtn.addEventListener("click", exportCSV);
    exportPdfBtn.addEventListener("click", exportPDF);
}

function handleAmountChange() {
    if (!amountValue || !amountSlider) return;
    amountValue.textContent = `₹${formatNumber(amountSlider.value)}`;
    applyFilters();
}

function handleQuantityChange() {
    if (!quantityValue || !quantitySlider) return;
    quantityValue.textContent = quantitySlider.value;
    applyFilters();
}

function applyFilters() {
    const maxAmount = amountSlider ? Number(amountSlider.value) : Infinity;
    const maxQty = quantitySlider ? Number(quantitySlider.value) : Infinity;
    const startDateValue = dateStart ? dateStart.value : "";
    const endDateValue = dateEnd ? dateEnd.value : "";
    const startDate = startDateValue ? new Date(startDateValue) : null;
    const endDate = endDateValue ? new Date(endDateValue) : null;
    const searchTerm = searchBox ? searchBox.value.trim().toLowerCase() : "";

    filteredOrders = orders.filter(row => {
        const cityOK = !cityFilter.value || row.City === cityFilter.value;
        const categoryOK = !categoryFilter.value || row.Food_Category === categoryFilter.value;
        const statusOK = !statusFilter.value || row.Order_Status === statusFilter.value;
        const paymentOK = !paymentFilter.value || row.Payment_ID === paymentFilter.value;
        const amountOK = !amountSlider || Number(row.Order_Amount || 0) <= maxAmount;
        const qtyOK = !quantitySlider || Number(row.Quantity || 0) <= maxQty;
        const searchOK = !searchTerm || [row.Order_ID, row.City, row.Food_Category, row.Order_Status, row.Payment_ID, row.Customer_ID, row.Restaurant_ID]
            .some(value => String(value || "").toLowerCase().includes(searchTerm));
        let dateOK = true;
        if (row.Order_Date && (startDate || endDate)) {
            const orderDate = new Date(row.Order_Date);
            if (!Number.isNaN(orderDate.getTime())) {
                if (startDate) dateOK = dateOK && orderDate >= startDate;
                if (endDate) dateOK = dateOK && orderDate <= endDate;
            }
        }
        return cityOK && categoryOK && statusOK && paymentOK && amountOK && qtyOK && dateOK && searchOK;
    });
    updateDashboard();
}

function resetFilters() {
    cityFilter.value = "";
    categoryFilter.value = "";
    statusFilter.value = "";
    paymentFilter.value = "";
    if (searchBox) searchBox.value = "";
    if (amountSlider) amountSlider.value = amountSlider.max || 1000;
    if (quantitySlider) quantitySlider.value = quantitySlider.max || 10;
    if (dateStart) dateStart.value = dateStart.min || "";
    if (dateEnd) dateEnd.value = dateEnd.max || "";
    if (amountValue) amountValue.textContent = `₹${formatNumber(amountSlider.value)}`;
    if (quantityValue) quantityValue.textContent = quantitySlider.value;
    filteredOrders = [...orders];
    updateDashboard();
}

function initTheme() {
    document.body.classList.remove("light");
    localStorage.setItem("dashboard-theme", "dark");
    if (themeToggle) {
        themeToggle.textContent = "☀️";
    }
}

function toggleTheme() {
    document.body.classList.remove("light");
    localStorage.setItem("dashboard-theme", "dark");
    if (themeToggle) {
        themeToggle.textContent = "☀️";
    }
}

function startClock() {
    if (!liveClock) return;
    const tick = () => {
        const now = new Date();
        liveClock.textContent = now.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "medium"
        });
    };
    tick();
    setInterval(tick, 1000);
}

function updateDashboard() {
    updateKPIs(filteredOrders);
    renderCharts(filteredOrders);
    renderOrdersTable(filteredOrders);
}

function updateKPIs(data) {
    const totalOrders = data.length;
    const totalSales = data.reduce((total, row) => total + Number(row.Order_Amount || 0), 0);
    const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;
    const ratingValue = data.length ? (data.reduce((sum, row) => sum + Number(row.Rating_ID ? 4.5 : 0), 0) / data.length).toFixed(1) : "4.5";
    const totalCustomers = new Set(data.map(row => row.Customer_ID)).size;
    const totalRestaurants = new Set(data.map(row => row.Restaurant_ID)).size;

    const statusCounts = data.reduce((acc, row) => {
        const status = String(row.Order_Status || "Unknown").trim();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const completedCount = statusCounts.Delivered || statusCounts.Completed || 0;
    const completedRate = totalOrders ? ((completedCount / totalOrders) * 100).toFixed(1) : "0.0";

    document.getElementById("totalOrders").textContent = formatNumber(totalOrders);
    document.getElementById("totalSales").textContent = `₹${formatNumber(totalSales)}`;
    document.getElementById("avgOrderValue").textContent = `⭐ ${ratingValue} / 5`;
    document.getElementById("completedOrders").textContent = `${completedRate}%`;
    document.getElementById("totalCustomers").textContent = formatNumber(totalCustomers);
    document.getElementById("totalRestaurants").textContent = formatNumber(totalRestaurants);

    if (document.getElementById("trendOrders")) document.getElementById("trendOrders").textContent = "↑ +5%";
    if (document.getElementById("trendSales")) document.getElementById("trendSales").textContent = "↑ +8%";
    if (document.getElementById("trendAvg")) document.getElementById("trendAvg").textContent = "↓ -2%";
    if (document.getElementById("trendCompleted")) document.getElementById("trendCompleted").textContent = "↑ +3%";
    if (document.getElementById("trendCustomers")) document.getElementById("trendCustomers").textContent = "↑ +6%";
    if (document.getElementById("trendRestaurants")) document.getElementById("trendRestaurants").textContent = "↓ -1%";
}

function populateFilters() {
    populateSelect(cityFilter, "City");
    populateSelect(categoryFilter, "Food_Category");
    populateSelect(statusFilter, "Order_Status");
    populateSelect(paymentFilter, "Payment_ID");
}

function populateSelect(select, field) {
    const values = [...new Set(orders.map(row => String(row[field] || "").trim()).filter(Boolean))].sort();
    select.innerHTML = `<option value="">All ${select === cityFilter ? "Cities" : select === categoryFilter ? "Categories" : "Status"}</option>`;
    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

function renderCharts(data) {
    renderCityChart(data);
    renderMonthlyChart(data);
    renderFoodChart(data);
    renderStatusChart(data);
    renderRestaurantChart(data);
    renderOrdersChart(data);
    renderPaymentChart(data);
    renderIndiaMap(data);
}

function renderOrdersTable(data) {
    if (!ordersTableBody) return;
    const rows = data.slice(0, 50);
    ordersTableBody.innerHTML = rows.map(row => {
        const status = String(row.Order_Status || "").trim();
        const statusClass = status === "Delivered"
            ? "status-delivered"
            : status === "Preparing"
                ? "status-preparing"
                : status === "Cancelled"
                    ? "status-cancelled"
                    : "status-delivered";
        return `
            <tr>
                <td>${row.Order_ID || "-"}</td>
                <td>${row.City || "-"}</td>
                <td>${row.Food_Category || "-"}</td>
                <td>₹${formatNumber(row.Order_Amount || 0)}</td>
                <td><span class="status-badge ${statusClass}">${status || "-"}</span></td>
            </tr>
        `;
    }).join("");
}

function exportCSV() {
    const headers = ["Order ID", "City", "Category", "Amount", "Status"];
    const rows = filteredOrders.map(row => [row.Order_ID || "", row.City || "", row.Food_Category || "", row.Order_Amount || 0, row.Order_Status || ""]);
    const csvContent = [headers.join(",")].concat(rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zomato-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
}

function exportPDF() {
    window.print();
}

function renderCityChart(data) {
    const totals = aggregate(data, "City", row => Number(row.Order_Amount || 0));
    const labels = Object.keys(totals);
    const values = Object.values(totals);
    drawBarChart("cityChart", labels, values, "Revenue (₹)", "#E23744", false, true);
}

function renderMonthlyChart(data) {
    const monthTotals = Array.from({ length: 12 }, (_, index) => ({
        label: new Date(2025, index, 1).toLocaleString("default", { month: "short" }),
        sum: 0
    }));

    data.forEach(row => {
        const date = new Date(row.Order_Date);
        if (Number.isNaN(date)) return;
        const monthIndex = date.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
            monthTotals[monthIndex].sum += Number(row.Order_Amount || 0);
        }
    });

    const labels = monthTotals.map(item => item.label);
    const values = monthTotals.map(item => item.sum);
    drawLineChart("monthlyChart", labels, values, "Revenue", "#ff7a1a");
}

function renderFoodChart(data) {
    const counts = aggregate(data, "Food_Category", () => 1);
    const labels = Object.keys(counts).map(label => label.replace(/ealthy Food/g, "Healthy Food").replace(/lorth Indian/g, "North Indian"));
    const values = Object.values(counts);
    drawDonutChart("foodChart", labels, values, getColorPalette(labels.length), "Food\nCategory");
}

function renderStatusChart(data) {
    const idCounts = aggregate(data, "Order_Status", () => 1);
    drawDonutChart("statusChart", Object.keys(idCounts), Object.values(idCounts), getColorPalette(Object.keys(idCounts).length));
}

function renderRestaurantChart(data) {
    const counts = aggregate(data, "Restaurant_ID", () => 1);
    const top = topN(counts, 10);
    drawBarChart("restaurantChart", top.map(item => item.key), top.map(item => item.value), "Orders", "#E23744", true);
}

function renderOrdersChart(data) {
    const counts = aggregate(data, "City", () => 1);
    const top = topN(counts, 8);
    drawBarChart("ordersChart", top.map(item => item.key), top.map(item => item.value), "Orders", "#16a34a");
}

function renderPaymentChart(data) {
    const counts = aggregate(data, "Payment_ID", () => 1);
    drawDonutChart("paymentChart", Object.keys(counts), Object.values(counts), getColorPalette(Object.keys(counts).length));
}

function renderIndiaMap(data) {
    const container = document.getElementById("indiaMap");
    if (!container) return;

    const citySales = aggregate(data, "City", row => Number(row.Order_Amount || 0));
    const positions = {
        Ahmedabad: { x: 86, y: 132 },
        Bengaluru: { x: 150, y: 215 },
        Chennai: { x: 156, y: 250 },
        Delhi: { x: 90, y: 102 },
        Hyderabad: { x: 128, y: 205 },
        Jaipur: { x: 95, y: 125 },
        Kochi: { x: 155, y: 270 },
        Kolkata: { x: 182, y: 142 },
        Mumbai: { x: 82, y: 202 },
        Pune: { x: 104, y: 212 }
    };

    const points = Object.entries(citySales)
        .filter(([city]) => positions[city])
        .map(([city, sales]) => ({ city, sales, ...positions[city] }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 8);

    if (!points.length) {
        container.innerHTML = '<div class="map-empty">No city sales data for the selected filters.</div>';
        return;
    }

    const svgPoints = points.map(item => {
        const size = 7 + Math.max(5, Math.min(15, item.sales / 14000));
        return `
            <g>
                <circle cx="${item.x}" cy="${item.y}" r="${size + 2}" fill="rgba(255, 255, 255, 0.14)" />
                <circle cx="${item.x}" cy="${item.y}" r="${size}" fill="rgba(255, 122, 26, 0.78)" />
                <circle cx="${item.x}" cy="${item.y}" r="3.2" fill="#fff" />
                <text x="${item.x + 10}" y="${item.y - 8}" class="map-label">${item.city}</text>
            </g>
        `;
    }).join("");

    container.innerHTML = `
        <svg viewBox="0 0 260 320" class="india-svg">
            <path d="M44 88L72 73L95 74L118 57L143 62L165 76L186 70L208 82L216 101L220 123L204 143L203 166L217 188L214 214L195 231L182 250L156 261L142 282L112 287L89 270L73 251L54 236L52 212L38 194L29 161L42 136L35 116Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255, 122, 26, 0.5)" stroke-width="2"></path>
            ${svgPoints}
        </svg>
    `;
}

function aggregate(data, key, aggregator) {
    return data.reduce((acc, row) => {
        const value = String(row[key] || "Unknown").trim();
        acc[value] = (acc[value] || 0) + aggregator(row);
        return acc;
    }, {});
}

function topN(map, count) {
    return Object.entries(map)
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, count);
}

function drawBarChart(canvasId, labels, values, label, color, horizontal = false, shortenLabels = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth || 420;
    const height = canvas.clientHeight || 250;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 24, bottom: 46, left: 44 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (i / 4) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    const maxValue = Math.max(...values, 1);
    const dataLength = labels.length || 1;
    const gap = horizontal ? 16 : 22;
    const barWidth = horizontal
        ? Math.max(14, (chartHeight - gap * (dataLength - 1)) / dataLength)
        : Math.max(16, (chartWidth - gap * (dataLength - 1)) / dataLength);

    labels.forEach((labelText, index) => {
        const value = Number(values[index] || 0);
        const barHeight = Math.min(chartHeight, (value / maxValue) * chartHeight);
        const x = padding.left + (horizontal ? 0 : index * (barWidth + gap));
        const y = horizontal
            ? padding.top + index * (barWidth + gap)
            : height - padding.bottom - barHeight;
        const barLength = horizontal ? (value / maxValue) * chartWidth : barWidth;
        const barThickness = horizontal ? Math.max(14, barWidth) : Math.max(16, barWidth);
        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fillRect(horizontal ? padding.left : x, horizontal ? y : y, horizontal ? barLength : barThickness, horizontal ? barThickness : barHeight);
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px Poppins";
        ctx.textAlign = horizontal ? "left" : "center";
        const labelX = horizontal ? padding.left + 6 : x + barThickness / 2;
        const labelY = horizontal ? y + barThickness / 2 + 4 : height - padding.bottom + 16;
        const displayLabel = shortenLabels ? formatChartLabel(labelText) : labelText;
        ctx.fillText(displayLabel, labelX, labelY);

        ctx.textAlign = horizontal ? "right" : "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(
            formatNumber(value),
            horizontal ? padding.left + barLength - 4 : x + barThickness / 2,
            horizontal ? y + barThickness / 2 + 4 : y - 6
        );
        ctx.textBaseline = "alphabetic";
    });
}

function drawLineChart(canvasId, labels, values, label, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth || 420;
    const height = canvas.clientHeight || 250;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 24, bottom: 46, left: 44 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...values, 1);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (i / 4) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
    }

    ctx.beginPath();
    values.forEach((value, index) => {
        const x = padding.left + (index / Math.max(values.length - 1, 1)) * chartWidth;
        const y = height - padding.bottom - (value / maxValue) * chartHeight;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.shadowBlur = 2;
    ctx.shadowColor = color;
    ctx.stroke();
    ctx.shadowBlur = 0;

    values.forEach((value, index) => {
        const x = padding.left + (index / Math.max(values.length - 1, 1)) * chartWidth;
        const y = height - padding.bottom - (value / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.stroke();
    });

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px Poppins";
    labels.forEach((text, index) => {
        const x = padding.left + (index / Math.max(values.length - 1, 1)) * chartWidth;
        ctx.save();
        ctx.translate(x, height - padding.bottom + 22);
        ctx.rotate(-35 * Math.PI / 180);
        ctx.fillText(text, 0, 0);
        ctx.restore();
    });
}

function drawDonutChart(canvasId, labels, values, colors, centerLabel = "") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.clientWidth || 420;
    const height = canvas.clientHeight || 250;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2 - 12;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.28;
    const total = values.reduce((acc, value) => acc + Number(value || 0), 0) || 1;
    let startAngle = -Math.PI / 2;

    values.forEach((value, index) => {
        const slice = (Number(value || 0) / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + slice);
        ctx.closePath();
        ctx.fillStyle = colors[index] || "#E23744";
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors[index] || "#E23744";
        ctx.fill();
        ctx.shadowBlur = 0;
        startAngle += slice;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.58, 0, Math.PI * 2);
    ctx.fillStyle = document.body.classList.contains("light") ? "#fff7f2" : "#140502";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Poppins";
    ctx.textAlign = "center";
    if (centerLabel) {
        const lines = centerLabel.split("\\n");
        const lineHeight = 14;
        lines.forEach((line, index) => {
            ctx.fillText(line, centerX, centerY - 4 + index * lineHeight);
        });
    }

    const legendX = Math.max(20, width - 170);
    const legendStartY = Math.max(34, centerY - ((labels.length - 1) * 20) / 2);
    const legendItemGap = 22;
    ctx.textAlign = "left";
    labels.forEach((label, index) => {
        const y = legendStartY + index * legendItemGap;

        ctx.fillStyle = colors[index] || "#E23744";
        ctx.fillRect(legendX, y - 6, 12, 12);

        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 12px Poppins";
        const labelText = String(label || "").trim();
        ctx.fillText(labelText, legendX + 18, y + 2);
    });
}

function getChartTextColor() {
    return document.body.classList.contains("light") ? "#2a0205" : "#fdf2f8";
}

function getColorPalette(length) {
    const palette = [
        "#38bdf8",
        "#8b5cf6",
        "#f97316",
        "#22c55e",
        "#eab308",
        "#ec4899",
        "#0ea5e9",
        "#a855f7",
        "#fb7185",
        "#34d399"
    ];
    return Array.from({ length }, (_, index) => palette[index % palette.length]);
}

function formatChartLabel(label) {
    const text = String(label || "").trim();
    if (!text) return "";
    return text.length > 3 ? text.slice(0, 3) : text;
}

function formatNumber(value) {
    return Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
