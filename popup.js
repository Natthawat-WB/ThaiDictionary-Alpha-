const input = document.getElementById("searchInput");
const btn = document.getElementById("searchBtn");
const result = document.getElementById("result");
const error = document.getElementById("error");
const darkToggle = document.getElementById("darkModeToggle");

function getMeaning() {
  const container = document.querySelector("div.PZPZlf[data-attrid='SenseDefinition']");
  if (container) {
    let rawPsd = container.getAttribute("data-psd") || "";
    const splitIndex = rawPsd.indexOf("~:&");
    if (splitIndex !== -1) {
      rawPsd = rawPsd.substring(splitIndex + 3).replace(/&amp;/g, "&").trim();
    }
    const spans = container.querySelectorAll("div.RES9jf span");
    let spanTexts = [];
    spans.forEach(span => {
      const text = span.textContent.trim();
      if (text && !text.toLowerCase().includes("oxford")) {
        spanTexts.push(text);
      }
    });
    if (spanTexts.length > 0) {
      return spanTexts.join(" ");
    }
    if (rawPsd) return rawPsd;
    return container.innerText.trim();
  }
  const spanHg = document.querySelector("span.hgKElc");
  if (spanHg) {
    const bTag = spanHg.querySelector("b");
    if (bTag) {
      return bTag.textContent.trim();
    }
    return spanHg.textContent.trim();
  }
  return null;
}

async function performSearch(query) {
  error.textContent = "";
  result.textContent = "กำลังค้นหา...";

  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}+หมายถึง`;
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const container = doc.querySelector("div.PZPZlf[data-attrid='SenseDefinition']");
    if (container) {
      let rawPsd = container.getAttribute("data-psd") || "";
      const splitIndex = rawPsd.indexOf("~:&");
      if (splitIndex !== -1) {
        rawPsd = rawPsd.substring(splitIndex + 3).replace(/&amp;/g, "&").trim();
      }
      const spans = container.querySelectorAll("div.RES9jf span");
      let spanTexts = [];
      spans.forEach(span => {
        const text = span.textContent.trim();
        if (text && !text.toLowerCase().includes("oxford")) {
          spanTexts.push(text);
        }
      });
      if (spanTexts.length > 0) {
        result.textContent = spanTexts.join(" ");
        return;
      }
      if (rawPsd) {
        result.textContent = rawPsd;
        return;
      }
      result.textContent = container.innerText.trim();
      return;
    }
    const spanHg = doc.querySelector("span.hgKElc");
    if (spanHg) {
      const bTag = spanHg.querySelector("b");
      if (bTag) {
        result.textContent = bTag.textContent.trim();
        return;
      }
      result.textContent = spanHg.textContent.trim();
      return;
    }

    error.textContent = "ไม่พบความหมายในผลการค้นหา";
    result.textContent = "";
  } catch (e) {
    error.textContent = "เกิดข้อผิดพลาดในการดึงข้อมูล: " + e.message;
    result.textContent = "";
  }
}

btn.addEventListener("click", () => {
  if (input.value.trim() === "") {
    error.textContent = "กรุณาพิมพ์คำศัพท์ที่ต้องการค้นหา";
    result.textContent = "";
    return;
  }
  error.textContent = "";
  performSearch(input.value.trim());
});

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    btn.click();
  }
});

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
