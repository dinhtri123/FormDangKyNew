function populateSelects(data) {
  const provinceSelects = document.querySelectorAll(".province-select");

  provinceSelects.forEach((provinceSelect) => {
    const formId = provinceSelect.dataset.select;
    const districtSelect = document.querySelector(
      `.district-select[data-select="${formId}"]`
    );
    const wardSelect = document.querySelector(
      `.ward-select[data-select="${formId}"]`
    );

    data.forEach((province) => {
      const option = document.createElement("option");
      option.value = province.level1_id;
      option.textContent = province.name;
      provinceSelect.appendChild(option);
    });

    provinceSelect.addEventListener("change", function () {
      const selectedProvince = this.value;
      districtSelect.innerHTML = '<option value="">Quận/Huyện</option>';
      wardSelect.innerHTML = '<option value="">Xã/Phường/Thị Trấn</option>';
      const provinceData = data.find(
        (item) => item.level1_id === selectedProvince
      );
      if (provinceData) {
        provinceData.level2s.forEach((district) => {
          const option = document.createElement("option");
          option.value = district.level2_id;
          option.textContent = district.name;
          districtSelect.appendChild(option);
        });
      }
    });

    districtSelect.addEventListener("change", function () {
      const selectedProvince = provinceSelect.value;
      const selectedDistrict = this.value;
      wardSelect.innerHTML = '<option value="">Xã/Phường/Thị Trấn</option>';
      const provinceData = data.find(
        (item) => item.level1_id === selectedProvince
      );
      if (provinceData) {
        const districtData = provinceData.level2s.find(
          (d) => d.level2_id === selectedDistrict
        );
        if (districtData) {
          districtData.level3s.forEach((ward) => {
            const option = document.createElement("option");
            option.value = ward.level3_id;
            option.textContent = ward.name;
            wardSelect.appendChild(option);
          });
        }
      }
    });
  });
}

fetch("./dvhcvn.json")
  .then((response) => response.json())
  .then((json) => {
    const data = json.data;
    populateSelects(data);
  })
  .catch((error) => console.error("Error loading JSON:", error));

let data = {};

const cosoSelect = document.getElementById("coso-select");
const sector1Select = document.getElementById("sector1-select");
const major1Select = document.getElementById("major1-select");
const sector2Select = document.getElementById("sector2-select");
const major2Select = document.getElementById("major2-select");

async function loadData() {
  try {
    const response = await fetch("./ds-chuyen-nganh.json");
    data = await response.json();
    updateCosoOptions();
  } catch (error) {
    console.error("Lỗi tải dữ liệu:", error);
  }
}

function updateCosoOptions() {
  const cosoList = data.danhsachcoso.map((c) => c.coso);
  updateSelectOptions(cosoSelect, cosoList, "Chọn cơ sở");

  cosoSelect.addEventListener("change", updateSectorOptions);
  updateSectorOptions();
}

function updateSectorOptions() {
  const selectedCoso = cosoSelect.value;

  if (!selectedCoso) {
    updateSelectOptions(major1Select, [], "Chọn chuyên ngành");
    updateSelectOptions(major2Select, [], "Chọn chuyên ngành");
    updateSelectOptions(sector1Select, [], "Ngành");
    updateSelectOptions(sector2Select, [], "Ngành");
    return;
  }

  const cosoData = data.danhsachcoso.find((c) => c.coso === selectedCoso);
  if (!cosoData) return;

  const majors = cosoData.chuyennganhhep.map((c) => c.name);

  updateSelectOptions(major1Select, majors, "Chọn chuyên ngành");
  updateSelectOptions(major2Select, majors, "Chọn chuyên ngành");

  updateSelectOptions(sector1Select, [], "Ngành");
  updateSelectOptions(sector2Select, [], "Ngành");

  major1Select.addEventListener("change", () =>
    autoSelectSector(major1Select, sector1Select)
  );
  major2Select.addEventListener("change", () =>
    autoSelectSector(major2Select, sector2Select)
  );
}

function updateMajorOptions(sectorSelect, majorSelect) {
  const selectedCoso = cosoSelect.value;
  const selectedSector = sectorSelect.value;
  const cosoData = data.danhsachcoso.find((c) => c.coso === selectedCoso);

  if (!selectedSector) {
    updateSelectOptions(majorSelect, [], "Chọn chuyên ngành");
    return;
  }

  const majors = cosoData.chuyennganhhep
    .filter((c) => c.level1 === selectedSector)
    .map((c) => c.name);

  updateSelectOptions(majorSelect, majors, "Chọn chuyên ngành");
}

function updateSelectOptions(selectElement, options, defaultText) {
  selectElement.innerHTML = `<option value="">${defaultText}</option>`;
  options.forEach((option) => {
    const newOption = document.createElement("option");
    newOption.value = option;
    newOption.textContent = option;
    selectElement.appendChild(newOption);
  });
}
function autoSelectSector(majorSelect, sectorSelect) {
  const selectedCoso = cosoSelect.value;
  const selectedMajor = majorSelect.value;
  const cosoData = data.danhsachcoso.find((c) => c.coso === selectedCoso);

  if (!cosoData) return;

  const found = cosoData.chuyennganhhep.find((c) => c.name === selectedMajor);

  if (found) {
    sectorSelect.innerHTML = `<option value="${found.level1}">${found.level1}</option>`;
  }
}

loadData();
