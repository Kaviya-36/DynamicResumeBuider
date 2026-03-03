// ---------------- DOM Elements ----------------
const form = document.getElementById("resumeForm");
const preview = document.getElementById("resumePreview");
const summary = document.getElementById("summary");
const counter = document.getElementById("summaryCounter");

const themeToggle = document.getElementById("themeToggle");
const templateSelect = document.getElementById("templateSelect");
const profilePhotoInput = document.getElementById("profilePhoto");
const photoPreview = document.getElementById("photoPreview");

// ---------------- Data Arrays ----------------
let skills = [];
let languages = [];
let hobbies = [];
let profilePhoto = "";

// ---------------- Character Counter ----------------
summary.addEventListener("input", () => {
  counter.textContent = `${summary.value.length} / 500`;
});

// ---------------- Theme Toggle ----------------
themeToggle.onclick = () => {
  document.body.classList.toggle("dark-mode");
};

// ---------------- Template Toggle ----------------
templateSelect.onchange = generateResume;

// ---------------- Profile Photo ----------------
profilePhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profilePhoto = reader.result;
      photoPreview.innerHTML = `<img src="${profilePhoto}" alt="Profile Photo" width="100">`;
    };
    reader.readAsDataURL(file);
  }
});

// ---------------- Helper Functions ----------------
function createBadge(name, container, array) {
  const span = document.createElement("span");
  span.className = "badge bg-primary m-1";
  span.innerHTML = `${name} <span style="cursor:pointer;" onclick="removeItem('${container}', ${array.indexOf(name)})">&times;</span>`;
  document.getElementById(container).appendChild(span);
}

function removeItem(container, index) {
  switch(container) {
    case 'skillsContainer': skills.splice(index,1); renderArray('skillsContainer', skills); break;
    case 'languagesContainer': languages.splice(index,1); renderArray('languagesContainer', languages); break;
    case 'hobbiesContainer': hobbies.splice(index,1); renderArray('hobbiesContainer', hobbies); break;
  }
}

function renderArray(container, array){
  const div = document.getElementById(container);
  div.innerHTML = "";
  array.forEach(item => createBadge(item, container, array));
}

// ---------------- Add Items ----------------
document.getElementById("addSkill").onclick = () => {
  const input = document.getElementById("skillInput");
  const val = input.value.trim();
  if(val){ skills.push(val); renderArray('skillsContainer', skills); input.value=""; }
};

document.getElementById("addLanguage").onclick = () => {
  const input = document.getElementById("languageInput");
  const val = input.value.trim();
  if(val){ languages.push(val); renderArray('languagesContainer', languages); input.value=""; }
};

document.getElementById("addHobby").onclick = () => {
  const input = document.getElementById("hobbyInput");
  const val = input.value.trim();
  if(val){ hobbies.push(val); renderArray('hobbiesContainer', hobbies); input.value=""; }
};

// ---------------- Dynamic Sections ----------------
function addDynamicSection(containerId, fields){
  const container = document.getElementById(containerId);
  const div = document.createElement("div");
  div.className="border p-3 mb-2";

  let html="";
  fields.forEach(f=>{
    if(f.type==="textarea"){
      html+=`<textarea class="form-control mb-2 ${f.class}" placeholder="${f.placeholder}"></textarea>`;
    } else if(f.type==="checkbox"){
      html+=`<div class="form-check mb-2"><input class="form-check-input ${f.class}" type="checkbox">${f.label}</div>`;
    } else {
      html+=`<input class="form-control mb-2 ${f.class}" placeholder="${f.placeholder}" type="${f.type}">`;
    }
  });
  html+=`<button type="button" class="btn btn-sm btn-danger mt-2">Remove</button>`;
  div.innerHTML = html;
  container.appendChild(div);
  div.querySelector("button").onclick = ()=> div.remove();
}

// Experience
document.getElementById("addExperience").onclick = ()=> addDynamicSection("experienceContainer", [
  {class:"company", placeholder:"Company Name", type:"text"},
  {class:"jobTitle", placeholder:"Job Title", type:"text"},
  {class:"startDate", placeholder:"Start Date", type:"month"},
  {class:"endDate", placeholder:"End Date", type:"month"},
  {class:"currently", type:"checkbox", label:"Currently Working"},
  {class:"responsibilities", placeholder:"Responsibilities", type:"textarea"}
]);

// Education
document.getElementById("addEducation").onclick = ()=> addDynamicSection("educationContainer", [
  {class:"institution", placeholder:"Institution", type:"text"},
  {class:"degree", placeholder:"Degree", type:"text"},
  {class:"startYear", placeholder:"Start Year", type:"number"},
  {class:"endYear", placeholder:"End Year", type:"number"},
  {class:"score", placeholder:"Score/CGPA", type:"text"}
]);

// Projects
document.getElementById("addProject").onclick = ()=> addDynamicSection("projectContainer", [
  {class:"projectTitle", placeholder:"Project Title", type:"text"},
  {class:"techStack", placeholder:"Tech Stack", type:"text"},
  {class:"projectDesc", placeholder:"Description", type:"textarea"},
  {class:"projectLink", placeholder:"Live/Repo Link", type:"url"},
]);

// Certifications
document.getElementById("addCertification").onclick = () => {
  const container = document.getElementById("certificationsContainer");
  const div = document.createElement("div");
  div.className="border p-2 mb-2 d-flex align-items-center gap-2 flex-wrap";
  div.innerHTML = `
    <input type="text" class="form-control certificationName" placeholder="Certification Name">
    <input type="file" class="form-control certificationPhoto" accept="image/*">
    <button type="button" class="btn btn-sm btn-danger">Remove</button>
  `;
  container.appendChild(div);
  div.querySelector("button").onclick = ()=> div.remove();
};

// ---------------- Generate Resume ----------------
document.getElementById("generateBtn").onclick = generateResume;

function generateResume(){
  if(!validateForm()) return;

  // Personal Info
  const name = document.getElementById("fullName").value;
  const role = document.getElementById("role").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const location = document.getElementById("location").value;
  const linkedin = document.getElementById("linkedin").value;
  const github = document.getElementById("github").value;
  const summaryText = summary.value;
  const templateClass = templateSelect.value==="classic"?"classic-template":"modern-template";

  // Skills / Languages / Hobbies
  const skillHTML = skills.map(s=>`<span class="badge bg-secondary m-1">${s}</span>`).join("");
  const langHTML = languages.map(l=>`<span class="badge bg-success m-1">${l}</span>`).join("");
  const hobbyHTML = hobbies.map(h=>`<span class="badge bg-warning m-1">${h}</span>`).join("");

  // Profile Photo
  const photoHTML = profilePhoto ? `<img src="${profilePhoto}" width="120" class="mb-3">` : "";

  // Experiences
  let expHTML = "";
  document.querySelectorAll("#experienceContainer > div").forEach(div => {
    const company = div.querySelector(".company")?.value || "";
    const jobTitle = div.querySelector(".jobTitle")?.value || "";
    const start = div.querySelector(".startDate")?.value || "";
    const end = div.querySelector(".endDate")?.value || "";
    const currently = div.querySelector(".currently")?.checked;
    const resp = div.querySelector(".responsibilities")?.value || "";
    if(company || jobTitle) expHTML += `<h6>${jobTitle} at ${company}</h6><small>${start} - ${currently ? "Present" : end}</small><p>${resp}</p>`;
  });

  // Education
  let eduHTML = "";
  document.querySelectorAll("#educationContainer > div").forEach(div => {
    const inst = div.querySelector(".institution")?.value || "";
    const degree = div.querySelector(".degree")?.value || "";
    const start = div.querySelector(".startYear")?.value || "";
    const end = div.querySelector(".endYear")?.value || "";
    const score = div.querySelector(".score")?.value || "";
    if(inst || degree) eduHTML += `<h6>${degree} at ${inst}</h6><small>${start} - ${end} ${score ? "| Score: "+score : ""}</small>`;
  });

  // Projects
  let projHTML = "";
  document.querySelectorAll("#projectContainer > div").forEach(div => {
    const title = div.querySelector(".projectTitle")?.value || "";
    const stack = div.querySelector(".techStack")?.value || "";
    const desc = div.querySelector(".projectDesc")?.value || "";
    const link = div.querySelector(".projectLink")?.value || "";
    if(title) projHTML += `<h6>${title}</h6><small>${stack}</small><p>${desc}${link?`<br><a href="${link}" target="_blank">${link}</a>`:""}</p>`;
  });

  // Certifications (async handling)
  const certDivs = document.querySelectorAll("#certificationsContainer > div");
  let certHTML = "";
  let certImagesPromises = [];

  certDivs.forEach(div => {
    const name = div.querySelector(".certificationName")?.value || "";
    const file = div.querySelector(".certificationPhoto")?.files[0];

    if(file) {
      const reader = new FileReader();
      const p = new Promise(resolve => {
        reader.onload = () => resolve(`<div class="mb-2"><h6>${name}</h6><img src="${reader.result}" width="120"></div>`);
      });
      reader.readAsDataURL(file);
      certImagesPromises.push(p);
    } else if(name) {
      certHTML += `<h6>${name}</h6>`;
    }
  });

  // Build main preview HTML
  preview.className = `card p-4 shadow ${templateClass}`;
  preview.innerHTML = `
    ${photoHTML}
    <h2>${name}</h2>
    <h5>${role}</h5>
    <p>${phone} | ${email} | ${location} | <a href="${linkedin}">LinkedIn</a> | <a href="${github}">GitHub</a></p>
    <hr>
    <h5>Summary</h5>
    <p>${summaryText}</p>
    ${skills.length?`<h5>Skills</h5>${skillHTML}`:""}
    ${languages.length?`<h5>Languages</h5>${langHTML}`:""}
    ${hobbies.length?`<h5>Hobbies</h5>${hobbyHTML}`:""}
    ${expHTML?`<h5>Experience</h5>${expHTML}`:""}
    ${eduHTML?`<h5>Education</h5>${eduHTML}`:""}
    ${projHTML?`<h5>Projects</h5>${projHTML}`:""}
    ${certHTML?`<h5>Certifications</h5>${certHTML}`:""}
  `;

  // Append certificate images asynchronously
  if(certImagesPromises.length > 0) {
    Promise.all(certImagesPromises).then(results => {
      const certSection = document.createElement("div");
      certSection.innerHTML = `<h5>Certifications</h5>` + results.join("");
      preview.appendChild(certSection);
    });
  }
}

// ---------------- Form Validation ----------------
function validateForm(){
  let valid = true;
  if(!form.checkValidity()){ form.classList.add("was-validated"); valid=false; }

  const phone = document.getElementById("phone").value;
  if(phone.length < 10) valid = false;

  const sum = summary.value.trim();
  if(!sum) valid = false;

  return valid;
}