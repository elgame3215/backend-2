export function setLinks(response, endpoint, prevPage, params, nextPage) {
	response.prevLink = response.hasPrevPage ? `${endpoint}?page=${prevPage}&${params}` : null;
	response.nextLink = response.hasNextPage ? `${endpoint}?page=${nextPage}&${params}` : null;
}

export function setCamps(response) {
	response.status = 'success'
	response.payload = response.docs
	delete response.docs;
	delete response.totalDocs;
	delete response.limit;
	delete response.pagingCounter;
}
