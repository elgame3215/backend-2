const firstPageButton = document.getElementById('first-page-button');
const prevPageButton = document.getElementById('prev-page-button');
const nextPageButton = document.getElementById('next-page-button');
const lastPageButton = document.getElementById('last-page-button');

const firstPageUrl = new URL(window.location.href);
firstPageUrl.searchParams.set('page', 1);

const prevPageUrl = new URL(window.location.href);
const prevPage = prevPageButton.attributes.getNamedItem('page').value;
if (!prevPage) {
	prevPageButton.addEventListener('click', e => e.preventDefault());
}
prevPageUrl.searchParams.set('page', prevPage);

const nextPageUrl = new URL(window.location.href);
const nextPage = nextPageButton.attributes.getNamedItem('page').value;
if (!nextPage) {
	nextPageButton.addEventListener('click', e => e.preventDefault());
}
nextPageUrl.searchParams.set('page', nextPage);


const lastPageUrl = new URL(window.location.href);
const lastPage = lastPageButton.attributes.getNamedItem('page').value;
lastPageUrl.searchParams.set('page', lastPage);

firstPageButton.href = firstPageUrl;
prevPageButton.href = prevPageUrl;
nextPageButton.href = nextPageUrl;
lastPageButton.href = lastPageUrl;