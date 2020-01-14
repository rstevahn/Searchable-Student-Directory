/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/
   
// First, wait for the page content to load

window.addEventListener ('DOMContentLoaded', () => {

   /*** 
      Globals
   ***/

   const studentList = document.querySelectorAll('.student-item'); // get the list of student items
   const studentsPerPage = 10; // display up to 10 students per page

   // Additional globals for 'Exceeds Expectations' additions
   // Note:
   // The easiest way to implement the search function was to add a second global list for search results,
   // and then add a new 'active list' global that switches between the original student list
   // and the search results. This swapping is performed only inside the 'searchList' function.
   // For this reason, I have refactored many of the original functions to no longer take a list parameter,
   // as they all need to use the 'active list' now.

   let searchResults = []; // this will be populated during a search
   let activeList = studentList; // the active list will be changed to searchResults during a search

   /*** 
      This function displays the requested page by looping through
      the active list, and adjusting the display property of each
      element appropriately. It then updates the page navigation bar
      to make the current page the active page
   ***/

   function showPage (page) {

      // get the list of page navigation elements which will be updated at the end of this function

      const pageDiv = document.querySelector ('div.pagination');
      const pageElements = pageDiv.querySelectorAll ('li');

      // calculate the start and end indices

      let endIndex = page * studentsPerPage; // assume pages 1 - n, no error check
      const startIndex = endIndex - studentsPerPage; // will never be less than 0
      
      // limit the endIndex value to the length of the active list

      endIndex = Math.min (endIndex, activeList.length);

      // iterate through all list items, adjusting the display property
      // as needed

      for (let i = 0; i < activeList.length; i++) {
         if (i < startIndex || i >= endIndex) { // hide this element
            activeList[i].style.display = 'none';
         } else { // display this element
            activeList[i].style.display = '';
         }
      }

      // Loop through each page navigation element, making all of them inactive except 
      // for the target element

      for (let i = 0; i < pageElements.length; i++) {
         if (i === page - 1) {
            pageElements[i].firstElementChild.className = 'active';
         } else {
            pageElements[i].firstElementChild.className = '';
         }
      }
   }   

   /***
         This function generates, appends and adds functionality to the search bar
   ***/

   function appendSearchBar () {

      // we'll append the search bar to the page-header div element

      const headerDiv = document.querySelector ('div.page-header'); // select the 'page-header' div
       
      // create the new elements that we need

      const searchDiv = document.createElement ('div'); // the new div we are going to append
      const textEntry = document.createElement ('input'); // the text entry field
      const button = document.createElement ('button'); // the search button
      const p = document.createElement ('p'); // the error message when an empty list is returned

      // add details to the new elements

      searchDiv.className = 'student-search';
      textEntry.setAttribute ('placeholder', 'Search for students...');
      button.textContent = 'Search';
      p.textContent = 'No search results -- try another search string';
      p.style.color = 'red'; // draw attention to the error message
      p.style.display = 'none'; // start out with the error message hidden

      // append the child elements to the search div

      searchDiv.appendChild (textEntry);
      searchDiv.appendChild (button);
      searchDiv.appendChild (p);

      // append the search div to the header div
     
      headerDiv.appendChild (searchDiv);

      // function to adjust the page navigation elements to display only the needed elements 
      // for the active list

      function adjustPagination () {

         const pageDiv = document.querySelector ('div.pagination'); // select the pagination division
         const lis = pageDiv.querySelectorAll ('li'); // put all of the list items into an array
         const searchDiv = document.querySelector ('div.student-search'); // select the search division
         const p = searchDiv.querySelector ('p'); // select the error message for when the list is empty
         const pages = Math.ceil(activeList.length / studentsPerPage); // display this many page selection elements

         // Adjust the display values of the pagination elements
         // based on the length of the active list. We will only
         // display page navigation elements if there are 2 or more pages.

         for (let i = 0; i < lis.length; i++) {
            if (i > pages - 1 || pages === 1) {
               lis[i].style.display = 'none';
            } else {
               lis[i].style.display = '';
            }
         }

         // if the active list is empty, display the error message under the search bar
         
         if (activeList.length === 0) {
            p.style.display = ''; // display the 'no search results' message
         } else {
            p.style.display = 'none'; // hide the message
         }
      }

      // function to initiate or update a search. This function also takes care of toggling
      // the 'active list' between the original 'student list' and the 'search results' 
      // depending on whether or not a search is (still) in progress.

      function searchList (value) {

         if (value === '') { // an empty search string means the search is over

            activeList = studentList; // make the full student list the active list
            adjustPagination(); // adjust the page navigation elements
            return; // return
         }
         
         // initilize the search results

         searchResults = [];

         // iterate through the student list, appending matches to the search results

         for (let i = 0; i < studentList.length; i++) {
            const studentName = studentList[i].querySelector('h3'); // the student name is stored here in the list item
            if (studentName.textContent.indexOf (value) > -1) { // add to the results list
               searchResults.push (studentList[i]);
            } else { // make sure this element is not displayed
               studentList[i].style.display = 'none';
            }
         }

         // update the active list and the page navigation elements

         activeList = searchResults;
         adjustPagination ();
      }

      // add 'keyup' listener to the text entry field

      textEntry.addEventListener ('keyup', (e) => {

         // search the list for the current value of the text input field
         
         searchList (e.target.value);

         // update the display

         showPage (1);
      });

      // add 'click' listener to the button

      button.addEventListener ('click', (e) => {

         // search the list for the current value of the text input field

         searchList (textEntry.value);

         // update the display

         showPage (1);
      });
      
   }

   /*** 
      Function to generate, append, and add 
      functionality to the pagination buttons.
   ***/

   function appendPageLinks() {

      const parentDiv = document.querySelector('div.page'); // this gets us to our parent div that we will append to
      const pages = Math.ceil(studentList.length / studentsPerPage); // we need this many pages

      // create the new elements that we will append

      const pageDiv = document.createElement ('div');
      const ul = document.createElement ('ul');

      // add the correct class to this div element, then append the ul to the div and the div to our parent
      
      pageDiv.setAttribute ('class', 'pagination');
      pageDiv.appendChild (ul);
      parentDiv.appendChild (pageDiv);

      // For each page, create a list item element and link (href=# and content set to the page number).
      // Set up a click listener for each element. This is how the user selects the page they wish to view.

      for (let i = 0; i < pages; i++) {

         // create a new list item and link

         const li = document.createElement ('li');
         const a = document.createElement ('a');

         // add details to the new elements
         if (i === 0) { // start with page 1 as the active element
            a.className ='active';
         }
         a.setAttribute ('href','#');
         a.textContent = i+1; // this is the page number for this element

         // append the new items to the DOM

         li.appendChild (a); // append the link to the list item
         ul.appendChild (li); // append the list item to the list

         // add a 'click' event listener for this page navigation element

         a.addEventListener ('click', (e) => {

            // Display the page corresponding to the page number of this element

            showPage (e.target.textContent);
         });
      }
   }

   /***
    * Main Program, short and sweet
    ***/

   appendSearchBar(); // add the search bar
   appendPageLinks(); // add the page navigation bar
   showPage (1); // show the first page of the list
   
}); // end DOMContentLoaded event
