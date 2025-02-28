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
fetch("./chuyenganh.json")
  .then((response) => response.json())
  .then((json) => {
    const sectorSelect = document.querySelector("#sector-select");
    const majorSelect = document.querySelector("#major-select");

    // Populate sector dropdown
    json.fields.forEach((field) => {
      const option = document.createElement("option");
      option.value = field.sector;
      option.textContent = field.sector;
      sectorSelect.appendChild(option);
    });

    sectorSelect.addEventListener("change", function () {
      majorSelect.innerHTML = '<option value="">Chuyên ngành</option>';
      const selectedSector = this.value;
      const selectedField = json.fields.find(
        (field) => field.sector === selectedSector
      );
      if (selectedField) {
        selectedField.majors.forEach((major) => {
          const option = document.createElement("option");
          option.value = major;
          option.textContent = major;
          majorSelect.appendChild(option);
        });
      }
    });
  })
  .catch((error) => console.error("Error loading JSON:", error));
