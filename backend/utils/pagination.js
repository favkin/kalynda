const getPagination = (page, limit) => {
    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Number(limit) || 20, 50);

    const skip = (currentPage - 1) * perPage;

    return {
        currentPage,
        perPage,
        skip
    };
};

export default getPagination;