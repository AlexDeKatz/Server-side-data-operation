const utility = {

    filterData: (dataSource, searchInput) => {
        return dataSource.filter(data => {
            return JSON.stringify(data).replace(/("\w+":)/g, '').toLowerCase().includes(searchInput.trim().toLowerCase())
        })
    },
    sortData: (dataSource, sortKey, sortOrder) => {
        return dataSource.sort((obj1, obj2) => {
            let compareResult = 0;
            if (obj1[sortKey] < obj2[sortKey]) {
                compareResult = -1
            } else if (obj1[sortKey] > obj2[sortKey]) {
                compareResult = 1
            }
            return compareResult * ((sortOrder === "asc") ? 1 : -1)
        });
    },
    pageData: (dataSource, pageNumber, pageSize) => {
        let initialPos = parseInt(pageNumber, 10) * parseInt(pageSize, 10);
        return dataSource.slice(initialPos, initialPos + parseInt(pageSize, 10))
    }
}

module.exports = utility;

