function generate_password(password_length = 10) {
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let uppercase = lowercase.toLocaleUpperCase();
    let digits = '0123456789';
    let special = '!@#$%^&*()_+{}';

    var char_pool = lowercase + lowercase + uppercase + uppercase + digits + digits + special;
    var result = '';
    for (var i = 0, n = char_pool.length; i < password_length; ++i) {
        result += char_pool.charAt(Math.floor(Math.random() * n));
    }
    return result;
}
for (let i = 0; i < 10; i++) {
    var new_password = generate_password(process.argv[2]);
    console.log(new_password);
}
