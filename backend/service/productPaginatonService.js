import Product from '../model/product.js';
import getPagination from '../utils/pagination.js';


export const getRandomProducts = async () => {
  const products = await Product.aggregate([
    {
      $sample: {
        size: 8
      }
    }
  ]);

  return products;
};

// Supported sort keys -> mongoose sort object
const SORT_MAP = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 }
};

export const getProducts = async (queryParams) => {

    const { page, limit, search, sort, minPrice, maxPrice, inStock } = queryParams;

    const {
        currentPage,
        perPage,
        skip
    } = getPagination(page, limit);

    // Build filter
    const filter = {};

    if (search) {
        filter.name = { $regex: String(search).trim(), $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined && !Number.isNaN(Number(minPrice))) {
            filter.price.$gte = Number(minPrice);
        }
        if (maxPrice !== undefined && !Number.isNaN(Number(maxPrice))) {
            filter.price.$lte = Number(maxPrice);
        }
        if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    if (inStock === 'true') {
        filter.stock = { $gt: 0 };
    }

    const sortQuery = SORT_MAP[sort] || SORT_MAP.newest;

    const [products, totalProducts] = await Promise.all([
        Product.find(filter)
            .sort(sortQuery)
            .skip(skip)
            .limit(perPage),

        Product.countDocuments(filter)
    ]);

    const totalPages = Math.max(Math.ceil(totalProducts / perPage), 1);

    return {
        products,
        pagination: {
            currentPage,
            limit: perPage,
            totalProducts,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1
        }
    };
};
