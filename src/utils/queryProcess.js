export function setLinks(response, endpoint, prevPage, nextPage, params) {
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

export function formatResponse(response, page, limit, sort, query) {
	setCamps(response);
	const endpoint = 'http://localhost:8080/api/products';
	const prevPage = parseInt(page) - 1;
	const nextPage = parseInt(page) + 1;
	const limitParam = limit ? `limit=${limit}` : '';
	const sortParam = sort ? `&sort=${sort}` : '';
	const queryParam = query ? `&query=${query}` : '';
	const params = `${limitParam}${sortParam}${queryParam}`;
	setLinks(response, endpoint, prevPage, nextPage, params);
}
