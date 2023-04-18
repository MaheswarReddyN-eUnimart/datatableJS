const baseUrl = 'http://universities.hipolabs.com/search';
const countrySelect = document.getElementById('country-select');
const searchInput = document.getElementById('search');
const universityTableBody = document.querySelector('#tableData');
const favTableBody = document.querySelector('#favtableData');
const checkBoxes = universityTableBody.getElementsByTagName("INPUT");
console.log(checkBoxes, "checkBoxes")
let universities = [];



function fetchFavList(){
favTableBody.innerHTML = '';
	let favListData1 = localStorage.getItem('favList');
	var favListData = JSON.parse(favListData1);
	//favListData = JSON.parse(favListData);
	console.log(favListData, "favListData")

	favListData.forEach(favitem => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${favitem.name || '-'}</td>
      <td>${favitem.country || '-'}</td>
      <td>${favitem.alpha_two_code || '-'}</td>
      <td>${favitem.web_pages[0] || '-'}</td>
	`;
    favTableBody.appendChild(row);
  });
	
}
function fetchUniversities(country) {
  let url=''
  if(!country){
    url = `${baseUrl}`;
  }
  else{
    url = `${baseUrl}?country=${country}`;
  }
 
  fetch(url)
    .then(response => response.json())
    .then(data => {
      universities = data;
      renderUniversities(universities);
    });
}

let currentPage = 1;
let pageSize = parseInt(document.getElementById('perPage').value);
const perPageSelect = document.getElementById('perPage');
perPageSelect.addEventListener('change', () => {
  pageSize = parseInt(perPageSelect.value);
  currentPage = 1;
  renderUniversities(universities);
});
function renderUniversities(universities) {
  universityTableBody.innerHTML = '';
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageUniversities = universities.slice(start, end);

  pageUniversities.forEach(university => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" /></td>
      <td>${university.name || '-'}</td>
      <td>${university.country || '-'}</td>
      <td>${university.alpha_two_code || '-'}</td>
      <td><a href="${university.web_pages[0]}" target="_blank">${university.web_pages[0]}</a></td>
	`;
    universityTableBody.appendChild(row);
  });

  renderPagination(universities);

}

function favList(){
let favlist = [];
let obj = {}
for (var i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].checked) {
                var row = checkBoxes[i].parentNode.parentNode;
		
		let obj = {
		name:row.cells[1].innerHTML,
		country:row.cells[2].innerHTML,
		alpha_two_code:row.cells[3].innerHTML,
		web_pages: [row.cells[4].innerHTML]
		}
		
		favlist.push(obj);
            }
        }
 	
		localStorage.setItem("favList", JSON.stringify(favlist));
		
        //Display selected Row data in Alert Box.
        //alert(message);
}

function renderPagination(universities) {
  const totalPages = Math.ceil(universities.length / pageSize);

  let paginationHtml = '';
  for (let i = 1; i <= totalPages; i++) {
    paginationHtml += `
      <a href="javaScript:void(0)" class="pagination-link${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>
    `;
  }

 

  const paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = paginationHtml;

  const paginationLinks = document.querySelectorAll('.pagination-link');
  paginationLinks.forEach(link => {
    link.addEventListener('click', () => {
      currentPage = parseInt(link.dataset.page);
      renderUniversities(universities);
    });
  });

 
}


function filterUniversities(searchText) {
  if (!searchText) {
    currentPage = 1;
    renderUniversities(universities);
    return;
  }

  const filteredUniversities = universities.filter(university => {
    const values = Object.values(university).join(' ').toLowerCase();
    return values.indexOf(searchText.toLowerCase()) !== -1;
  });

  currentPage = 1;
  renderUniversities(filteredUniversities);
}
  countrySelect.addEventListener('change', () => {
  const selectedCountry = countrySelect.value;
  fetchUniversities(selectedCountry);
  });
  
  searchInput.addEventListener('input', () => {
  const searchText = searchInput.value;
  filterUniversities(searchText);
  });
  
  // Load universities for the default country
  fetchUniversities('');
  fetchFavList();