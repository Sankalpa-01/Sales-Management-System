const bcrypt = require('bcryptjs');

bcrypt.hash("kanha123", 10).then((hash) => {
    console.log("Hashed Password:", hash);
});
