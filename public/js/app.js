// API Base URL
const API_BASE = '/api';

// Utility functions
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

// Users Management
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        const users = await response.json();
        
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${formatDate(user.created_at)}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editUser(${user.id}, '${user.name}', '${user.email}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteUser(${user.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        document.getElementById('userCount').textContent = users.length;
    } catch (error) {
        console.error('Error loading users:', error);
        showAlert('Error loading users', 'danger');
    }
}

async function addUser() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    
    if (!name || !email) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email })
        });
        
        if (response.ok) {
            const user = await response.json();
            showAlert('User added successfully!');
            document.getElementById('addUserForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
            loadUsers();
        } else {
            const error = await response.json();
            showAlert(error.error || 'Error adding user', 'danger');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showAlert('Error adding user', 'danger');
    }
}

function editUser(id, name, email) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editUserName').value = name;
    document.getElementById('editUserEmail').value = email;
    
    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
}

async function updateUser() {
    const id = document.getElementById('editUserId').value;
    const name = document.getElementById('editUserName').value.trim();
    const email = document.getElementById('editUserEmail').value.trim();
    
    if (!name || !email) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email })
        });
        
        if (response.ok) {
            showAlert('User updated successfully!');
            bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
            loadUsers();
        } else {
            const error = await response.json();
            showAlert(error.error || 'Error updating user', 'danger');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        showAlert('Error updating user', 'danger');
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/users/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('User deleted successfully!');
            loadUsers();
        } else {
            const error = await response.json();
            showAlert(error.error || 'Error deleting user', 'danger');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showAlert('Error deleting user', 'danger');
    }
}

// Products Management
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.description || '-'}</td>
                <td>${formatPrice(product.price)}</td>
                <td>${product.category || '-'}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editProduct(${product.id}, '${product.name}', '${product.description || ''}', ${product.price}, '${product.category || ''}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteProduct(${product.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        document.getElementById('productCount').textContent = products.length;
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Error loading products', 'danger');
    }
}

async function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = document.getElementById('productPrice').value;
    const category = document.getElementById('productCategory').value.trim();
    
    if (!name || !price) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, price: parseFloat(price), category })
        });
        
        if (response.ok) {
            const product = await response.json();
            showAlert('Product added successfully!');
            document.getElementById('addProductForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
            loadProducts();
        } else {
            const error = await response.json();
            showAlert(error.error || 'Error adding product', 'danger');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showAlert('Error adding product', 'danger');
    }
}

function editProduct(id, name, description, price, category) {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductDescription').value = description;
    document.getElementById('editProductPrice').value = price;
    document.getElementById('editProductCategory').value = category;
    
    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
}

async function updateProduct() {
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value.trim();
    const description = document.getElementById('editProductDescription').value.trim();
    const price = document.getElementById('editProductPrice').value;
    const category = document.getElementById('editProductCategory').value.trim();
    
    if (!name || !price) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, price: parseFloat(price), category })
        });
        
        if (response.ok) {
            showAlert('Product updated successfully!');
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
            loadProducts();
        } else {
            const error = await response.json();
            showAlert(error.error || 'Error updating product', 'danger');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        showAlert('Error updating product', 'danger');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Product deleted successfully!');
            loadProducts();
        } else {
            const error = await response.json();
            showAlert(error.error || 'Error deleting product', 'danger');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Error deleting product', 'danger');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadUsers();
    loadProducts();
    
    // Add form submission handlers
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addUser();
    });
    
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addProduct();
    });
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}); 