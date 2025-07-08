let users = [];
let roles = [];

async function loadUsers() {
    try {
        const response = await fetch(`/api/users`);
        users = await response.json();
        
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.host}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>
                    <button onclick="deleteUser('${user.username}', '${user.host}')">Delete</button>
                    <button onclick="editUser('${user.username}', '${user.host}')">Edit</button>
                </td>
            `;
        });

        populateGrantRoleUserDropdown();
        populateUserPrivilegesDropdown();
        populateTestUserDropdown();
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Failed to load users');
    }
}

async function createUser(event) {
    event.preventDefault();
    
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const host = document.getElementById('newHost').value;
    const role = document.getElementById('newUserRole').value;
    
    try {
        const response = await fetch(`/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, host, role: role || null })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            document.querySelector('form').reset();
            loadUsers();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Failed to create user');
    }
}

async function grantRoleToUser(event) {
    event.preventDefault();
    
    const userSelect = document.getElementById('grantRoleUser');
    const [username, host] = userSelect.value.split('@');
    const newRole = document.getElementById('grantRoleToUserRole').value;
    
    try {
        const response = await fetch(`/api/users/${username}/${encodeURIComponent(host)}/grant-role`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newRole })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            event.target.reset();
            loadUsers();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error granting role:', error);
        alert('Failed to grant role');
    }
}

async function revokeRoleFromUser(event) {
    event.preventDefault();
    
    const userSelect = document.getElementById('revokeRoleUser');
    const [username, host] = userSelect.value.split('@');
    const role = document.getElementById('revokeRoleFromUserRole').value;
    
    try {
        const response = await fetch(`/api/users/${username}/${encodeURIComponent(host)}/revoke-role`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            event.target.reset();
            loadUsers();
            // Clear the role dropdown
            document.getElementById('revokeRoleFromUserRole').innerHTML = '<option value="">Select Role to Revoke</option>';
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error revoking role:', error);
        alert('Failed to revoke role');
    }
}

async function loadUserRolesForRevoke() {
    const userSelect = document.getElementById('revokeRoleUser');
    const roleSelect = document.getElementById('revokeRoleFromUserRole');
    const [username, host] = userSelect.value.split('@');
    
    roleSelect.innerHTML = '<option value="">Select Role to Revoke</option>';
    
    if (!username || !host) return;
    
    try {
        const response = await fetch(`/api/privileges/user/${username}/${encodeURIComponent(host)}`);
        const result = await response.json();
        
        if (result.roles && result.roles.length > 0) {
            result.roles.forEach(role => {
                roleSelect.innerHTML += `<option value="${role}">${role}</option>`;
            });
        }
    } catch (error) {
        console.error('Error loading user roles:', error);
    }
}

async function deleteUser(username, host) {
    if (confirm(`Are you sure you want to delete user ${username}@${host}?`)) {
        try {
            const encodedHost = encodeURIComponent(host);
            const response = await fetch(`/api/users/${username}/${encodedHost}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(result.message);
                loadUsers();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    }
}

async function editUser(username, host) {
    const newRole = prompt(`Enter new role for ${username}:`);
    if (newRole) {
        try {
            const encodedHost = encodeURIComponent(host);
            const response = await fetch(`/api/users/${username}/${encodedHost}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newRole })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(result.message);
                loadUsers();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    }
}

async function loadRoles() {
    try {
        const response = await fetch(`/api/roles`);
        roles = await response.json();
        
        const tbody = document.getElementById('rolesTableBody');
        tbody.innerHTML = '';
        
        roles.forEach(role => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${role.name}</td>
                <td>${role.userCount}</td>
                <td>
                    <button onclick="deleteRole('${role.name}')">Delete</button>
                </td>
            `;
        });
        
        updateRoleDropdowns();
    } catch (error) {
        console.error('Error loading roles:', error);
        alert('Failed to load roles');
    }
}

async function createRole(event) {
    event.preventDefault();
    
    const roleName = document.getElementById('newRoleName').value;
    
    try {
        const response = await fetch(`/api/roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roleName })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            event.target.reset();
            loadRoles();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error creating role:', error);
        alert('Failed to create role');
    }
}

async function deleteRole(roleName) {
    if (confirm(`Are you sure you want to delete role ${roleName}?`)) {
        try {
            const response = await fetch(`/api/roles/${roleName}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(result.message);
                loadRoles();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error deleting role:', error);
            alert('Failed to delete role');
        }
    }
}

async function loadTables() {
    try {
        const response = await fetch('/api/tables');
        const tables = await response.json();
        
        const tableSelect = document.getElementById('privilegeTable');
        tableSelect.innerHTML = '<option value="">Select Table</option>';
        tableSelect.innerHTML += '<option value="*">All Tables</option>';
        
        tables.forEach(table => {
            tableSelect.innerHTML += `<option value="${table.name}">${table.name}</option>`;
        });
    } catch (error) {
        console.error('Error loading tables:', error);
    }
}

function updateRoleDropdowns() {
    const privilegeRoleSelect = document.getElementById('privilegeRole');
    const viewPrivilegesRoleSelect = document.getElementById('viewPrivilegesRole');
    const grantRoleToUserRoleSelect = document.getElementById('grantRoleToUserRole');
    
    privilegeRoleSelect.innerHTML = '<option value="">Select Role</option>';
    viewPrivilegesRoleSelect.innerHTML = '<option value="">Select Role to View Privileges</option>';
    grantRoleToUserRoleSelect.innerHTML = '<option value="">Select Role</option>';
    
    roles.forEach(role => {
        privilegeRoleSelect.innerHTML += `<option value="${role.name}">${role.name}</option>`;
        viewPrivilegesRoleSelect.innerHTML += `<option value="${role.name}">${role.name}</option>`;
        grantRoleToUserRoleSelect.innerHTML += `<option value="${role.name}">${role.name}</option>`;
    });

    populateNewUserRoleDropdown();
    populateGrantRoleUserDropdown();
}

function populateNewUserRoleDropdown() {
    const newUserRoleSelect = document.getElementById('newUserRole');
    newUserRoleSelect.innerHTML = '<option value="">Select Role (Optional)</option>';
    
    roles.forEach(role => {
        newUserRoleSelect.innerHTML += `<option value="${role.name}">${role.name}</option>`;
    });
}

function populateGrantRoleUserDropdown() {
    const grantRoleUserSelect = document.getElementById('grantRoleUser');
    const revokeRoleUserSelect = document.getElementById('revokeRoleUser');
    
    grantRoleUserSelect.innerHTML = '<option value="">Select User</option>';
    revokeRoleUserSelect.innerHTML = '<option value="">Select User</option>';
    
    users.forEach(user => {
        const userOption = `<option value="${user.username}@${user.host}">${user.username}@${user.host}</option>`;
        grantRoleUserSelect.innerHTML += userOption;
        revokeRoleUserSelect.innerHTML += userOption;
    });
}

function populateUserPrivilegesDropdown() {
    const viewPrivilegesUserSelect = document.getElementById('viewPrivilegesUser');
    viewPrivilegesUserSelect.innerHTML = '<option value="">Select User to View Privileges</option>';
    
    users.forEach(user => {
        viewPrivilegesUserSelect.innerHTML += `<option value="${user.username}@${user.host}">${user.username}@${user.host}</option>`;
    });
}

async function viewUserPrivileges() {
    const userSelect = document.getElementById('viewPrivilegesUser');
    const [username, host] = userSelect.value.split('@');
    const display = document.getElementById('userPrivilegesDisplay');
    
    if (!username || !host) {
        display.innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch(`/api/privileges/user/${username}/${encodeURIComponent(host)}`);
        const result = await response.json();
        
        let html = '<h4>Privileges for ' + username + '@' + host + ':</h4>';
        
        if (result.roles && result.roles.length > 0) {
            html += '<h5>Roles:</h5><ul>';
            result.roles.forEach(role => {
                html += '<li>' + role + '</li>';
            });
            html += '</ul>';
        } else {
            html += '<p>No roles assigned</p>';
        }
        
        if (result.privileges && result.privileges.length > 0) {
            html += '<h5>Direct Privileges:</h5><ul>';
            result.privileges.forEach(privilege => {
                html += '<li>' + privilege + '</li>';
            });
            html += '</ul>';
        } else {
            html += '<p>No direct privileges found</p>';
        }
        
        display.innerHTML = html;
    } catch (error) {
        console.error('Error fetching user privileges:', error);
        display.innerHTML = '<p>Error loading privileges</p>';
    }
}

async function grantPrivileges(event) {
    event.preventDefault();
    
    const role = document.getElementById('privilegeRole').value;
    const table = document.getElementById('privilegeTable').value;

    const privilegeLevel = document.querySelector('input[name="privilegeLevel"]:checked').value;
    
    const privileges = [];

    if (privilegeLevel === 'specific') {
        if (document.getElementById('privSelect').checked) privileges.push('SELECT');
        if (document.getElementById('privInsert').checked) privileges.push('INSERT');
        if (document.getElementById('privUpdate').checked) privileges.push('UPDATE');
        if (document.getElementById('privDelete').checked) privileges.push('DELETE');
        if (document.getElementById('privCreate').checked) privileges.push('CREATE');
        if (document.getElementById('privDrop').checked) privileges.push('DROP');
        if (document.getElementById('privAlter').checked) privileges.push('ALTER');
        if (document.getElementById('privIndex').checked) privileges.push('INDEX');
        if (document.getElementById('privReferences').checked) privileges.push('REFERENCES');
        if (document.getElementById('privExecute').checked) privileges.push('EXECUTE');
        if (document.getElementById('privShowView').checked) privileges.push('SHOW VIEW');
        if (document.getElementById('privCreateView').checked) privileges.push('CREATE VIEW');
        if (document.getElementById('privEvent').checked) privileges.push('EVENT');
        if (document.getElementById('privTrigger').checked) privileges.push('TRIGGER');
        if (document.getElementById('privLockTables').checked) privileges.push('LOCK TABLES');
        if (document.getElementById('privGrantOption').checked) privileges.push('GRANT OPTION');
        
        if (privileges.length === 0) {
            alert('Please select at least one privilege!');
            return;
        }
    } 
    else if (privilegeLevel === 'all') privileges.push('ALL PRIVILEGES');
    else if (privilegeLevel === 'all_with_grant') privileges.push('ALL PRIVILEGES WITH GRANT OPTION');
    
    try {
        const response = await fetch(`/api/privileges`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role, table, privileges })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            event.target.reset();
            document.getElementById('specificPrivileges').checked = true;
            togglePrivilegeSelection();
            await viewRolePrivileges();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error granting privileges:', error);
        alert('Failed to grant privileges');
    }
}

async function viewRolePrivileges() {
    const role = document.getElementById('viewPrivilegesRole').value;
    const display = document.getElementById('privilegesDisplay');
    
    if (!role) {
        display.innerHTML = '';
        return;
    }
    
    try {
        const response = await fetch(`/api/privileges/${role}`);
        const privileges = await response.json();
        
        if (privileges.length === 0) {
            display.innerHTML = '<p>No privileges found for this role.</p>';
            return;
        }
        
        let html = '<h4>Privileges for ' + role + ':</h4><ul>';
        privileges.forEach(privilege => {
            html += '<li>' + privilege + '</li>';
        });
        html += '</ul>';
        
        display.innerHTML = html;
    } catch (error) {
        console.error('Error fetching privileges:', error);
        display.innerHTML = '<p>Error loading privileges</p>';
    }
}

function togglePrivilegeSelection() {
    const privilegeGrid = document.getElementById('privilegeGrid');
    const specificPrivileges = document.getElementById('specificPrivileges');
    
    if (specificPrivileges.checked) {
        privilegeGrid.style.display = 'grid';
    } else {
        privilegeGrid.style.display = 'none';
    }
}

let currentTestUser = null;
let currentTestPassword = null;

function populateTestUserDropdown() {
    const testLoginUserSelect = document.getElementById('testLoginUser');
    testLoginUserSelect.innerHTML = '<option value="">Select User</option>';
    
    users.forEach(user => {
        testLoginUserSelect.innerHTML += `<option value="${user.username}@${user.host}">${user.username}@${user.host}</option>`;
    });
}

async function testUserLogin(event) {
    event.preventDefault();
    
    const userSelect = document.getElementById('testLoginUser');
    const [username, host] = userSelect.value.split('@');
    const password = document.getElementById('testLoginPassword').value;
    const resultDiv = document.getElementById('loginResult');
    
    try {
        const response = await fetch('/api/test/connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, host, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            resultDiv.innerHTML = `<div class="success">${result.message}</div>`;
            currentTestUser = username;
            currentTestPassword = password;
            document.getElementById('operationTestSection').style.display = 'block';
            populateTestOperationTables();
        } else {
            resultDiv.innerHTML = `<div class="error">Login failed: ${result.error}</div>`;
            document.getElementById('operationTestSection').style.display = 'none';
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        document.getElementById('operationTestSection').style.display = 'none';
    }
}

async function populateTestOperationTables() {
    try {
        const response = await fetch('/api/tables');
        const tables = await response.json();
        
        const tableSelect = document.getElementById('testOperationTable');
        tableSelect.innerHTML = '<option value="">Select Table</option>';
        
        tables.forEach(table => {
            tableSelect.innerHTML += `<option value="${table.name}">${table.name}</option>`;
        });
    } catch (error) {
        console.error('Error loading tables for testing:', error);
    }
}

async function testOperation(event) {
    event.preventDefault();
    
    const operation = document.getElementById('operationSelect').value;
    const table = document.getElementById('testOperationTable').value;
    const logDiv = document.getElementById('testLog');
    
    if (!currentTestUser || !currentTestPassword) {
        alert('Please login first');
        return;
    }
    
    try {
        const response = await fetch('/api/test/operation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: currentTestUser, 
                password: currentTestPassword, 
                operation, 
                table 
            })
        });
        
        const result = await response.json();
        
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.style.marginBottom = '10px';
        logEntry.style.padding = '10px';
        logEntry.style.borderRadius = '4px';
        logEntry.style.border = '1px solid #ddd';
        
        if (result.success) {
            logEntry.className = 'success';
            logEntry.innerHTML = `
                <strong>[${timestamp}] SUCCESS:</strong> ${operation} on ${table}<br>
                <em>Result: ${result.message}</em>
            `;
        } else {
            logEntry.className = 'error';
            logEntry.innerHTML = `
                <strong>[${timestamp}] FAILED:</strong> ${operation} on ${table}<br>
                <em>Error: ${result.error}</em>
            `;
        }
        
        logDiv.insertBefore(logEntry, logDiv.firstChild);
        
    } catch (error) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'error';
        logEntry.style.marginBottom = '10px';
        logEntry.style.padding = '10px';
        logEntry.innerHTML = `<strong>[${timestamp}] ERROR:</strong> ${error.message}`;
        logDiv.insertBefore(logEntry, logDiv.firstChild);
    }
}

window.onload = function() {
    loadUsers();
    loadRoles();
    loadTables();
    
    setTimeout(() => {
        populateTestUserDropdown();
    }, 1000);
};