///////////////////////////////////////////////////////////
// VALIDATION MODULE
///////////////////////////////////////////////////////////
 
/** Singleton class representing the ValidationManager object. */
class ValidationManager 
{
  #errors;
  static #instance = null;
 
  /** Creates the ValidationManager object. **/
  constructor() 
  {
    this.#errors = 
    {
      cardNumberTypeError: 'Validator Error: Expected type string for cardNumber.',
      dateStringTypeError: 'Validator Error: Expected type string for dateString.',
      emailTypeError: 'Validator Error: Expected type string for email.',
      htmlTypeErorr: 'Validator Error: Expected type string for html.',
      maxTypeError: 'Validator Error: Expected type number for max.',
      minTypeError: 'Validator Error: Expected type number for min.',
      numberTypeError: 'Validator Error: Expected type number for number.',
      passwordTypeError: 'Validator Error: Expected type string for password.',
      phoneNumberTypeError: 'Validator Error: Expected type string for phone number.',
      singleInstanceError: 'ValidationManager Error: Only one ValidationManager instance can exist at a time.',
      stringTypeError: 'Validator Error: Expected type string for string.',
      urlTypeError: 'Validator Error: Expected type string for url.',
      usernameTypeError: 'Validator Error: Expected type string for username.'
    };

    if(ValidationManager.#instance) console.error(this.#errors.singleInstanceError);
    else ValidationManager.#instance = this;
  }
 
  /** Static method to return a new ValidationManager instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new ValidationManager();
  }
 
  /**
   * Checks if a string is empty or contains only whitespace.
   * @param {string} string - The string to check.
   * @return {boolean} True if the string is empty, false otherwise.
   */
  isStringEmpty({ string } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: string })) console.error(this.#errors.stringTypeError);
    return !string || string.trim().length === 0;
  }
 
  /**
   * Checks if an email address is valid.
   * @param {string} email - The email address to check.
   * @return {boolean} True if the email address is valid, false otherwise.
   */
  isValidEmail({ email } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: email })) console.error(this.#errors.emailTypeError);
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Checks whether a string is plausibly valid HTML as parsed by WebKit.
   *
   * NOTE:
   * HTML parsing is error-tolerant by design.
   * This method detects severe or malformed input by checking
   * whether WebKit had to significantly repair the document.
   *
   * @param {String} html - The HTML string to validate.
   * @returns {Boolean} True if the HTML is structurally valid.
   */
  isValidHTML({ html } = {})
  {
    if(!typechecker.check({ type: 'string', value: html }))
    {
      console.error(this.#errors.htmlTypeError);
      return false;
    }
  
    let trimmed = html.trim();
    if(!trimmed) return false;
  
    try
    {
      let parser = new DOMParser();
      let doc = parser.parseFromString(trimmed, 'text/html');
      
      if(!doc || !doc.documentElement) return false;
  
      let htmlEl = doc.documentElement;
      if(htmlEl.nodeName.toLowerCase() !== 'html') return false;
  
      if(!doc.head || !doc.body) return false;
  
      let serialized = '<!DOCTYPE html>\n' + htmlEl.outerHTML;
  
      let inputNormalized = trimmed.replace(/\s+/g, ' ');
      let outputNormalized = serialized.replace(/\s+/g, ' ');
  
      if(outputNormalized.length < inputNormalized.length * 0.5) return false;
  
      let startsLikeHTML = /^\s*(<!doctype|<html|<head|<body)/i.test(trimmed);
      if(!startsLikeHTML) return false;
  
      return true;
    }
    catch { return false; }
  }
 
  /**
   * Checks if a phone number is valid.
   * @param {string} phoneNumber - The phone number to check.
   * @return {boolean} True if the phone number is valid, false otherwise.
   */
  isValidPhoneNumber({ phoneNumber } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: phoneNumber })) console.error(this.#errors.phoneNumberTypeError);
    let phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phoneNumber);
  }
 
  /**
   * Checks if a URL is valid.
   * @param {string} url - The URL to check.
   * @return {boolean} True if the URL is valid, false otherwise.
   */
  isValidURL({ url } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: url })) console.error(this.#errors.urlTypeError);
    let urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/;
    return urlRegex.test(url);
  }
 
  /**
   * Checks if a password meets requirements (min length, uppercase, lowercase, number).
   * @param {string} password - The password to check.
   * @return {boolean} True if the password is valid, false otherwise.
   */
  isValidPassword({ password } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: password })) console.error(this.#errors.passwordTypeError);
    let passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }
 
  /**
   * Checks if a number is within a specified range.
   * @param {number} number - The number to check.
   * @param {number} min - The minimum value of the range.
   * @param {number} max - The maximum value of the range.
   * @return {boolean} True if the number is within range, false otherwise.
   */
  isNumberInRange({ number, min, max } = {}) 
  {
    if(!typechecker.check({ type: 'number', value: number })) console.error(this.#errors.numberTypeError);
    if(!typechecker.check({ type: 'number', value: min })) console.error(this.#errors.minTypeError);
    if(!typechecker.check({ type: 'number', value: max })) console.error(this.#errors.maxTypeError);
    return typeof number === 'number' && number >= min && number <= max;
  }
 
  /**
   * Checks if a date string is valid and in the correct format (YYYY-MM-DD).
   * @param {string} dateString - The date string to check.
   * @return {boolean} True if the date is valid, false otherwise.
   */
  isValidDate({ dateString } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: dateString })) console.error(this.#errors.dateStringTypeError);

    let dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
 
    let date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
 
  /**
   * Checks if a username is valid (alphanumeric, underscores, 3-16 characters).
   * @param {string} username - The username to check.
   * @return {boolean} True if the username is valid, false otherwise.
   */
  isValidUsername({ username } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: username })) console.error(this.#errors.usernameTypeError);

    let usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    return usernameRegex.test(username);
  }
 
  /**
   * Validates a credit card number using the Luhn algorithm.
   * @param {string} cardNumber - The credit card number to check.
   * @return {boolean} True if the credit card number is valid, false otherwise.
   */
  isValidCreditCardNumber({ cardNumber } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: cardNumber })) console.error(this.#errors.cardNumberTypeError);

    let cardRegex = /^\d{13,19}$/;
    if(!cardRegex.test(cardNumber)) return false;
 
    let sum = 0;
    let shouldDouble = false;
 
    for(let i = cardNumber.length - 1; i >= 0; i--) 
    {
      let digit = parseInt(cardNumber[i], 10);
      if(shouldDouble) 
      {
        digit *= 2;
        if(digit > 9) digit -= 9;
      }
 
      sum += digit;
      shouldDouble = !shouldDouble;
    }
 
    return sum % 10 === 0;
  }
}

///////////////////////////////////////////////////////////

globalThis.validator = ValidationManager.getInstance();

///////////////////////////////////////////////////////////