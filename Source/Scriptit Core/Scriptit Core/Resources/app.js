///////////////////////////////////////////////////////////

console.log("isStringEmpty - empty string:", validator.isStringEmpty({ string: "" }));
console.log("isStringEmpty - whitespace:", validator.isStringEmpty({ string: "   " }));
console.log("isStringEmpty - 'hello':", validator.isStringEmpty({ string: "hello" }));
console.log("isStringEmpty - '  world  ':", validator.isStringEmpty({ string: "  world  " }));

console.log("isValidEmail - valid 1:", validator.isValidEmail({ email: "user@example.com" }));
console.log("isValidEmail - valid 2:", validator.isValidEmail({ email: "test.user@domain.co" }));
console.log("isValidEmail - invalid 1:", validator.isValidEmail({ email: "invalidemail" }));
console.log("isValidEmail - invalid 2:", validator.isValidEmail({ email: "user@.com" }));

console.log("isValidPhoneNumber - valid 1:", validator.isValidPhoneNumber({ phoneNumber: "1234567890" }));
console.log("isValidPhoneNumber - valid 2:", validator.isValidPhoneNumber({ phoneNumber: "+14155552671" }));
console.log("isValidPhoneNumber - invalid 1:", validator.isValidPhoneNumber({ phoneNumber: "123-456" }));
console.log("isValidPhoneNumber - invalid 2:", validator.isValidPhoneNumber({ phoneNumber: "abc1234567" }));

console.log("isValidURL - valid 1:", validator.isValidURL({ url: "https://example.com" }));
console.log("isValidURL - valid 2:", validator.isValidURL({ url: "http://domain.co/path" }));
console.log("isValidURL - invalid 1:", validator.isValidURL({ url: "invalid-url" }));
console.log("isValidURL - invalid 2:", validator.isValidURL({ url: "example" }));

console.log("isValidPassword - valid 1:", validator.isValidPassword({ password: "StrongPass1" }));
console.log("isValidPassword - valid 2:", validator.isValidPassword({ password: "A1b2c3d4" }));
console.log("isValidPassword - invalid 1:", validator.isValidPassword({ password: "weak" }));
console.log("isValidPassword - invalid 2:", validator.isValidPassword({ password: "12345678" }));

console.log("isNumberInRange - valid 1:", validator.isNumberInRange({ number: 5, min: 1, max: 10 }));
console.log("isNumberInRange - valid 2:", validator.isNumberInRange({ number: 10, min: 10, max: 20 }));
console.log("isNumberInRange - invalid 1:", validator.isNumberInRange({ number: 0, min: 1, max: 10 }));
console.log("isNumberInRange - invalid 2:", validator.isNumberInRange({ number: 21, min: 10, max: 20 }));

console.log("isValidDate - valid 1:", validator.isValidDate({ dateString: "2023-05-01" }));
console.log("isValidDate - valid 2:", validator.isValidDate({ dateString: "1999-12-31" }));
console.log("isValidDate - invalid 1:", validator.isValidDate({ dateString: "2023/05/01" }));
console.log("isValidDate - invalid 2:", validator.isValidDate({ dateString: "invalid-date" }));

console.log("isValidUsername - valid 1:", validator.isValidUsername({ username: "user_name1" }));
console.log("isValidUsername - valid 2:", validator.isValidUsername({ username: "John123" }));
console.log("isValidUsername - invalid 1:", validator.isValidUsername({ username: "12" }));
console.log("isValidUsername - invalid 2:", validator.isValidUsername({ username: "thisIsWayTooLong123456" }));
console.log("isValidUsername - invalid 3:", validator.isValidUsername({ username: "bad@name!" }));

console.log("isValidCreditCardNumber - valid 1:", validator.isValidCreditCardNumber({ cardNumber: "4539578763621486" }));
console.log("isValidCreditCardNumber - valid 2:", validator.isValidCreditCardNumber({ cardNumber: "6011000990139424" }));
console.log("isValidCreditCardNumber - invalid 1:", validator.isValidCreditCardNumber({ cardNumber: "1234567890123456" }));
console.log("isValidCreditCardNumber - invalid 2:", validator.isValidCreditCardNumber({ cardNumber: "abcd123456" }));

///////////////////////////////////////////////////////////