// script.js
document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const profilePicInput = document.getElementById('profilePic');
    const profilePicPreview = document.getElementById('profilePicPreview');
    const updateProfileForm = document.getElementById('updateProfileForm');
    const updateProfilePicInput = document.getElementById('updateProfilePic');
    const updateProfilePicPreview = document.getElementById('updateProfilePicPreview');
    const profilesContainer = document.getElementById('profilesContainer');

    const ADMIN_EMAIL = 'admin@admin.com';
    const ADMIN_PASSWORD = 'admin123';

    function showAlert(message) {
        alert(message);
    }

    function isAdmin() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser && currentUser.role === 'admin';
    }

    // Profile picture preview for registration
    if (profilePicInput) {
        profilePicInput.addEventListener('change', () => {
            const file = profilePicInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePicPreview.src = e.target.result;
                    profilePicPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Profile picture preview for profile update
    if (updateProfilePicInput) {
        updateProfilePicInput.addEventListener('change', () => {
            const file = updateProfilePicInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    updateProfilePicPreview.src = e.target.result;
                    updateProfilePicPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Handle registration form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(registrationForm);
            const user = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                number: formData.get('number'),
                rashi: formData.get('rashi'),
                nakshatra: formData.get('nakshatra'),
                birthDate: formData.get('birthDate'),
                age: formData.get('age'),
                locality: formData.get('locality'),
                address: formData.get('address'),
                height: formData.get('height'),
                weight: formData.get('weight'),
                profilePic: profilePicPreview.src,
                role: 'user'
            };
            localStorage.setItem(user.email, JSON.stringify(user));
            showAlert('Registration successful');
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');
            const loginType = formData.get('loginType');

            if (loginType === 'admin') {
                if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    const admin = {
                        email: ADMIN_EMAIL,
                        username: 'Admin',
                        role: 'admin',
                        profilePic: 'path/to/admin/pic.jpg' // Add a path to the admin profile picture
                    };
                    localStorage.setItem('currentUser', JSON.stringify(admin));
                    showAlert('Admin login successful');
                    window.location.href = 'profiles.html';  // Redirect to Profiles page
                } else {
                    showAlert('Admin credentials are incorrect');
                }
            } else if (loginType === 'user') {
                const storedUser = localStorage.getItem(email);
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    if (user.password === password) {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        showAlert('Login successful');
                        window.location.href = 'profiles.html';  // Redirect to Profiles page
                    } else {
                        showAlert('Incorrect password');
                    }
                } else {
                    showAlert('User not found');
                }
            } else {
                showAlert('Please select a login type');
            }
        });
    }

    // Handle forgot password form submission
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const storedUser = localStorage.getItem(email);

            if (storedUser) {
                // Simulate sending a password reset link
                showAlert('A password reset link has been sent to your email address.');
            } else {
                showAlert('User not found');
            }
        });
    }

    // Display profiles on profiles page
    if (profilesContainer) {
        Object.keys(localStorage).forEach((key) => {
            const user = JSON.parse(localStorage.getItem(key));
            const profileDiv = document.createElement('div');
            profileDiv.className = 'profile';
            profileDiv.innerHTML = `
                <img src="${user.profilePic}" alt="${user.username}'s Profile Picture" style="width: 100px; height: 100px;">
                <h3>${user.username}</h3>
                <p>Email: ${user.email}</p>
                <p>Contact Number: ${user.number}</p>
                <p>Rashi: ${user.rashi}</p>
                <p>Nakshatra: ${user.nakshatra}</p>
                <p>Birth Date: ${user.birthDate}</p>
                <p>Age: ${user.age}</p>
                <p>Locality: ${user.locality}</p>
                <p>Address: ${user.address}</p>
                <p>Height: ${user.height}</p>
                <p>Weight: ${user.weight}</p>
                ${isAdmin() ? `
                <button class="updateBtn" data-email="${user.email}">Update</button>
                <button class="deleteBtn" data-email="${user.email}">Delete</button>
                ` : ''}
            `;
            profilesContainer.appendChild(profileDiv);
        });

        // Admin only: Delete user profiles
        if (isAdmin()) {
            document.querySelectorAll('.deleteBtn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const email = e.target.getAttribute('data-email');
                    localStorage.removeItem(email);
                    e.target.parentElement.remove();
                    showAlert('Profile deleted');
                });
            });

            // Admin only: Update user profiles
            document.querySelectorAll('.updateBtn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const email = e.target.getAttribute('data-email');
                    window.location.href = `update-profile.html?email=${email}`;
                });
            });
        }
    }

    // Handle profile update
    if (updateProfileForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const user = JSON.parse(localStorage.getItem(email));

        if (user) {
            document.getElementById('updateUsername').value = user.username;
            document.getElementById('updateEmail').value = user.email;
            document.getElementById('updatePassword').value = user.password;
            if (user.profilePic) {
                updateProfilePicPreview.src = user.profilePic;
                updateProfilePicPreview.style.display = 'block';
            }

            // Admin only: Allow profile update
            if (isAdmin()) {
                updateProfileForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(updateProfileForm);
                    const updatedUser = {
                        username: formData.get('username'),
                        email: formData.get('email'),
                        password: formData.get('password'),
                        profilePic: updateProfilePicPreview.src,
                    };
                    localStorage.setItem(updatedUser.email, JSON.stringify(updatedUser));
                    showAlert('Profile updated successfully');
                    window.location.href = 'profiles.html';
                });
            } else {
                showAlert('You are not authorized to update profiles');
                window.location.href = 'profiles.html';
            }
        }
    }
});
