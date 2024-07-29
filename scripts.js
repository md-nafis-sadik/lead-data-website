document.addEventListener("DOMContentLoaded", () => 
  {

    // Initial Data Fetching
        const url = "http://localhost:5500/data.json"; // Change this to your actual JSON URL
        let data = [];
        const rowsPerPage = 9;
        let currentPage = 1;
        let filterData = [];
        
        const fetchData = async () => {
          try {
            // Fetch data from the JSON URL
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error("Network response was not ok " + response.statusText);
            }
        
            // Parse JSON response
            data = await response.json();
        
            // Display the initial page of data
            displayPage(currentPage, data);
        
            // Display total number of companies
            const totalComp = document.querySelector(".total-companies");
            totalComp.innerText = `Total ${data.length}`;
        
            // Add mouseover and mouseout event listeners to table cells
            const tableCells = document.querySelectorAll('.company-table tbody td');
            tableCells.forEach(cell => {
              // Mouseover event: Change background color on hover
              cell.addEventListener('mouseover', function() {
                const row = cell.parentNode; // Get the parent row of the current cell
                const cells = row.querySelectorAll('td'); // Get all the td elements in the same row
                cells.forEach(td => {
                  td.style.backgroundColor = '#e7e4ea'; // Change background color on mouseover
                  td.style.transition = 'background-color 0.3s ease'; // Smooth transition effect
                });
              });
        
              // Mouseout event: Reset background color
              cell.addEventListener('mouseout', function() {
                const row = cell.parentNode; // Get the parent row of the current cell
                const cells = row.querySelectorAll('td'); // Get all the td elements in the same row
                cells.forEach(td => td.style.backgroundColor = ''); // Reset background color on mouseout
              });
            });
        
          } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
          }
        };
        
        fetchData();

    

    // Calculate total number of pages based on data length and rows per page
        const calculateTotalPages = (data, rowsPerPage) => {          
          return Math.ceil(data.length / rowsPerPage);
        };


    // Function to display page data on given page number and data to input
        const displayPage = (page, givendata) => {
          // Select the table body where data will be displayed
          const tableBody = document.querySelector(".company-table tbody");
          tableBody.innerHTML = ""; // Clear existing table rows
        
          // Calculate start and end indices for the current page
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;
          
          // Slice data to get current page's data
          const pageData = givendata.slice(start, end);
        
          // Loop through the data and create rows for each item
          pageData.forEach((item) => {
            const row = document.createElement("tr");
            row.className = "data-row"; // Add class to row
        
            // Populate row with data from each item
            row.innerHTML = `
              <td class="select"><input type="checkbox"></td>
              <td class="first_name">${item.first_name}</td>
              <td class="last_name">${item.last_name}</td>
              <td class="job_title">${item.job_title}</td>
              <td class="seniority">${item.seniority}</td>
              <td class="email">${item.email}</td>
              <td class="phone_number">${item.phone_number}</td>
              <td class="company">${item.company}</td>
              <td class="company_type">${item.company_type}</td>
              <td class="company_service">${item.company_service}</td>
              <td class="technologies">${item.technologies}</td>
              <td class="domain">${item.domain}</td>
              <td class="industry">${item.industry}</td>
              <td class="country">${item.country}</td>
              <td class="linkedin">${item.linkedin}</td>
              <td class="employees">${item.employees}</td>
              <td class="founded_year">${item.founded_year}</td>
              <td class="revenue">${item.revenue}</td>
              <td class="last_updated">${item.last_updated}</td>
              <td class="action"><button class="action-button">Save</button></td>
            `;
            tableBody.appendChild(row); // Append row to table body
          });
        
          // Update pagination indicator to highlight current page
          document.querySelectorAll(".page-span").forEach((span) => {
            span.classList.remove("active"); // Remove 'active' class from all spans
          });
          document.querySelector(`.page-span[data-page="${page}"]`).classList.add("active"); // Add 'active' class to current page span
        };
        
        
  // Function to update paginaton span
      const updatePaginationSpans = (currentPage, totalPages) => {
        document.querySelectorAll(".page-span").forEach((span) => {
          const page = parseInt(span.getAttribute("data-page"));
          console.log(page);
          if (page > totalPages) {
            span.classList.add("disabled");
            span.removeEventListener("click", handlePageClick); // Prevent click on disabled spans
          } else {
            span.classList.remove("disabled");
            span.addEventListener("click", handlePageClick); // Re-enable click on valid spans
          }
        });
      };

  const handlePageClick = (e) => {
    currentPage = parseInt(e.target.getAttribute("data-page"));
    if (filterData.length !== 0) {
      console.log(currentPage);
      updatePaginationSpans(
        currentPage,
        calculateTotalPages(filterData, rowsPerPage)
      );
      displayPage(currentPage, filterData);
    } else {
      console.log(currentPage);
      updatePaginationSpans(
        currentPage,
        calculateTotalPages(data, rowsPerPage)
      );
      displayPage(currentPage, data);
    }
  };

  document.querySelectorAll(".page-span").forEach((span) => {
    span.addEventListener("click", handlePageClick);
  });


  const menuItems = document.querySelectorAll(".nav__link");
  const checkboxes = document.querySelectorAll('.checkbox-container-div input[type="checkbox"]');
  const searchInputs = document.querySelectorAll(".search-bar-input");
  const employeesSearchLim = document.querySelector("#employees-search");
  const yearSearchLim = document.querySelector("#year-search");
  let low = 0;
  let high = 0;
  let filterCount = 0;
  let ylow = 0;
  let yhigh = 0;
  let yfilterCount = 0;


  const toggleActiveMenuItem = (item) => {
    menuItems.forEach((i) => i.classList.remove("active-link"));
    item.classList.add("active-link");
  };


// Function to update checkbox count
  const updateCheckboxCount = () => {
    const checkedCount = Array.from(checkboxes).filter(
      (checkbox) => checkbox.checked
    ).length;
    counterDiv.textContent = checkedCount;
    console.log("Checkbox count updated:", checkedCount);
  };

// Function to reset checkbox count
  const resetCheckboxes = () => {
    checkboxes.forEach((checkbox) => (checkbox.checked = false));
    counterDiv.textContent = 0;
    document
      .querySelectorAll(".company-table tbody tr")
      .forEach((row) => (row.style.display = ""));
  };


// Function to filter search results
  const filterSearchResults = (searchValue, resultsDiv) => {
    const listItems = resultsDiv.querySelectorAll(".checkbox-container-div");
    let matchFound = false;
    listItems.forEach((item) => {
      const text = item.querySelector(".checkmark").textContent.toLowerCase();

      item.style.display = text.includes(searchValue) ? "" : "none";
      if (text.includes(searchValue)) matchFound = true;
    });
    resultsDiv.style.display = matchFound ? "" : "none";
  };


// Function to filter table rows
  const filterTableRows = () => {
    const selectedCountries = Array.from(
      document.querySelectorAll(".country-checkbox:checked")
    ).map((checkbox) => checkbox.nextElementSibling.textContent.trim());
    const selectedIndustries = Array.from(
      document.querySelectorAll(".industry-checkbox:checked")
    ).map((checkbox) => checkbox.nextElementSibling.textContent.trim());

    function displayFilteredData(Industries, Countries) {
      filterData = data.filter(
        (item) =>
          (Industries.length === 0 || Industries.includes(item.industry)) &&
          (Countries.length === 0 || Countries.includes(item.country))
      );

      updatePaginationSpans(
        currentPage,
        calculateTotalPages(filterData, rowsPerPage)
      );
    }

    displayFilteredData(selectedIndustries, selectedCountries);

    displayPage(currentPage, filterData);
    console.log(filterData);

    if (emparr.length !== 0) {
      employees();
    }

    if (ylow !== 0 && yhigh !== 0) {
      year();
    }
  };

  menuItems.forEach((item) =>
    item.addEventListener("click", () => toggleActiveMenuItem(item))
  );

  checkboxes.forEach((checkbox) =>
    checkbox.addEventListener("change", () => {
      // updateCheckboxCount();
      console.log("Checkbox changed:", checkbox);
      filterTableRows();
    })
  );

  // counterDiv.addEventListener("click", resetCheckboxes);

  searchInputs.forEach((input) =>
    input.addEventListener("input", (event) => {
      const searchValue = event.target.value.toLowerCase();
      const resultsDiv = event.target.closest(".search-bar").nextElementSibling;
      filterSearchResults(searchValue, resultsDiv);
    })
  );


// Function to toggle a div

  window.toggleSearch = (element, resultsDivId) => {

    const results = document.getElementById(resultsDivId);
    const isResultDivVisible = results.style.display !== "none";
    results.style.display = isResultDivVisible ? "none" : "";

    // Find the plus and minus icons within the clicked element
    const plusIcon = element.querySelector('.add-icons');
    const minusIcon = element.querySelector('.minus-icons');
    
    // Toggle the display of the icons
    if (plusIcon.style.display === 'none') {
      plusIcon.style.display = 'inline';
      minusIcon.style.display = 'none';
    } else {
      plusIcon.style.display = 'none';
      minusIcon.style.display = 'inline';
    }
  }

  window.toggleSearch2 = (resultsDivId) => {    
    const results = document.getElementById(resultsDivId);
    console.log(results)
    const isSearchBarVisible = results.style.display !== "none";
    console.log(isSearchBarVisible)
    results.style.display = isSearchBarVisible ? "none" : "";
  };




  // Get all table rows
// Select all table cells
  let emparr = [];


  window.employeeMatch = (lowId, highId, spanId) => {
    document.getElementById(spanId).classList.add("limit-disabled");
    let aclow = parseInt(document.getElementById(lowId).textContent);
    let achigh = parseInt(document.getElementById(highId).textContent);

    emparr.push(aclow);
    emparr.push(achigh);

    filterTableRows();
    employees();
  };

  const employees = () => {
    // Loop through emparr in steps of 2
    for (let i = 0; i < emparr.length; i += 2) {
      const clow = emparr[i];
      const chigh = emparr[i + 1];

      // Filter data based on the current aclow and achigh values
      const filteredItems = filterData.filter((item) => {
        return item.employees >= clow && item.employees <= chigh;
      });

      // Concatenate filteredItems to filterData array
      filterData = filteredItems;
    }

    displayPage(currentPage, filterData);

    const counter = document.getElementById("employees-search");
    filterCount++;
    counter.innerText = `x ${filterCount}`;
    counter.style.display = "";
    counter.style.backgroundColor = "white";

    counter.addEventListener("click", () => {
      filterCount = 0;
      counter.style.display = "none";
      filterTableRows();
    });

    updatePaginationSpans(
      currentPage,
      calculateTotalPages(filterData, rowsPerPage)
    );
  };

  employeesSearchLim.addEventListener("click", () => {
    const alllimit = document.querySelectorAll(".employees-limit");
    alllimit.forEach((element) => {
      element.classList.remove("limit-disabled");
    });

    emparr.length = 0;
  });

  window.yearMatch = (lowId, highId) => {
    let aclowValue = document.getElementById(lowId).value;
    let achighValue = document.getElementById(highId).value;

    // Parse the input values to integers
    let aclow = parseInt(aclowValue, 10);
    let achigh = parseInt(achighValue, 10);

    console.log(aclow);
    console.log(achigh);

    if (aclow < ylow || low === 0) {
      ylow = aclow;
    }
    if (achigh > yhigh || high === 0) {
      yhigh = achigh;
    }

    filterTableRows();
    year();
  };

  const year = () => {
    filterData = filterData.filter(
      (item) => item.founded_year >= ylow && item.founded_year <= yhigh
    );

    displayPage(currentPage, filterData);

    const ycounter = document.getElementById("year-search");

    yfilterCount++;
    ycounter.innerText = `x ${yfilterCount}`;
    ycounter.style.display = "";
    ycounter.style.backgroundColor = "white";

    ycounter.addEventListener("click", () => {
      yfilterCount = 0;
      filterTableRows();
    });

    updatePaginationSpans(
      currentPage,
      calculateTotalPages(filterData, rowsPerPage)
    );
  };

  yearSearchLim.addEventListener("click", () => {
    ylow = 0;
    yhigh = 0;
  });

  const tickall = document.querySelector(
    '.select-title input[type="checkbox"]'
  );

  tickall.addEventListener("click", () => {
    // Select all checkboxes with the class name 'select'
    const checkboxes = document.querySelectorAll(
      '.select input[type="checkbox"]'
    );

    // Iterate over each checkbox and set its checked property to true
    if (tickall.checked === true) {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
    } else {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
  });

  const fnresultsDiv = document.getElementById("first-name-search-results");
  const filterResults = (query) => {
    fnresultsDiv.innerHTML = "";
    const filteredData = data.filter((person) =>
      person.first_name.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredData.length > 0) {
      const ul = document.createElement("ul");
      filteredData.forEach((person) => {
        const li = document.createElement("li");
        li.textContent = person.first_name;
        li.addEventListener("click", () => {
          nameMatch(person.first_name);
        });
        ul.appendChild(li);
      });
      fnresultsDiv.appendChild(ul);
    } else {
      fnresultsDiv.innerHTML = "<p>No results found</p>";
    }
  };

  // Function for First Name Search

  const nameMatch = (FirstName) => {
    const resultsDiv = document.getElementById("first-name-search-results");
    resultsDiv.innerHTML = "";

    filterData = data.filter(
      (person) => person.first_name.toLowerCase() === FirstName.toLowerCase()
    );

    if (filterData.length > 0) {
      displayPage(currentPage, filterData);
    }
  };


  document.getElementById("first-name-input").addEventListener("input", (e) => {
    console.log(e.data);
    if (e.data === null) {
      fnresultsDiv.style.display = "none";
    } else {
      fnresultsDiv.style.display = "";
      filterResults(e.target.value);
    }
  });









// To display different menu Page
  const dashboardSection = document.querySelector('#dashboard-section')
  const searchSection = document.querySelector('#search-section')
  const cotactsSection = document.querySelector('#contacts-section')
  const listsSection = document.querySelector('#lists-section')
  const companiesSection = document.querySelector('#companies-section')
  const enrichSection = document.querySelector('#enrich-section')
  const verifySection = document.querySelector('#verify-section')
  const settingsSection = document.querySelector('#settings-section')
  const importSection = document.querySelector('#import-section')



  const menuDashboard = document.querySelector('#menu-dashboard')
  const menuSearch = document.querySelector('#menu-search')
  const menuCotacts = document.querySelector('#menu-contacts') 
  const menuLists = document.querySelector('#menu-list')
  const menuCompanies = document.querySelector('#menu-companies')
  const menuEnrich = document.querySelector('#menu-enrich')
  const menuVerify = document.querySelector('#menu-verify')
  const menuSettings = document.querySelector('#menu-settings')



  const basicInfo = document.getElementById('settings-basic-info');
  const plansBillings = document.getElementById('settings-plan-billing');
  const plansBillingsToggle = document.getElementById('plans-billings-toggle');



  menuDashboard.addEventListener('click',() =>{  
    dashboardSection.style.display = '';
    searchSection.style.display = 'none';
    cotactsSection.style.display = 'none';
    listsSection.style.display = 'none';
    companiesSection.style.display = 'none';
    enrichSection.style.display = 'none';
    verifySection.style.display = 'none';
    settingsSection.style.display = 'none';
    importSection.style.display = 'none'; 
  })


  menuSearch.addEventListener('click',() =>{
    searchSection.style.display = '';  
    dashboardSection.style.display = 'none';
    cotactsSection.style.display = 'none';
    listsSection.style.display = 'none';
    companiesSection.style.display = 'none';
    enrichSection.style.display = 'none';
    verifySection.style.display = 'none';
    settingsSection.style.display = 'none';
    importSection.style.display = 'none';  
  })

  menuCotacts.addEventListener('click',() =>{
    cotactsSection.style.display = '';
    dashboardSection.style.display = 'none';
    searchSection.style.display = 'none';
    listsSection.style.display = 'none';
    companiesSection.style.display = 'none';
    enrichSection.style.display = 'none'; 
    verifySection.style.display = 'none';
    settingsSection.style.display = 'none';
    importSection.style.display = 'none';  
  })
  menuLists.addEventListener('click',() =>{
    listsSection.style.display = '';
    dashboardSection.style.display = 'none';
    searchSection.style.display = 'none';
    cotactsSection.style.display = 'none';
    companiesSection.style.display = 'none';
    enrichSection.style.display = 'none';
    verifySection.style.display = 'none';
    settingsSection.style.display = 'none';
    importSection.style.display = 'none'; 
  })

  menuCompanies.addEventListener('click',() =>{
    companiesSection.style.display = '';
    dashboardSection.style.display = 'none';
    searchSection.style.display = 'none';
    cotactsSection.style.display = 'none';
    listsSection.style.display = 'none';
    enrichSection.style.display = 'none';
    verifySection.style.display = 'none';
    settingsSection.style.display = 'none';
    importSection.style.display = 'none'; 
  })

  menuEnrich.addEventListener('click',() =>{
    enrichSection.style.display = '';
    dashboardSection.style.display = 'none';
    searchSection.style.display = 'none';
    cotactsSection.style.display = 'none';
    companiesSection.style.display = 'none';
    listsSection.style.display = 'none';    
    verifySection.style.display = 'none';
    settingsSection.style.display = 'none';
    importSection.style.display = 'none'; 
  })

  menuVerify.addEventListener('click',() =>{
    verifySection.style.display = '';
    dashboardSection.style.display = 'none';
    searchSection.style.display = 'none';
    cotactsSection.style.display = 'none';
    listsSection.style.display = 'none';
    companiesSection.style.display = 'none';
    enrichSection.style.display = 'none';
    settingsSection.style.display = 'none';
    importSection.style.display = 'none';
     
  })


  
 

  menuSettings.addEventListener('click',() =>{
    settingsSection.style.display = '';
    importSection.style.display = 'none';
    verifySection.style.display = 'none';
    dashboardSection.style.display = 'none';
    searchSection.style.display = 'none';
    cotactsSection.style.display = 'none';
    listsSection.style.display = 'none';
    companiesSection.style.display = 'none';
    importSection.style.display = 'none';
    enrichSection.style.display = 'none';
    basicInfo.style.display = '';
    plansBillings.style.display = 'none';
     
  })





  window.importDisplay = () => {

    importSection.style.display = '';
    verifySection.style.display = 'none';
    dashboardSection.style.display = 'none';
    searchSection.style.display = 'none';
    cotactsSection.style.display = 'none';
    listsSection.style.display = 'none';
    companiesSection.style.display = 'none';
    settingsSection.style.display = 'none';
    enrichSection.style.display = 'none';
    
     
  }

  plansBillingsToggle.addEventListener('click', () => {
    basicInfo.style.display = 'none';
    plansBillings.style.display = '';
  })



  


  // Display different Search submenu 
 const searchLeads = document.querySelector('#search-leads');
  const searchCompanies = document.querySelector('#search-companies');

  const leadSection = document.querySelector('#lead-section');
  const companySection = document.querySelector('#company-section');


  searchCompanies.addEventListener('click',() =>{
    companySection.style.display = '';
    leadSection.style.display = 'none';
    savedSearchSection.style.display = 'none';
    
  })

  searchLeads.addEventListener('click',() =>{
    
    leadSection.style.display = '';
    companySection.style.display = 'none';
    savedSearchSection.style.display = 'none';
    
  })



// Function to check any checkbox and appear the edit options
 // Get all checkbox elements
  const contactsCheckboxes = document.querySelectorAll('.contacts-checkbox input[type="checkbox"]');

// Get the <thead> element by ID
const contactsHead = document.getElementById('contacts-table-head');
// const contactsThead = document.getElementById('contacts-table-thead');


// Add event listener to each checkbox
contactsCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', () => {
        // Check if any checkbox is checked
        const anyChecked = [...contactsCheckboxes].some(cb => cb.checked);

        // Set display of <thead> based on checkbox state
        // contactsThead.style.display = anyChecked ? 'none' : '';
        contactsHead.style.display = anyChecked ? '' : 'none' ;
        
    });
});







// Display different Search submenu 
const contactsTable = document.querySelector('.contacts-table');
const contactsProfileSection = document.getElementById('contacts-profile-section');

contactsTable.addEventListener('click', (event) => {
    const clickedElement = event.target;
    
    // Check if the clicked element is a <td> within the contacts table and not a checkbox or email
    if (clickedElement.tagName === 'TD' && !clickedElement.classList.contains('contacts-checkbox')) {
        // Toggle the display of contacts-profile-section
        contactsProfileSection.style.display = '';
    }
});



const enrichLF = document.getElementById('lead-form');
const enrichCF = document.getElementById('company-form');
const enrichLiF = document.getElementById('Lurl-form');
const enrichEF = document.getElementById('email-form');

const LFtab = document.getElementById('lead-form-tab');
const CFtab = document.getElementById('company-form-tab');
const LUrltab = document.getElementById('lurl-form-tab');
const EFtab = document.getElementById('email-form-tab');


LFtab.addEventListener('click',() => {
  enrichLF.style.display = '';
  enrichLF.classList.add = '';
  enrichCF.style.display = 'none';
  enrichLiF.style.display = 'none';
  enrichEF.style.display = 'none';
  CFtab.classList.remove('active');
  EFtab.classList.remove('active');
  LUrltab.classList.remove('active');
  LFtab.classList.add('active');
})

CFtab.addEventListener('click',() => {
  enrichCF.style.display = '';
  enrichLF.style.display = 'none';
  enrichLiF.style.display = 'none';
  enrichEF.style.display = 'none';
  LFtab.classList.remove('active');
  EFtab.classList.remove('active');
  LUrltab.classList.remove('active');
  CFtab.classList.add('active');
})

LUrltab.addEventListener('click',() => {
  enrichLiF.style.display = '';
  enrichCF.style.display = 'none';
  enrichLF.style.display = 'none';
  enrichEF.style.display = 'none';
  CFtab.classList.remove('active');
  EFtab.classList.remove('active');
  LFtab.classList.remove('active');
  LUrltab.classList.add('active');
})

EFtab.addEventListener('click',() => {
  enrichEF.style.display = '';
  enrichCF.style.display = 'none';
  enrichLF.style.display = 'none';
  enrichLiF.style.display = 'none';
  LFtab.classList.remove('active');
  CFtab.classList.remove('active');
  LUrltab.classList.remove('active');
  EFtab.classList.add('active');

})










  /*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
};
showMenu("nav-toggle", "nav-menu");

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id"),
      sectionsClass = document.querySelector(
        ".nav__menu a[href*=" + sectionId + "]"
      );

    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionsClass.classList.add("active-link");
    } else {
      sectionsClass.classList.remove("active-link");
    }
  });
};
window.addEventListener("scroll", scrollActive);

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2000,
  delay: 200,
      reset: true
});

sr.reveal(".home__data, .about__img, .skills__subtitle, .skills__text", {});
sr.reveal(".home__img, .about__subtitle, .about__text, .skills__img", {
  delay: 400,
});
sr.reveal(".home__social-icon", { interval: 200 });
sr.reveal(".skills__data, .work__img, .contact__input", { interval: 200 });


});

