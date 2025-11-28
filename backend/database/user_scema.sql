-- 1. Define the Division (Crucial for logic: "Manager is head of division")
CREATE TABLE division (
    divisionID INT AUTO_INCREMENT PRIMARY KEY,
    divisionName VARCHAR(100) NOT NULL UNIQUE, -- e.g., "IT Department", "HR"
    location VARCHAR(100)
);

-- 2. Define the Role
CREATE TABLE role (
    roleID INT AUTO_INCREMENT PRIMARY KEY,
    roleName VARCHAR(50) NOT NULL UNIQUE -- Typo fixed: romeName -> roleName
);

-- 3. Define Permission
CREATE TABLE permission (
    permissionID INT AUTO_INCREMENT PRIMARY KEY,
    permissionName VARCHAR(60) NOT NULL UNIQUE, -- e.g., 'approve_request', 'view_audit'
    description VARCHAR(255)
);

-- 4. Role-Permission Junction (Many-to-Many)
CREATE TABLE rolePermission (
    roleID INT NOT NULL,
    permissionID INT NOT NULL,
    PRIMARY KEY (roleID, permissionID), -- CORRECT: Composite Key
    FOREIGN KEY (roleID) REFERENCES role(roleID) ON DELETE CASCADE,
    FOREIGN KEY (permissionID) REFERENCES permission(permissionID) ON DELETE CASCADE
);

-- 5. User Table (Enhanced for Hybrid Sync)
CREATE TABLE user (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL, -- Removed UNIQUE (Security best practice: salts make hashes unique, but DB shouldn't enforce it)
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    isBlocked BOOLEAN DEFAULT FALSE, -- User Status
    isOnline BOOLEAN DEFAULT FALSE, -- For Hybrid Sync: Online/Offline status
    
    -- Relations
    roleID INT,
    divisionID INT, -- Added: Needed for "Check Division Availability" logic
    
    -- Hybrid Architecture Fields (For Thiranjaya's Scope)
    fcmToken VARCHAR(255), -- For sending Push Notifications to Mobile (Online)
    socketId VARCHAR(255), -- For sending alerts to Web Dashboard (Offline/Local)
    refreshToken VARCHAR(255), -- For keeping mobile logged in securely
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Essential for Sync
    
    FOREIGN KEY (roleID) REFERENCES role(roleID),
    FOREIGN KEY (divisionID) REFERENCES division(divisionID)
);

-- Update Division to link to its Head (Manager)
ALTER TABLE division ADD COLUMN headOfDivisionID INT;
ALTER TABLE division ADD FOREIGN KEY (headOfDivisionID) REFERENCES user(userID);