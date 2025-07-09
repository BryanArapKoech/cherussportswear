// public/js/products.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    const productsTableBody = document.querySelector('#products-table tbody');
    const addProductBtn = document.getElementById('add-product-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const closeBtn = document.querySelector('.close-btn');
    const productForm = document.getElementById('product-form');
    const modalError = document.getElementById('modal-error-message');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products', { headers });
            if (res.status >= 401) {
                localStorage.removeItem('admin_token');
                window.location.href = '/index.html';
                return;
            }
            const products = await res.json();
            productsTableBody.innerHTML = '';
            products.forEach(product => {
                const row = `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.sku}</td>
                        <td>${product.name}</td>
                        <td>${product.price}</td>
                        <td>${product.inventory_count}</td>
                        <td>
                            <button class="edit-btn" data-id="${product.id}">Edit</button>
                        </td>
                    </tr>
                `;
                productsTableBody.innerHTML += row;
            });
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const openModal = (product = null) => {
        modalError.textContent = '';
        productForm.reset();
        if (product) {
            modalTitle.textContent = 'Edit Product';
            document.getElementById('product-id').value = product.id;
            document.getElementById('name').value = product.name;
            document.getElementById('sku').value = product.sku;
            document.getElementById('price').value = product.price;
            document.getElementById('inventory').value = product.inventory_count;
            document.getElementById('description').value = product.description || '';
        } else {
            modalTitle.textContent = 'Add New Product';
            document.getElementById('product-id').value = '';
        }
        modal.style.display = 'block';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    addProductBtn.addEventListener('click', () => openModal());
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => e.target === modal && closeModal());

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        modalError.textContent = '';
        
        const id = document.getElementById('product-id').value;
        const productData = {
            name: document.getElementById('name').value,
            sku: document.getElementById('sku').value,
            price: parseFloat(document.getElementById('price').value),
            inventory_count: parseInt(document.getElementById('inventory').value, 10),
            description: document.getElementById('description').value
        };

        const url = id ? `/api/products/${id}` : '/api/products';
        const method = id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method, headers, body: JSON.stringify(productData) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save product');
            closeModal();
            fetchProducts();
        } catch (err) {
            modalError.textContent = err.message;
        }
    });

    productsTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            try {
                const res = await fetch(`/api/products/${id}`, { headers });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || 'Could not fetch product details.');
                }
                const product = await res.json();
                openModal(product);
            } catch (err) {
                console.error('Error fetching product details:', err);
                alert('Could not load product data. Please try again.');
            }
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('admin_token');
        window.location.href = '/index.html';
    });

    fetchProducts();
});