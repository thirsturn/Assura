
// Update current user profile
router.put('/profile', verifyToken, userController.updateProfile);

// Update user by ID (Admin)
router.put('/:id', verifyToken, userController.updateUser);

// Search users
router.get('/search', verifyToken, userController.searchUsers);

module.exports = router;