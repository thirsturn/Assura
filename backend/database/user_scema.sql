-- 1. Define the Division
-- logic: "Manager is head of division"
-- CHANGE: headOfDivisionID is defined here but added later via ALTER to prevent creation errors.
CREATE TABLE division (
    divisionID INT AUTO_INCREMENT PRIMARY KEY,
    divisionName VARCHAR(100) NOT NULL UNIQUE,
    locationCode VARCHAR(50) -- Added: Helpful for Step 3 (finding items by location)
);

-- 2. Define the Role
CREATE TABLE role (
    roleID INT AUTO_INCREMENT PRIMARY KEY,
    roleName VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Define Permission (RBAC)
CREATE TABLE permission (
    permissionID INT AUTO_INCREMENT PRIMARY KEY,
    permissionName VARCHAR(60) NOT NULL UNIQUE, 
    description VARCHAR(255)
);

-- 4. Role-Permission Junction
CREATE TABLE rolePermission (
    roleID INT NOT NULL,
    permissionID INT NOT NULL,
    PRIMARY KEY (roleID, permissionID),
    FOREIGN KEY (roleID) REFERENCES role(roleID) ON DELETE CASCADE,
    FOREIGN KEY (permissionID) REFERENCES permission(permissionID) ON DELETE CASCADE
);

-- 5. User Table
CREATE TABLE user (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    
    -- Status Fields
    isBlocked BOOLEAN DEFAULT FALSE,
    isOnline BOOLEAN DEFAULT FALSE, 
    
    -- Relations
    roleID INT,
    divisionID INT, 
    
    -- Hybrid Architecture Fields (CRITICAL for Step 11)
    fcmToken VARCHAR(255),    -- Mobile Push Notifications (Online)
    socketId VARCHAR(255),    -- Web Socket ID (Offline Intranet)
    refreshToken VARCHAR(255), -- Security
    
    -- Auditing
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    lastLogin TIMESTAMP NULL, -- Added: Good for security auditing
    
    FOREIGN KEY (roleID) REFERENCES role(roleID),
    FOREIGN KEY (divisionID) REFERENCES division(divisionID)
);

-- PERFORMANCE INDEXING (Crucial for n8n Automation)
-- n8n will frequently search "Find all employees in Division X"
CREATE INDEX idx_user_division ON user(divisionID);

-- 6. Resolve Circular Dependency
-- We add the constraint AFTER both tables exist.
-- We make it NULLABLE so you can create a division before assigning a manager.
ALTER TABLE division ADD COLUMN headOfDivisionID INT NULL;
ALTER TABLE division 
ADD CONSTRAINT fk_division_head 
FOREIGN KEY (headOfDivisionID) REFERENCES user(userID) ON DELETE SET NULL;